import React, { useState } from 'react';
import { Player } from '../types';
import PlayerCard from './PlayerCard';
import { Search, Filter } from 'lucide-react';

interface PlayerListProps {
  players: Player[];
  onDraft: (player: Player) => void;
  canDraft: boolean;
  recommendations?: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players, onDraft, canDraft, recommendations = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'points' | 'name' | 'position'>('points');

  const filteredPlayers = players
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = positionFilter === 'ALL' || p.position === positionFilter;
      return matchesSearch && matchesPosition && !p.isDrafted;
    })
    .sort((a, b) => {
      if (sortBy === 'points') return (b.projectedPoints || 0) - (a.projectedPoints || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.position.localeCompare(b.position);
    });

  const recommendedIds = recommendations.map((r) => r.id);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Position:</span>
          </div>
          {['ALL', 'C', 'IF', 'OF', 'P'].map((pos) => (
            <button
              key={pos}
              onClick={() => setPositionFilter(pos)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                positionFilter === pos
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {pos}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="points">Points</option>
              <option value="name">Name</option>
              <option value="position">Position</option>
            </select>
          </div>
        </div>
      </div>

      {/* Player Count */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-bold">{filteredPlayers.length}</span> available players
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onDraft={onDraft}
            showDraftButton
            canDraft={canDraft}
            isRecommended={recommendedIds.includes(player.id)}
          />
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-semibold">No players found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default PlayerList;

