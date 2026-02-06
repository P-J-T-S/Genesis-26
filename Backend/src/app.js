import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './utils/globalErrorHandler.js';

const app = express();

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());


// Routes
import authRoutes from './routes/auth.route.js';
import zonesRoutes from './routes/zones.route.js';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/zones', zonesRoutes);
import feedRoutes from './routes/feed.route.js';
import signalRoutes from './routes/signal.route.js';
import priorityRoutes from './routes/priority.route.js';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/feed', feedRoutes);
app.use('/api/v1/signals', signalRoutes);
app.use('/api/v1/priority', priorityRoutes);

// error handler
app.use(globalErrorHandler);

export { app };