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
  team: string; // MLB team
  stats: PlayerStats;
  projectedPoints: number;
  isDrafted: boolean;
  draftedBy?: string;
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
  draftOrder: string[]; // Array of team IDs
  timePerPick: number; // seconds
  currentPickStartTime: Date | null;
  picks: DraftPick[];
}

export interface PlayerWithPoints extends Player {
  points: number;
}

