import React from 'react';
import { Team } from '../types';
import PlayerCard from './PlayerCard';
import { Users, Trophy, TrendingUp } from 'lucide-react';
import { calculatePlayerPoints } from '../utils/helpers';

interface TeamRosterProps {
  team: Team;
  onRemovePlayer?: (playerId: string) => void;
  showRemoveButton?: boolean;
}

const TeamRoster: React.FC<TeamRosterProps> = ({ team, onRemovePlayer, showRemoveButton = false }) => {
  const totalPoints = team.roster.reduce((sum, p) => sum + calculatePlayerPoints(p), 0);

  const getPositionStatus = (position: keyof Team['positionCounts']) => {
    const current = team.positionCounts[position];
    const max = team.maxPositions[position];
    const percentage = (current / max) * 100;
    
    return {
      current,
      max,
      percentage,
      isFull: current >= max,
      color: percentage >= 100 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-gray-300',
    };
  };

  return (
    <div className="space-y-4">
      {/* Team Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{team.name}</h2>
            <p className="text-primary-100">{team.owner}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-primary-100">Total Points</p>
            <p className="text-4xl font-bold">{totalPoints.toFixed(1)}</p>
          </div>
        </div>

        {/* Position Status Bars */}
        <div className="grid grid-cols-4 gap-3">
          {(['C', 'IF', 'OF', 'P'] as const).map((pos) => {
            const status = getPositionStatus(pos);
            return (
              <div key={pos} className="bg-white/10 rounded-lg p-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold">{pos}</span>
                  <span className="text-xs">
                    {status.current}/{status.max}
                  </span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${status.color} transition-all`}
                    style={{ width: `${Math.min(status.percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{team.roster.length}</p>
          <p className="text-sm text-gray-600">Players</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{totalPoints.toFixed(0)}</p>
          <p className="text-sm text-gray-600">Total Points</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {team.roster.length > 0 ? (totalPoints / team.roster.length).toFixed(1) : '0'}
          </p>
          <p className="text-sm text-gray-600">Avg Points</p>
        </div>
      </div>

      {/* Roster */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Roster</h3>
        {team.roster.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-semibold">No players yet</p>
            <p className="text-sm">Start drafting to build your team!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.roster.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onRemove={() => onRemovePlayer?.(player.id)}
                showRemoveButton={showRemoveButton}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamRoster;

