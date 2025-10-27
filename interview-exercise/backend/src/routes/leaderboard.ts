import express from 'express';
import { store } from '../data/store';
import { calculateTeamPoints } from '../services/scoringService';

const router = express.Router();

/**
 * GET /api/leaderboard - Get teams ranked by points
 */
router.get('/', (req, res) => {
  const teams = store.getAllTeams();
  
  // Calculate points for each team
  const teamsWithPoints = teams.map(team => ({
    ...team,
    totalPoints: calculateTeamPoints(team)
  }));

  // Sort by points (descending)
  teamsWithPoints.sort((a, b) => b.totalPoints - a.totalPoints);

  // Add rank
  const leaderboard = teamsWithPoints.map((team, index) => ({
    rank: index + 1,
    teamId: team.id,
    teamName: team.name,
    owner: team.owner,
    totalPoints: team.totalPoints,
    playerCount: team.roster.length,
    roster: team.roster
  }));

  res.json(leaderboard);
});

export default router;

