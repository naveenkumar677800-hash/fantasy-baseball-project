import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { formatTime } from '../utils/helpers';

interface DraftTimerProps {
  timeRemaining: number;
  isMyTurn: boolean;
  currentTeamName: string;
}

const DraftTimer: React.FC<DraftTimerProps> = ({ timeRemaining, isMyTurn, currentTeamName }) => {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (timeRemaining <= 10 && timeRemaining > 0) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  const getTimerColor = () => {
    if (timeRemaining <= 10) return 'text-red-600 bg-red-100 border-red-300';
    if (timeRemaining <= 30) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-green-600 bg-green-100 border-green-300';
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${isMyTurn ? 'bg-primary-50 border-primary-400' : 'bg-gray-50 border-gray-300'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">Current Pick:</p>
          <p className={`text-lg font-bold ${isMyTurn ? 'text-primary-700' : 'text-gray-800'}`}>
            {currentTeamName}
          </p>
          {isMyTurn && (
            <p className="text-sm text-primary-600 font-semibold mt-1 animate-pulse">
              🎯 Your turn to pick!
            </p>
          )}
        </div>

        <div className="text-center">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-600">Time Left</p>
          </div>
          <div
            className={`text-3xl font-bold px-4 py-2 rounded-lg border-2 ${getTimerColor()} ${
              shake ? 'animate-bounce' : ''
            }`}
          >
            {formatTime(timeRemaining)}
          </div>
          {timeRemaining <= 10 && (
            <div className="flex items-center gap-1 mt-2 text-red-600 text-xs font-semibold">
              <AlertCircle className="w-3 h-3" />
              Autodraft soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftTimer;

