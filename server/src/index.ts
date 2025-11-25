import express from 'express';
import cors from 'cors';
import { initDatabase } from './database';
import authRoutes from './routes/auth';
import calculationRoutes from './routes/calculations';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: ['https://shrutiag14.github.io', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Initialize database
initDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/calculations', calculationRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
