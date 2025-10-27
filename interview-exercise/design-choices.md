# Design Choices and Assumptions

## Architecture Overview

I built this Fantasy Baseball Draft Platform using a full-stack TypeScript approach with Node.js/Express on the backend and React on the frontend. The main architectural decision was to use an in-memory data store rather than a database, which eliminates setup complexity while still demonstrating proper backend architecture patterns. I structured the backend with separate service layers for scoring, autodraft logic, and draft management, which keeps the business logic isolated from the API routes and makes the code maintainable and testable.

## Real-time Communication

For the draft timer and live updates, I chose WebSocket communication via Socket.io rather than HTTP polling. This provides instant updates when players are drafted and allows the timer to stay synchronized. The timer itself runs server-side rather than client-side to maintain a single source of truth and prevent timing inconsistencies. When a player is drafted, the server immediately broadcasts the update to all connected clients, ensuring everyone sees the same state.

## Draft System Design

I implemented this as a single-user draft experience where one person builds their team continuously rather than a turn-based multi-team system. The autodraft algorithm is position-aware, meaning it prioritizes filling empty roster spots before drafting backup players. When the timer expires, the system selects the best available player based on projected points while respecting position limits (1 catcher, 4 infielders, 3 outfielders, 3 pitchers). The draft completes when 11 players are selected, and the user can immediately start a new draft to build another team.

## Scoring and Data Model

The scoring system uses different formulas for hitters and pitchers. Hitters earn points based on batting average (×100), home runs (×4), RBIs (×1), and stolen bases (×2). Pitchers earn points from wins (×5) and strikeouts (×1), minus ERA (×2) since lower ERA is better. I chose these multipliers to balance the contribution of different statistical categories. The player data includes 20 real baseball players with realistic stats, and all calculations handle edge cases like missing statistics by defaulting to zero rather than causing errors.

## Trade-offs and Future Improvements

The in-memory storage approach means data doesn't persist between server restarts, which is acceptable for a demo but would require PostgreSQL or another database for production. I prioritized clean, readable code over premature optimization, focusing on demonstrating solid software engineering practices like separation of concerns, type safety with TypeScript, and proper error handling. Future enhancements could include advanced autodraft strategies using machine learning, support for multiple simultaneous drafts, and a mobile-responsive interface for drafting on phones.

