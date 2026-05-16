import { Router } from 'express';
import fs from 'fs';
import path from 'path';

export const reportsRouter = Router();

const RESULTS_DIR = path.resolve(__dirname, '../../test-results');
const REPORT_DIR = path.resolve(__dirname, '../../playwright-report');

// GET /api/reports/:id
reportsRouter.get('/:id', (req, res) => {
  const resultsFile = path.join(RESULTS_DIR, req.params.id, 'results.json');

  if (!fs.existsSync(resultsFile)) {
    // Try the default results.json (for latest run)
    const defaultFile = path.join(RESULTS_DIR, 'results.json');
    if (fs.existsSync(defaultFile)) {
      try {
        const content = JSON.parse(fs.readFileSync(defaultFile, 'utf-8'));
        return res.json(content);
      } catch {}
    }
    return res.status(404).json({ error: 'Report not found' });
  }

  try {
    const content = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
    res.json(content);
  } catch {
    res.status(500).json({ error: 'Error reading report' });
  }
});

// GET /api/reports/:id/html - returns URL to static HTML report
reportsRouter.get('/:id/html', (req, res) => {
  // Playwright generates report in playwright-report/ by default
  const indexFile = path.join(REPORT_DIR, 'index.html');
  if (fs.existsSync(indexFile)) {
    res.json({ url: '/reports-static/index.html' });
  } else {
    res.status(404).json({ error: 'HTML report not found. Run tests first.' });
  }
});

// GET /api/reports/latest
reportsRouter.get('/latest/summary', (_req, res) => {
  const resultsFile = path.join(RESULTS_DIR, 'results.json');
  if (!fs.existsSync(resultsFile)) {
    return res.status(404).json({ error: 'No results found' });
  }

  try {
    const raw = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
    const stats = raw.stats || {};
    res.json({
      total: stats.expected || 0,
      passed: stats.expected || 0,
      failed: stats.unexpected || 0,
      skipped: stats.skipped || 0,
      duration: stats.duration || 0,
    });
  } catch {
    res.status(500).json({ error: 'Error parsing results' });
  }
});
