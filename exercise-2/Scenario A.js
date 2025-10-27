function calculatePlayerPoints(player) {
  const { avg = 0, hr = 0, rbi = 0, sb = 0 } = player;
  return (hr * 4) + (rbi * 1) + (sb * 2) + (avg * 100);
}

function getTopPlayers(players, topN = 5) {
  const scored = players.map(p => ({
    ...p,
    points: calculatePlayerPoints(p)
  }));

  return scored
    .sort((a, b) => b.points - a.points)
    .slice(0, topN);
}

const players = [
  { name: "Aaron Judge", avg: 0.311, hr: 62, rbi: 131, sb: 16 },
  { name: "Ronald Acuña Jr.", avg: 0.266, hr: 41, rbi: 101, sb: 73 },
  { name: "Mike Trout", avg: 0.283, hr: 40, rbi: 104, sb: 20 },
  { name: "Shohei Ohtani", avg: 0.275, hr: 15, rbi: 100, sb: 10 },
  { name: "Julio Rodriguez", avg: 0.275, hr: 32, rbi: 103, sb: 41 },
];

console.log(getTopPlayers(players));