import { Player } from '../types';

export const calculatePlayerPoints = (player: Player): number => {
  const { stats, position } = player;

  // Hitter scoring
  if (position !== 'P') {
    return (
      (stats.battingAverage || 0) * 100 +
      (stats.homeRuns || 0) * 4 +
      (stats.rbi || 0) * 1 +
      (stats.stolenBases || 0) * 2
    );
  }

  // Pitcher scoring
  return (
    (stats.wins || 0) * 5 +
    (stats.strikeouts || 0) * 1 -
    (stats.era || 0) * 2
  );
};

export const formatPlayerStats = (player: Player): string => {
  if (player.position === 'P') {
    return `W: ${player.stats.wins || 0} | K: ${player.stats.strikeouts || 0} | ERA: ${(player.stats.era || 0).toFixed(2)}`;
  }
  return `AVG: ${(player.stats.battingAverage || 0).toFixed(3)} | HR: ${player.stats.homeRuns || 0} | RBI: ${player.stats.rbi || 0} | SB: ${player.stats.stolenBases || 0}`;
};

export const getPositionColor = (position: string): string => {
  const colors: { [key: string]: string } = {
    'C': 'bg-purple-100 text-purple-800 border-purple-300',
    'IF': 'bg-blue-100 text-blue-800 border-blue-300',
    'OF': 'bg-green-100 text-green-800 border-green-300',
    'P': 'bg-orange-100 text-orange-800 border-orange-300',
  };
  return colors[position] || 'bg-gray-100 text-gray-800 border-gray-300';
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

