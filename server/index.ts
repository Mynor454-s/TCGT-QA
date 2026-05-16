import express from 'express';
import cors from 'cors';
import { testsRouter } from './routes/tests';
import { executionsRouter } from './routes/executions';
import { dataProvidersRouter } from './routes/data-providers';
import { reportsRouter } from './routes/reports';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve playwright reports as static files
app.use('/reports-static', express.static('playwright-report'));
app.use('/test-results-static', express.static('test-results'));

// API routes
app.use('/api/tests', testsRouter);
app.use('/api/executions', executionsRouter);
app.use('/api/data-providers', dataProvidersRouter);
app.use('/api/reports', reportsRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 TCGT-QA API running on port ${PORT}`);
});
