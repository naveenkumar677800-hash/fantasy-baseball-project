import { Player, PlayerWithPoints, Team } from '../types';

/**
 * Exercise 2 - Scenario A: Scoring Function
 * Calculates total points for a player based on their stats
 */
export function calculatePlayerPoints(player: Player): number {
  const { stats, position } = player;

  // Hitter scoring (C, IF, OF)
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
}

/**
 * Calculate total points for a team
 */
export function calculateTeamPoints(team: Team): number {
  return team.roster.reduce((total, player) => {
    return total + calculatePlayerPoints(player);
  }, 0);
}

/**
 * Exercise 2 - Scenario A: Return top 5 players by points
 */
export function getTop5Players(team: Team): PlayerWithPoints[] {
  return team.roster
    .map(player => ({
      ...player,
      points: calculatePlayerPoints(player)
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);
}

/**
 * Get all players with their calculated points
 */
export function getPlayersWithPoints(players: Player[]): PlayerWithPoints[] {
  return players.map(player => ({
    ...player,
    points: calculatePlayerPoints(player)
  }));
}

/**
 * Exercise 2 - Scenario B: Handle edge cases
 * Validate and sanitize player stats
 */
export function sanitizePlayerStats(player: Player): Player {
  const sanitized = { ...player };
  
  // Handle missing stats - set to 0 if undefined
  if (sanitized.stats) {
    sanitized.stats = {
      battingAverage: sanitized.stats.battingAverage ?? 0,
      homeRuns: sanitized.stats.homeRuns ?? 0,
      rbi: sanitized.stats.rbi ?? 0,
      stolenBases: sanitized.stats.stolenBases ?? 0,
      era: sanitized.stats.era ?? 0,
      strikeouts: sanitized.stats.strikeouts ?? 0,
      wins: sanitized.stats.wins ?? 0
    };
  } else {
    // Player has no stats at all - create default stats
    sanitized.stats = {
      battingAverage: 0,
      homeRuns: 0,
      rbi: 0,
      stolenBases: 0,
      era: 0,
      strikeouts: 0,
      wins: 0
    };
  }

  return sanitized;
}

