import express from "express";
import { calculatePlayerPoints } from "./playerScoring.js";

const app = express();
app.use(express.json());

const users = {
  1: { id: 1, name: "Texas Rangers", playerIds: [1, 2] }
};

const players = [
  { id: 1, name: "Aaron Judge", avg: 0.311, hr: 62, rbi: 131, sb: 16 },
  { id: 2, name: "Shohei Ohtani", avg: 0.275, hr: 15, rbi: 100, sb: 10 },
  { id: 3, name: "Mike Trout", avg: 0.283, hr: 40, rbi: 104, sb: 20 }
];

app.get("/api/users/:userId/team", (req, res) => {
  const { userId } = req.params;
  const user = users[userId];

  if (!user) return res.status(404).json({ message: "User not found" });

  const teamPlayers = players
    .filter(p => user.playerIds.includes(p.id))
    .map(p => ({
      ...p,
      points: calculatePlayerPoints(p)
    }));

  const totalPoints = teamPlayers.reduce((sum, p) => sum + p.points, 0);

  res.json({
    userId: user.id,
    teamName: user.name,
    totalPoints,
    players: teamPlayers
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
