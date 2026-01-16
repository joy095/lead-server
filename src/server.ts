import express from 'express';
import type {Request, Response, NextFunction} from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';
import logger from './utils/logger';
import { requestLogger } from './middleware/loggingMiddleware';

dotenv.config();

const app = express();

// Logging middleware
app.use(requestLogger);

// Middleware with better error handling for JSON parsing
app.use(cors());
app.use(
  express.json({
    limit: "1mb",
  })
);

// JSON parse error handler (MUST come after express.json)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    logger.error("Invalid JSON received", {
      url: req.url,
      method: req.method,
      error: err.message,
    });

    return res.status(400).json({
      success: false,
      message: "Invalid JSON format in request body",
    });
  }

  return next(err);
});

// Fallback for non-JSON requests that might have parsing issues
app.use((req, res, next) => {
  if ((req as any)._body === false) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid JSON format in request body' 
    });
  }
  return next();
});

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  logger.info('Health check endpoint accessed');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error occurred:', err);
  
  // Handle specific error types
  if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid JSON format in request body' 
    });
  }
  
  return res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { port: PORT });
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

export default app;