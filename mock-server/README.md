# Mock Socket.io Server

This is a temporary mock server used to test the frontend while the real backend is being developed.

## Purpose

- Simulates realtime Socket.io events
- Emits mock data: players, scores, current word, game status
- Allows frontend development without waiting for the backend

## Running the Mock Server

cd mock-server
npm install   # first time only
node server.js

The server runs on http://localhost:3001.

## Events Emitted

- player-joined: { players: string[] } — On connection
- word-updated: { word: string } — Every 8 seconds
- score-updated: { player: string, points: number } — Every 5 seconds
- game-started: { status: string } — On connection

## Switching to the Real Backend

When the real backend is ready, change the Socket.io URL in client/src/store/gameStore.ts from http://localhost:3001 to http://localhost:3000.