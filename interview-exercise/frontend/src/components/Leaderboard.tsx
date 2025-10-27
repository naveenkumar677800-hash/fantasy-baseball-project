import React from 'react';
import { LeaderboardEntry } from '../types';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />;
    return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-400';
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-400';
    if (rank === 3) return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-400';
    return 'bg-white border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-7 h-7" />
          Leaderboard
        </h2>
        <p className="text-primary-100 mt-1">Real-time team rankings</p>
      </div>

      <div className="p-6 space-y-3">
        {entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-semibold">No teams yet</p>
            <p className="text-sm">Start drafting to see rankings!</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.teamId}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md ${getRankBg(
                entry.rank
              )}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12">
                  {getRankIcon(entry.rank)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{entry.teamName}</h3>
                  <p className="text-sm text-gray-600">{entry.owner}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">{entry.totalPoints.toFixed(1)}</p>
                <p className="text-xs text-gray-500">{entry.playerCount} players</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

