import { Router } from 'express';
import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';

export const executionsRouter = Router();

interface ExecutionRun {
  id: string;
  config: {
    grep?: string;
    file?: string;
    environment: string;
    mode: string;
    workers?: number;
  };
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  results?: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
  };
  pid?: number;
}

// In-memory store (SQLite in future)
const executions = new Map<string, ExecutionRun>();

// POST /api/executions
executionsRouter.post('/', (req, res) => {
  const { grep, file, environment = 'qa', mode = 'local', workers } = req.body;

  const id = randomUUID();
  const projectRoot = path.resolve(__dirname, '../..');
  const resultsDir = path.join(projectRoot, 'test-results', id);

  // Build playwright command args
  const args: string[] = ['playwright', 'test'];
  if (grep) args.push('--grep', grep);
  if (file) {
    // Support multiple files separated by space
    const files = file.split(' ').filter((f: string) => f.trim());
    args.push(...files);
  }
  if (workers) args.push('--workers', String(workers));
  args.push('--reporter', `json,html`);
  args.push('--output', resultsDir);

  const env = {
    ...process.env,
    ENV: environment,
    PLAYWRIGHT_JSON_OUTPUT_NAME: path.join(resultsDir, 'results.json'),
  };

  const run: ExecutionRun = {
    id,
    config: { grep, file, environment, mode, workers },
    status: 'running',
    startedAt: new Date().toISOString(),
  };

  executions.set(id, run);

  // Ensure results directory exists
  fs.mkdirSync(resultsDir, { recursive: true });

  // Spawn playwright process
  const command = mode === 'browserstack' ? 'npx' : 'npx';
  const fullArgs = mode === 'browserstack'
    ? ['browserstack-node-sdk', 'playwright', 'test', ...(grep ? ['--grep', grep] : []), ...(file ? [file] : [])]
    : args;

  const child = spawn(command, fullArgs, {
    cwd: projectRoot,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });

  run.pid = child.pid;

  // Timeout: kill process after 5 minutes
  const timeout = setTimeout(() => {
    if (run.status === 'running' && run.pid) {
      try { process.kill(run.pid, 'SIGTERM'); } catch {}
      run.status = 'failed';
      run.completedAt = new Date().toISOString();
      executions.set(run.id, run);
    }
  }, 5 * 60 * 1000);

  let stdout = '';
  let stderr = '';

  child.stdout.on('data', (data) => { stdout += data.toString(); });
  child.stderr.on('data', (data) => { stderr += data.toString(); });

  child.on('close', (code) => {
    clearTimeout(timeout);
    run.completedAt = new Date().toISOString();
    run.status = code === 0 ? 'completed' : 'failed';
    run.pid = undefined;

    // Parse stdout for quick results if no JSON file
    if (!fs.existsSync(path.join(resultsDir, 'results.json'))) {
      // Try to extract pass/fail counts from stdout
      const passMatch = stdout.match(/(\d+) passed/);
      const failMatch = stdout.match(/(\d+) failed/);
      if (passMatch || failMatch) {
        const passed = passMatch ? parseInt(passMatch[1]) : 0;
        const failed = failMatch ? parseInt(failMatch[1]) : 0;
        const duration = new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime();
        run.results = { total: passed + failed, passed, failed, skipped: 0, duration };
      }
    }

    // Try to parse results
    const resultsFile = path.join(resultsDir, 'results.json');
    if (fs.existsSync(resultsFile)) {
      try {
        const rawResults = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
        const suites = rawResults.suites || [];
        let total = 0, passed = 0, failed = 0, skipped = 0;

        function countSpecs(suite: any) {
          for (const spec of suite.specs || []) {
            for (const test of spec.tests || []) {
              total++;
              const status = test.results?.[0]?.status;
              if (status === 'passed') passed++;
              else if (status === 'failed' || status === 'timedOut') failed++;
              else skipped++;
            }
          }
          for (const child of suite.suites || []) {
            countSpecs(child);
          }
        }

        suites.forEach(countSpecs);
        const duration = new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime();

        run.results = { total, passed, failed, skipped, duration };
      } catch (e) {
        console.error('Error parsing results:', e);
      }
    }

    executions.set(id, run);
  });

  res.status(201).json(run);
});

// GET /api/executions
executionsRouter.get('/', (_req, res) => {
  const all = Array.from(executions.values())
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  res.json(all);
});

// GET /api/executions/:id
executionsRouter.get('/:id', (req, res) => {
  const run = executions.get(req.params.id);
  if (!run) return res.status(404).json({ error: 'Execution not found' });
  res.json(run);
});

// POST /api/executions/:id/cancel
executionsRouter.post('/:id/cancel', (req, res) => {
  const run = executions.get(req.params.id);
  if (!run) return res.status(404).json({ error: 'Execution not found' });
  if (run.status !== 'running') return res.status(400).json({ error: 'Execution is not running' });

  if (run.pid) {
    try {
      // Kill entire process tree (playwright + chrome)
      process.kill(-run.pid, 'SIGKILL');
    } catch {
      try { process.kill(run.pid, 'SIGKILL'); } catch {}
    }
  }
  run.status = 'cancelled';
  run.completedAt = new Date().toISOString();
  run.pid = undefined;
  executions.set(run.id, run);

  res.json(run);
});
