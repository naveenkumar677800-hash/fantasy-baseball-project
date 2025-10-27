# Fantasy Baseball Draft Platform

A real-time fantasy baseball draft application built with React and Node.js.

## Prerequisites

- Node.js version 18 or higher
- npm (comes with Node.js)

## Running the Application

### Step 1: Start the Backend Server

Open a terminal window and run:

```bash
cd backend
npm install
npm run dev
```

The backend server will start on http://localhost:3000

### Step 2: Start the Frontend Application

Open a second terminal window and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on http://localhost:5173

### Step 3: Open the Application

Open your web browser and navigate to http://localhost:5173

## Using the Draft System

Once the application is running, click the "Start Draft" button to begin. You can draft players by clicking the "Draft" button on any available player card. The system includes a 60-second timer per pick, and if time expires, it will automatically draft the best available player for you.

You have 11 roster spots to fill with specific position requirements: 1 catcher, 4 infielders, 3 outfielders, and 3 pitchers. Once your roster is complete, you can start a new draft to build another team.

## Features

The application includes player search and filtering, real-time draft timer, automatic draft selection when time expires, position limit enforcement, and a live leaderboard showing team rankings by points.

## Technical Details

The backend uses Node.js with Express for the API and Socket.io for real-time updates. The frontend is built with React and TypeScript, using Tailwind CSS for styling. All data is stored in memory, so restarting the server will reset the draft state.

## API Endpoints

If you want to interact with the API directly, the following endpoints are available:

- GET /api/players - List all players
- GET /api/players/available - List undrafted players
- GET /api/teams - List all teams
- GET /api/teams/:id - Get specific team details
- GET /api/teams/:id/top5 - Get team's top 5 players by points
- POST /api/draft/start - Start a new draft
- POST /api/draft/pick - Make a draft selection
- GET /api/leaderboard - Get team rankings

## Troubleshooting

If you encounter "port already in use" errors, make sure no other applications are running on ports 3000 or 5173. You can kill processes using these ports or change the port configuration in the respective config files.

If the WebSocket connection fails, verify that both the backend and frontend are running and that your firewall is not blocking the connections.

## Design Documentation

For information about design decisions and architecture, see design-choices.md

