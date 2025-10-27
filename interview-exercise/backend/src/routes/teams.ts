import express from 'express';
import { store } from '../data/store';
import { calculateTeamPoints, getTop5Players, sanitizePlayerStats } from '../services/scoringService';

const router = express.Router();

/**
 * GET /api/teams - Get all teams
 */
router.get('/', (req, res) => {
  const teams = store.getAllTeams();
  res.json(teams);
});

/**
 * Exercise 2 - Scenario B: Get team with current points
 * GET /api/teams/:id - Get specific team with roster and points
 */
router.get('/:id', (req, res) => {
  const team = store.getTeam(req.params.id);
  
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  // Handle edge case: sanitize player stats
  const sanitizedRoster = team.roster.map(sanitizePlayerStats);
  
  // Calculate current points
  const teamWithSanitized = { ...team, roster: sanitizedRoster };
  const totalPoints = calculateTeamPoints(teamWithSanitized);

  res.json({
    ...teamWithSanitized,
    totalPoints,
    calculatedAt: new Date()
  });
});

/**
 * Exercise 2 - Scenario A: Get top 5 players by points
 * GET /api/teams/:id/top5 - Get team's top 5 players
 */
router.get('/:id/top5', (req, res) => {
  const team = store.getTeam(req.params.id);
  
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  const top5 = getTop5Players(team);
  res.json(top5);
});

/**
 * GET /api/teams/:id/points - Calculate and return team points
 */
router.get('/:id/points', (req, res) => {
  const team = store.getTeam(req.params.id);
  
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  const totalPoints = calculateTeamPoints(team);
  
  res.json({
    teamId: team.id,
    teamName: team.name,
    totalPoints,
    playerCount: team.roster.length
  });
});

/**
 * POST /api/teams/:id/remove-player - Remove player from team
 */
router.post('/:id/remove-player', (req, res) => {
  const { playerId } = req.body;
  
  if (!playerId) {
    return res.status(400).json({ error: 'playerId is required' });
  }

  const success = store.removePlayerFromTeam(req.params.id, playerId);
  
  if (!success) {
    return res.status(400).json({ error: 'Failed to remove player' });
  }

  const team = store.getTeam(req.params.id);
  res.json(team);
});

export default router;

