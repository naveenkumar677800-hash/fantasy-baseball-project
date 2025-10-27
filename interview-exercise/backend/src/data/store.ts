import { Player, Team, Draft, DraftPick } from '../types';
import playersData from './players.json';

class InMemoryStore {
  private players: Map<string, Player> = new Map();
  private teams: Map<string, Team> = new Map();
  private draftState: Draft | null = null;
  private draftTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initializePlayers();
    this.initializeTeams();
  }

  // Players
  getAllPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }

  getAvailablePlayers(): Player[] {
    return this.getAllPlayers().filter(p => !p.isDrafted);
  }

  updatePlayer(id: string, data: Partial<Player>): Player | null {
    const player = this.players.get(id);
    if (player) {
      const updated = { ...player, ...data };
      this.players.set(id, updated);
      return updated;
    }
    return null;
  }

  // Teams
  getAllTeams(): Team[] {
    return Array.from(this.teams.values());
  }

  getTeam(id: string): Team | undefined {
    return this.teams.get(id);
  }

  updateTeam(id: string, data: Partial<Team>): Team | null {
    const team = this.teams.get(id);
    if (team) {
      const updated = { ...team, ...data };
      this.teams.set(id, updated);
      return updated;
    }
    return null;
  }

  addPlayerToTeam(teamId: string, playerId: string): boolean {
    const team = this.teams.get(teamId);
    const player = this.players.get(playerId);

    if (!team || !player || player.isDrafted) {
      return false;
    }

    // Update player
    player.isDrafted = true;
    player.draftedBy = teamId;

    // Update team
    team.roster.push(player);
    team.positionCounts[player.position]++;

    this.players.set(playerId, player);
    this.teams.set(teamId, team);

    return true;
  }

  removePlayerFromTeam(teamId: string, playerId: string): boolean {
    const team = this.teams.get(teamId);
    const player = this.players.get(playerId);

    if (!team || !player) {
      return false;
    }

    // Update player
    player.isDrafted = false;
    delete player.draftedBy;

    // Update team
    team.roster = team.roster.filter(p => p.id !== playerId);
    team.positionCounts[player.position]--;

    this.players.set(playerId, player);
    this.teams.set(teamId, team);

    return true;
  }

  // Draft
  getDraft(): Draft | null {
    return this.draftState;
  }

  setDraft(draft: Draft): void {
    this.draftState = draft;
  }

  addDraftPick(pick: DraftPick): void {
    if (this.draftState) {
      this.draftState.picks.push(pick);
    }
  }

  getCurrentDraftTeam(): Team | null {
    if (!this.draftState || this.draftState.status !== 'active') {
      return null;
    }

    const currentIndex = this.draftState.currentPick % this.draftState.draftOrder.length;
    const teamId = this.draftState.draftOrder[currentIndex];
    return this.teams.get(teamId) || null;
  }

  getDraftTimer(): NodeJS.Timeout | null {
    return this.draftTimer;
  }

  setDraftTimer(timer: NodeJS.Timeout | null): void {
    if (this.draftTimer) {
      clearInterval(this.draftTimer);
    }
    this.draftTimer = timer;
  }

  clearDraftTimer(): void {
    if (this.draftTimer) {
      clearInterval(this.draftTimer);
      this.draftTimer = null;
    }
  }

  // Reset
  reset(): void {
    this.players.clear();
    this.teams.clear();
    this.draftState = null;
    this.clearDraftTimer();
    this.initializePlayers();
    this.initializeTeams();
  }

  private initializePlayers(): void {
    (playersData as Player[]).forEach(player => {
      this.players.set(player.id, { ...player, isDrafted: false });
    });
  }

  private initializeTeams(): void {
    // Initialize 4 teams for demo
    const teamNames = ['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta'];
    teamNames.forEach((name, index) => {
      const teamId = `team-${index + 1}`;
      this.teams.set(teamId, {
        id: teamId,
        name: name,
        owner: `User ${index + 1}`,
        roster: [],
        totalPoints: 0,
        positionCounts: { C: 0, IF: 0, OF: 0, P: 0 },
        maxPositions: { C: 1, IF: 4, OF: 3, P: 3 }
      });
    });
  }
}

export const store = new InMemoryStore();

