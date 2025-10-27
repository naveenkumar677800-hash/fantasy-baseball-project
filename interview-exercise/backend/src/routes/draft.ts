import express from 'express';
import { draftService } from '../services/draftService';
import { autodraftService } from '../services/autodraftService';
import { store } from '../data/store';

const router = express.Router();

/**
 * POST /api/draft/start - Start a new draft
 */
router.post('/start', (req, res) => {
  const { timePerPick = 60 } = req.body;
  
  const draft = draftService.startDraft(timePerPick);
  
  res.json({
    draft,
    currentTeam: store.getCurrentDraftTeam(),
    teams: store.getAllTeams()
  });
});

/**
 * GET /api/draft/status - Get current draft status
 */
router.get('/status', (req, res) => {
  const draft = store.getDraft();
  
  if (!draft) {
    return res.status(404).json({ error: 'No active draft' });
  }

  res.json({
    draft,
    currentTeam: store.getCurrentDraftTeam(),
    availablePlayers: store.getAvailablePlayers().length
  });
});

/**
 * POST /api/draft/pick - Make a draft selection
 */
router.post('/pick', (req, res) => {
  const { teamId, playerId } = req.body;
  
  if (!teamId || !playerId) {
    return res.status(400).json({ error: 'teamId and playerId are required' });
  }

  const pick = draftService.makePick(teamId, playerId);
  
  if (!pick) {
    return res.status(400).json({ error: 'Invalid draft pick' });
  }

  res.json({
    pick,
    draft: store.getDraft(),
    currentTeam: store.getCurrentDraftTeam()
  });
});

/**
 * POST /api/draft/autodraft - Trigger autodraft for current pick
 */
router.post('/autodraft', (req, res) => {
  const pick = draftService.autodraft();
  
  if (!pick) {
    return res.status(400).json({ error: 'Autodraft failed' });
  }

  res.json({
    pick,
    draft: store.getDraft(),
    currentTeam: store.getCurrentDraftTeam()
  });
});

/**
 * GET /api/draft/suggestions/:teamId - Get suggested players for team
 */
router.get('/suggestions/:teamId', (req, res) => {
  const team = store.getTeam(req.params.teamId);
  
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  const availablePlayers = store.getAvailablePlayers();
  const suggestions = autodraftService.getSuggestedPlayers(team, availablePlayers);
  
  res.json(suggestions);
});

/**
 * POST /api/draft/reset - Reset the draft
 */
router.post('/reset', (req, res) => {
  draftService.resetDraft();
  res.json({ message: 'Draft reset successfully' });
});

export default router;

