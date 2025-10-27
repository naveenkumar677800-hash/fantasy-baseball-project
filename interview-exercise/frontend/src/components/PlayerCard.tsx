import React from 'react';
import { Player } from '../types';
import { calculatePlayerPoints, formatPlayerStats, getPositionColor } from '../utils/helpers';
import { UserPlus, Trash2, Trophy } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  onDraft?: (player: Player) => void;
  onRemove?: (player: Player) => void;
  showDraftButton?: boolean;
  showRemoveButton?: boolean;
  canDraft?: boolean;
  isRecommended?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onDraft,
  onRemove,
  showDraftButton = false,
  showRemoveButton = false,
  canDraft = false,
  isRecommended = false,
}) => {
  const points = calculatePlayerPoints(player);
  const positionColor = getPositionColor(player.position);

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 border-2 transition-all hover:shadow-lg ${
        isRecommended ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
      } ${player.isDrafted ? 'opacity-60' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-800">{player.name}</h3>
            {isRecommended && (
              <Trophy className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <p className="text-sm text-gray-600">{player.team}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${positionColor}`}>
          {player.position}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">Stats:</p>
        <p className="text-sm font-mono text-gray-700">{formatPlayerStats(player)}</p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">Points</p>
          <p className="text-xl font-bold text-primary-600">{points.toFixed(1)}</p>
        </div>

        {player.isDrafted && (
          <span className="text-xs text-red-600 font-semibold">DRAFTED</span>
        )}

        {showDraftButton && !player.isDrafted && (
          <button
            onClick={() => onDraft?.(player)}
            disabled={!canDraft}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
              canDraft
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Draft
          </button>
        )}

        {showRemoveButton && (
          <button
            onClick={() => onRemove?.(player)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;

