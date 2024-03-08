// app.js

import express from 'express';
import { createServer } from 'http';
import connectToDatabase from './db.js';
import websocket from './websocket.js';

const port = 3000;
const app = express();
const server = createServer(app);

// Establish MongoDB connection
connectToDatabase();

// WebSocket setup
websocket(server);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
