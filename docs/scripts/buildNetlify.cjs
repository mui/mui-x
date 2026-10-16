const { spawnSync } = require('node:child_process');
const { readFileSync } = require('node:fs');

const MEMORY_FILES = [
  '/sys/fs/cgroup/memory.max',
  '/sys/fs/cgroup/memory.peak',
  '/sys/fs/cgroup/memory.events',
  '/sys/fs/cgroup/memory/memory.limit_in_bytes',
  '/sys/fs/cgroup/memory/memory.max_usage_in_bytes',
  '/sys/fs/cgroup/memory/memory.failcnt',
];

function logMemory(phase) {
  for (const file of MEMORY_FILES) {
    try {
      process.stdout.write(`[netlify ${phase}] ${file}:\n${readFileSync(file, 'utf8').trim()}\n`);
    } catch {
      // Cgroup files vary by host; diagnostics must not block the build.
    }
  }
}

process.stdout.write(`[netlify] Node ${process.version}\n`);
for (const name of ['NODE_OPTIONS', 'NEXT_WEBPACK_PARALLELISM']) {
  process.stdout.write(`[netlify] ${name}=${process.env[name] ?? '(unset)'}\n`);
}

logMemory('before');
const result = spawnSync('pnpm', ['docs:build'], { stdio: 'inherit' });
logMemory('after');

if (result.error) {
  throw result.error;
}

if (result.signal) {
  process.kill(process.pid, result.signal);
} else {
  process.exitCode = result.status;
}
