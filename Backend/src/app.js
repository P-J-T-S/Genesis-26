
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { globalErrorHandler } from './utils/globalErrorHandler.js';


const app = express();


// CORS configuration
const allowedOrigins = (
  process.env.CORS_ORIGIN || 'http://localhost:5173'
).split(',');

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());


// Routes
import authRoutes from './routes/auth.route.js';
import zonesRoutes from './routes/zones.route.js';
import feedRoutes from './routes/feed.route.js';
import signalRoutes from './routes/signal.route.js';
import priorityRoutes from './routes/priority.route.js';
import wpiRoutes from './routes/wpi.routes.js';
import intelligenceRoutes from './routes/intelligence.routes.js';
import creditRoutes from './routes/credit.route.js';
import recommendationRoutes from './routes/recommendation.route.js';
import forecastRoutes from './routes/forecast.route.js';
import { mapMLSignalsToRecSignals } from './utils/mapMLSignals.js';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/zones', zonesRoutes);
app.use('/api/v1/feed', feedRoutes);
app.use('/api/v1/signals', signalRoutes);
app.use('/api/v1/priority', priorityRoutes);
app.use('/api/v1/wpi', wpiRoutes);
app.use('/api/v1', intelligenceRoutes);
app.use('/api/v1/credit', creditRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/intelligence', intelligenceRoutes);
app.use('/api/v1/forecast', forecastRoutes);

// error handler
app.use(globalErrorHandler);


export { app };
