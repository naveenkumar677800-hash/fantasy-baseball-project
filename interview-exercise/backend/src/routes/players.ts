import express from 'express';
import { store } from '../data/store';
import { getPlayersWithPoints } from '../services/scoringService';

const router = express.Router();

/**
 * GET /api/players - Get all players
 */
router.get('/', (req, res) => {
  const players = store.getAllPlayers();
  res.json(players);
});

/**
 * GET /api/players/available - Get available (undrafted) players
 */
router.get('/available', (req, res) => {
  const players = store.getAvailablePlayers();
  const withPoints = getPlayersWithPoints(players);
  res.json(withPoints);
});

/**
 * GET /api/players/:id - Get specific player
 */
router.get('/:id', (req, res) => {
  const player = store.getPlayer(req.params.id);
  
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  
  res.json(player);
});

export default router;

