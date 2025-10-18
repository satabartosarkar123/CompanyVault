import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import companyRoutes from './routes/companyRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);

// Base route
app.get('/', (req, res) => res.send('Backend running...'));

// Error handling middleware should be last
app.use(errorHandler);

// Create a separate function to start the server
const startServer = () => {
  const PORT = process.env.PORT || 5000;
  return app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
};

// Only start the server if this file is run directly (not imported as a module)
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { app as default, startServer };
