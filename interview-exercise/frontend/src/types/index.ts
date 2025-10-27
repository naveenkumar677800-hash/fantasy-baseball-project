export type Position = 'C' | 'IF' | 'OF' | 'P';

export interface PlayerStats {
  battingAverage?: number;
  homeRuns?: number;
  rbi?: number;
  stolenBases?: number;
  era?: number;
  strikeouts?: number;
  wins?: number;
}

export interface Player {
  id: string;
  name: string;
  position: Position;
  team: string;
  stats: PlayerStats;
  projectedPoints: number;
  isDrafted: boolean;
  draftedBy?: string;
  points?: number;
}

export interface Team {
  id: string;
  name: string;
  owner: string;
  roster: Player[];
  totalPoints: number;
  positionCounts: {
    C: number;
    IF: number;
    OF: number;
    P: number;
  };
  maxPositions: {
    C: number;
    IF: number;
    OF: number;
    P: number;
  };
}

export interface DraftPick {
  pickNumber: number;
  teamId: string;
  playerId: string;
  playerName: string;
  timestamp: Date;
  isAutodraft: boolean;
}

export interface Draft {
  id: string;
  status: 'pending' | 'active' | 'completed';
  currentPick: number;
  draftOrder: string[];
  timePerPick: number;
  currentPickStartTime: Date | null;
  picks: DraftPick[];
}

export interface LeaderboardEntry {
  rank: number;
  teamId: string;
  teamName: string;
  owner: string;
  totalPoints: number;
  playerCount: number;
}

