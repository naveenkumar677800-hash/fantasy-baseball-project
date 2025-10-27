import { Player, Team, Draft, LeaderboardEntry } from '../types';

const API_BASE = '/api';

// Players
export const getPlayers = async (): Promise<Player[]> => {
  const response = await fetch(`${API_BASE}/players`);
  return response.json();
};

export const getAvailablePlayers = async (): Promise<Player[]> => {
  const response = await fetch(`${API_BASE}/players/available`);
  return response.json();
};

// Teams
export const getTeams = async (): Promise<Team[]> => {
  const response = await fetch(`${API_BASE}/teams`);
  return response.json();
};

export const getTeam = async (teamId: string): Promise<Team> => {
  const response = await fetch(`${API_BASE}/teams/${teamId}`);
  return response.json();
};

export const getTeamTop5 = async (teamId: string): Promise<Player[]> => {
  const response = await fetch(`${API_BASE}/teams/${teamId}/top5`);
  return response.json();
};

export const removePlayerFromTeam = async (teamId: string, playerId: string): Promise<Team> => {
  const response = await fetch(`${API_BASE}/teams/${teamId}/remove-player`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId }),
  });
  return response.json();
};

// Draft
export const startDraft = async (timePerPick: number = 60): Promise<{ draft: Draft; currentTeam: Team }> => {
  const response = await fetch(`${API_BASE}/draft/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timePerPick }),
  });
  return response.json();
};

export const getDraftStatus = async (): Promise<{ draft: Draft; currentTeam: Team }> => {
  const response = await fetch(`${API_BASE}/draft/status`);
  return response.json();
};

export const makeDraftPick = async (teamId: string, playerId: string) => {
  const response = await fetch(`${API_BASE}/draft/pick`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamId, playerId }),
  });
  return response.json();
};

export const triggerAutodraft = async () => {
  const response = await fetch(`${API_BASE}/draft/autodraft`, {
    method: 'POST',
  });
  return response.json();
};

export const getDraftSuggestions = async (teamId: string): Promise<Player[]> => {
  const response = await fetch(`${API_BASE}/draft/suggestions/${teamId}`);
  return response.json();
};

export const resetDraft = async () => {
  const response = await fetch(`${API_BASE}/draft/reset`, {
    method: 'POST',
  });
  return response.json();
};

// Leaderboard
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const response = await fetch(`${API_BASE}/leaderboard`);
  return response.json();
};

