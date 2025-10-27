import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import playersRouter from './routes/players';
import teamsRouter from './routes/teams';
import draftRouter from './routes/draft';
import leaderboardRouter from './routes/leaderboard';
import { draftService } from './services/draftService';
import { store } from './data/store';

const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/players', playersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/draft', draftRouter);
app.use('/api/leaderboard', leaderboardRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Set socket server for draft service
draftService.setSocketServer(io);

// WebSocket handlers
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join draft room
  socket.on('draft:join', (data) => {
    socket.join('draft-room');
    console.log(`Client ${socket.id} joined draft room`);
    
    // Send current draft state
    socket.emit('draft:state', {
      draft: store.getDraft(),
      teams: store.getAllTeams(),
      currentTeam: store.getCurrentDraftTeam(),
      availablePlayers: store.getAvailablePlayers()
    });
  });

  // Request current draft state
  socket.on('draft:getState', () => {
    socket.emit('draft:state', {
      draft: store.getDraft(),
      teams: store.getAllTeams(),
      currentTeam: store.getCurrentDraftTeam(),
      availablePlayers: store.getAvailablePlayers()
    });
  });

  // Make a pick via WebSocket
  socket.on('draft:selectPlayer', (data) => {
    const { teamId, playerId } = data;
    const pick = draftService.makePick(teamId, playerId);
    
    if (pick) {
      // Emit to all clients in the room
      io.to('draft-room').emit('draft:pick', {
        pick,
        draft: store.getDraft(),
        teams: store.getAllTeams(),
        currentTeam: store.getCurrentDraftTeam()
      });
    } else {
      socket.emit('draft:error', { message: 'Invalid draft pick' });
    }
  });

  // Request autodraft
  socket.on('draft:requestAutodraft', () => {
    const pick = draftService.autodraft();
    if (pick) {
      io.to('draft-room').emit('draft:pick', {
        pick,
        draft: store.getDraft(),
        teams: store.getAllTeams(),
        currentTeam: store.getCurrentDraftTeam()
      });
    }
  });

  // Leave draft room
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Fantasy Baseball API running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`📊 In-memory store initialized with ${store.getAllPlayers().length} players`);
});

