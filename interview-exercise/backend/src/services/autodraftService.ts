import { Player, Team, Position } from '../types';
import { calculatePlayerPoints } from './scoringService';

export class AutodraftService {
  /**
   * Select the best available player for a team using intelligent logic
   */
  selectBestAvailablePlayer(team: Team, availablePlayers: Player[]): Player | null {
    if (availablePlayers.length === 0) {
      return null;
    }

    // 1. Get positions where team is under the limit
    const neededPositions = this.getNeededPositions(team);

    // 2. Filter available players by needed positions
    let candidates = availablePlayers.filter(p => 
      neededPositions.includes(p.position)
    );

    // 3. If no position needs, draft best available (but consider future needs)
    if (candidates.length === 0) {
      candidates = availablePlayers;
    }

    // 4. Sort by projected points (descending)
    candidates.sort((a, b) => b.projectedPoints - a.projectedPoints);

    // 5. Return top player
    return candidates[0];
  }

  /**
   * Get positions that the team still needs
   */
  getNeededPositions(team: Team): Position[] {
    const needs: Position[] = [];
    
    Object.entries(team.maxPositions).forEach(([position, max]) => {
      const pos = position as Position;
      if (team.positionCounts[pos] < max) {
        // Add position multiple times based on how many spots are open
        const spotsOpen = max - team.positionCounts[pos];
        for (let i = 0; i < spotsOpen; i++) {
          needs.push(pos);
        }
      }
    });

    return needs;
  }

  /**
   * Check if team can draft a player at a specific position
   */
  canDraftPosition(team: Team, position: Position): boolean {
    return team.positionCounts[position] < team.maxPositions[position];
  }

  /**
   * Suggest top 3 players for a team (for "who to draft" feature)
   */
  getSuggestedPlayers(team: Team, availablePlayers: Player[]): Player[] {
    const neededPositions = this.getNeededPositions(team);
    
    // Filter by needed positions
    const byPosition = availablePlayers
      .filter(p => neededPositions.includes(p.position))
      .sort((a, b) => b.projectedPoints - a.projectedPoints)
      .slice(0, 2);

    // Add best available regardless of position
    const bestAvailable = availablePlayers
      .sort((a, b) => b.projectedPoints - a.projectedPoints)[0];

    const suggestions = [...byPosition];
    if (bestAvailable && !suggestions.find(p => p.id === bestAvailable.id)) {
      suggestions.push(bestAvailable);
    }

    return suggestions.slice(0, 3);
  }

  /**
   * Get position priority for autodraft (positions with fewer options should be drafted earlier)
   */
  getPositionPriority(): Position[] {
    return ['C', 'P', 'OF', 'IF']; // Catcher is rarest, then pitchers, etc.
  }
}

export const autodraftService = new AutodraftService();

