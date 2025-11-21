import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './api/auth/index';
import cors from 'cors';
import { createServer } from 'http';
import { setupWebSocketServer } from './ws/server';

console.log('[1] Imports complete');
console.log('[PID]', process.pid);

const app = express();
console.log('[2] Express app created');

const httpServer = createServer(app);
console.log('[3] HTTP server created');

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
console.log('[4] Body parser middleware added');

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
console.log('[5] CORS middleware added');

// Routes
app.use('/api/auth', authRoutes);
console.log('[6] Auth routes registered');

// Setup WebSocket server
console.log('[7] Setting up WebSocket server...');
const wsServer = setupWebSocketServer(httpServer);
console.log('[8] WebSocket server setup complete');

// Export so other routes can use it to broadcast messages
app.locals.wsServer = wsServer;

app.get('/', (req, res) => res.json({ ok: true, message: 'U4-Green-Africa backend' }));
console.log('[9] Root route registered');

console.log('[10] Starting httpServer.listen on 127.0.0.1...');
httpServer.listen(Number(port), '127.0.0.1', () => {
  // eslint-disable-next-line no-console
  console.log(`[LISTENING] Backend server listening on http://127.0.0.1:${port}`);
  // eslint-disable-next-line no-console
  console.log(`[LISTENING] WebSocket server listening on ws://127.0.0.1:${port}/ws`);
  // Print actual bound address info
  try {
    const addr = httpServer.address();
    // eslint-disable-next-line no-console
    console.log('[ADDR]', addr);
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('[ADDR ERROR]', e && e.message ? e.message : e);
  }
});
console.log('[11] listen() called, listening for connections');

httpServer.on('error', (err: any) => {
  // eslint-disable-next-line no-console
  console.error('[SERVER ERROR]', err.message);
  process.exit(1);
});

httpServer.on('close', () => {
  // eslint-disable-next-line no-console
  console.log('[SERVER CLOSED]');
});

process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection:', reason);
});

export default app;
