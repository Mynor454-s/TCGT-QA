import { Router } from 'express';
import fs from 'fs';
import path from 'path';

export const dataProvidersRouter = Router();

const DATA_DIR = path.resolve(__dirname, '../../data');

interface Dataset {
  id: string;
  name: string;
  file: string;
  keys: string[];
}

function getDatasets(): Dataset[] {
  const datasets: Dataset[] = [];
  const files = ['data_new_client.json', 'data_new_client_TCJ.json'];

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const keys = Object.keys(content);
        const id = file.replace('.json', '').replace(/_/g, '-');
        datasets.push({ id, name: file, file: `data/${file}`, keys });
      } catch {}
    }
  }

  return datasets;
}

// GET /api/data-providers
dataProvidersRouter.get('/', (_req, res) => {
  res.json(getDatasets());
});

// GET /api/data-providers/:id
dataProvidersRouter.get('/:id', (req, res) => {
  const datasets = getDatasets();
  const dataset = datasets.find(d => d.id === req.params.id);
  if (!dataset) return res.status(404).json({ error: 'Dataset not found' });

  const filePath = path.join(DATA_DIR, dataset.name);
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(content);
  } catch {
    res.status(500).json({ error: 'Error reading dataset' });
  }
});

// GET /api/data-providers/test-matrix
dataProvidersRouter.get('/test-matrix/config', (_req, res) => {
  const filePath = path.join(DATA_DIR, 'test-matrix.json');
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'test-matrix.json not found' });

  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(content);
  } catch {
    res.status(500).json({ error: 'Error reading test-matrix' });
  }
});
