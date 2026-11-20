import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health.routes';
import { authRouter } from './routes/auth.routes';
import { skillsRouter } from './routes/skills.routes';
import { candidateRouter } from './routes/candidate.routes';
import { jobsRouter } from './routes/jobs.routes';
import { employerRouter } from './routes/employer.routes';
import { errorHandler, AppError } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// API v1 routes
app.use('/api/v1', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/skills', skillsRouter);
app.use('/api/v1/candidate', candidateRouter);
app.use('/api/v1/jobs', jobsRouter);
app.use('/api/v1/employer', employerRouter);

// 404 handler
app.use((req, res, next) => {
  next(new AppError(404, 'NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found.`));
});

// Centralized error handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`DevPath Backend API is running on http://localhost:${PORT}`);
  });
}

export default app;
