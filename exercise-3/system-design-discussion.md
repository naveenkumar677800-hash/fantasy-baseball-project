# Exercise 3: System Design Discussion

## Scenario

The system should handle many users drafting players at the same time while keeping the experience fast and reliable.

## Architecture Overview

```
[Frontend] → [Backend] → [Database]
                 ↓
               [Cache]
```

## Explanation

The frontend (React or Next.js) connects to the backend through REST APIs for normal data and WebSockets for live updates. When a player is drafted, the backend updates the database and sends a WebSocket event to all clients so everyone sees the change instantly.

The backend is stateless, so it can scale horizontally. It uses Redis to cache active drafts and player data for quick reads, and PostgreSQL for persistent storage of users, teams, and stats.

## Scaling

As traffic grows, more backend instances can be added behind a load balancer. Redis helps reduce pressure on the database, and read replicas can be introduced for heavy reads.

## Summary

Start with a simple single backend and Redis cache for real-time updates. Later, expand to multiple services for drafting, scoring, and notifications if user volume increases.
