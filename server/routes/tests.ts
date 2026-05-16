import { Router } from 'express';
import { execSync } from 'child_process';
import path from 'path';

export const testsRouter = Router();

interface TestItem {
  id: string;
  title: string;
  file: string;
  tags: string[];
  priority: string;
  flow: string;
  scenarioId?: string;
}

function parsePlaywrightList(): TestItem[] {
  try {
    const projectRoot = path.resolve(__dirname, '../..');
    const output = execSync('npx playwright test --list 2>/dev/null', {
      cwd: projectRoot,
      encoding: 'utf-8',
      timeout: 30000,
    });

    // Group by file — each .spec.ts is one entry
    const fileMap = new Map<string, { titles: string[]; tags: Set<string> }>();

    for (const line of output.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const match = trimmed.match(/\[.+?\]\s+›\s+(.+\.spec\.ts):\d+(?::\d+)?\s+›\s+(.+)/);
      if (match) {
        const file = match[1];
        const title = match[2];
        const tags: string[] = (title.match(/@[\w-]+/g) || []);

        if (!fileMap.has(file)) {
          fileMap.set(file, { titles: [], tags: new Set() });
        }
        const entry = fileMap.get(file)!;
        entry.titles.push(title);
        tags.forEach(t => entry.tags.add(t));
      }
    }

    // Convert to TestItem array (one per file)
    const tests: TestItem[] = [];
    for (const [file, data] of fileMap) {
      const tags = Array.from(data.tags);
      const priority = tags.find(t => /^@P[0-3]$/.test(t))?.replace('@', '') || 'P2';
      const flow = tags.includes('@B2C') ? 'B2C' : tags.includes('@TCJ') ? 'TCJ' : 'B2B';
      const scenarioId = tags.find(t => /^@E2E/.test(t))?.replace('@', '');

      // Use first test title as description, or extract describe block name
      const firstTitle = data.titles[0];
      const describeName = firstTitle.split('›')[0]?.trim() || firstTitle;

      const id = Buffer.from(file).toString('base64url');
      const displayName = file.replace('flows/happypath/', '').replace('validations/', 'val/');

      tests.push({
        id,
        title: displayName,
        file,
        tags,
        priority,
        flow,
        scenarioId,
      });
    }

    return tests;
  } catch (error) {
    console.error('Error listing tests:', error);
    return [];
  }
}

// GET /api/tests
testsRouter.get('/', (_req, res) => {
  const tests = parsePlaywrightList();
  res.json(tests);
});

// GET /api/tests/tags
testsRouter.get('/tags', (_req, res) => {
  const tests = parsePlaywrightList();
  const tags = new Set<string>();
  tests.forEach(t => t.tags.forEach(tag => tags.add(tag)));
  res.json(Array.from(tags).sort());
});

// GET /api/tests/files
testsRouter.get('/files', (_req, res) => {
  const tests = parsePlaywrightList();
  const files = new Set<string>();
  tests.forEach(t => files.add(t.file));
  res.json(Array.from(files).sort());
});

// GET /api/tests/:id
testsRouter.get('/:id', (req, res) => {
  const tests = parsePlaywrightList();
  const test = tests.find(t => t.id === req.params.id);
  if (!test) return res.status(404).json({ error: 'Test not found' });
  res.json(test);
});
