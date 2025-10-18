import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import companyRoutes from './routes/companyRoutes.js';

dotenv.config();
const app = express();

if (process.env.NODE_ENV === 'test') {
  app.use((req, res, next) => {
    if (typeof req.body === 'undefined') {
      req.body = {};
    }
    next();
  });
} else {
  app.use(express.json());
}
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
  const server = app.listen(PORT, () => {
    const addressInfo = server.address();
    const actualPort = typeof addressInfo === 'object' && addressInfo?.port !== undefined
      ? addressInfo.port
      : PORT;
    console.log(`Server running at http://localhost:${actualPort}`);
  });
  return server;
};

const isDirectRun =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1];

// Only start the server if this file is run directly (not imported as a module)
if (process.env.NODE_ENV !== 'test' && isDirectRun) {
  startServer();
}

export { app as default, startServer };
