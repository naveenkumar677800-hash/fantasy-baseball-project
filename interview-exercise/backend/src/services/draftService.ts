import { Draft, DraftPick } from '../types';
import { store } from '../data/store';
import { autodraftService } from './autodraftService';
import { Server as SocketServer } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

export class DraftService {
  private io: SocketServer | null = null;

  setSocketServer(io: SocketServer): void {
    this.io = io;
  }

  /**
   * Initialize and start a new draft
   */
  startDraft(timePerPick: number = 60): Draft {
    // Clear existing draft and reset teams
    store.clearDraftTimer();
    store.reset();
    
    const teams = store.getAllTeams();
    
    const draft: Draft = {
      id: uuidv4(),
      status: 'active',
      currentPick: 0,
      draftOrder: teams.map(t => t.id),
      timePerPick,
      currentPickStartTime: new Date(),
      picks: []
    };

    store.setDraft(draft);
    this.startPickTimer();

    return draft;
  }

  /**
   * Make a draft pick (single-user mode)
   */
  makePick(teamId: string, playerId: string, isAutodraft: boolean = false): DraftPick | null {
    const draft = store.getDraft();
    const team = store.getTeam(teamId);
    const player = store.getPlayer(playerId);

    if (!draft || !team || !player) {
      return null;
    }

    // Validate player is available
    if (player.isDrafted) {
      return null;
    }

    // Check position limits
    if (!autodraftService.canDraftPosition(team, player.position)) {
      return null;
    }

    // Add player to team
    const success = store.addPlayerToTeam(teamId, playerId);
    if (!success) {
      return null;
    }

    // Record the pick
    const pick: DraftPick = {
      pickNumber: draft.currentPick,
      teamId,
      playerId,
      playerName: player.name,
      timestamp: new Date(),
      isAutodraft
    };

    store.addDraftPick(pick);

    // Increment pick counter
    draft.currentPick++;
    
    // Reset timer for next pick (single-user mode)
    draft.currentPickStartTime = new Date();
    store.setDraft(draft);

    // Restart timer
    this.startPickTimer();

    // Check if team is complete (11 players)
    const updatedTeam = store.getTeam(teamId);
    if (updatedTeam && updatedTeam.roster.length >= 11) {
      this.completeDraft();
    }

    // Emit socket event
    if (this.io) {
      this.io.emit('draft:pick', {
        pick,
        draft: store.getDraft(),
        teams: store.getAllTeams()
      });
    }

    return pick;
  }

  /**
   * Trigger autodraft for current team (single-user mode)
   */
  autodraft(): DraftPick | null {
    const teams = store.getAllTeams();
    const myTeam = teams[0]; // First team is the user's team
    
    if (!myTeam) {
      return null;
    }

    const availablePlayers = store.getAvailablePlayers();
    const bestPlayer = autodraftService.selectBestAvailablePlayer(myTeam, availablePlayers);

    if (!bestPlayer) {
      return null;
    }

    console.log(`Autodrafting ${bestPlayer.name} for ${myTeam.name}`);
    return this.makePick(myTeam.id, bestPlayer.id, true);
  }

  /**
   * Start the timer for current pick
   */
  private startPickTimer(): void {
    const draft = store.getDraft();
    if (!draft || draft.status !== 'active') {
      return;
    }

    // Check if team is complete
    const teams = store.getAllTeams();
    const myTeam = teams[0];
    if (myTeam && myTeam.roster.length >= 11) {
      this.completeDraft();
      return;
    }

    // Clear existing timer
    store.clearDraftTimer();

    // Set new timer
    const timer = setInterval(() => {
      const currentDraft = store.getDraft();
      if (!currentDraft || currentDraft.status !== 'active') {
        store.clearDraftTimer();
        return;
      }

      // Check if team is complete
      if (myTeam && myTeam.roster.length >= 11) {
        store.clearDraftTimer();
        this.completeDraft();
        return;
      }

      const elapsed = Date.now() - new Date(currentDraft.currentPickStartTime!).getTime();
      const remaining = Math.max(0, (currentDraft.timePerPick * 1000) - elapsed);

      // Emit timer update
      if (this.io) {
        this.io.emit('draft:timerUpdate', {
          remaining: Math.floor(remaining / 1000),
          currentTeam: myTeam
        });
      }

      // Time expired - autodraft
      if (remaining <= 0) {
        store.clearDraftTimer();
        console.log('Time expired - triggering autodraft');
        
        if (this.io) {
          this.io.emit('draft:timeExpired', {
            team: myTeam
          });
        }

        // Autodraft after a short delay
        setTimeout(() => {
          this.autodraft();
        }, 1000);
      }
    }, 1000);

    store.setDraftTimer(timer);
  }

  /**
   * Complete the draft
   */
  private completeDraft(): void {
    const draft = store.getDraft();
    if (draft) {
      draft.status = 'completed';
      store.setDraft(draft);
      store.clearDraftTimer();

      if (this.io) {
        this.io.emit('draft:completed', {
          draft,
          teams: store.getAllTeams()
        });
      }
    }
  }

  /**
   * Get draft status
   */
  getDraftStatus(): Draft | null {
    return store.getDraft();
  }

  /**
   * Reset draft
   */
  resetDraft(): void {
    store.clearDraftTimer();
    store.reset();
  }
}

export const draftService = new DraftService();

