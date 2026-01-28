/* eslint-disable no-console */
import net from 'net';
import { spawn } from 'child_process';
import path from 'path';
import url from 'url';

const DEFAULT_PORT = 3001;
const MAX_PORT_ATTEMPTS = 10;

/**
 * Check if a port is available by attempting to create a server on it.
 */
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', () => {
      resolve(false);
    });

    server.once('listening', () => {
      server.close(() => {
        resolve(true);
      });
    });

    server.listen(port);
  });
}

/**
 * Find an available port starting from the given port.
 */
async function findAvailablePort(startPort: number, maxAttempts: number): Promise<number | null> {
  for (let i = 0; i < maxAttempts; i += 1) {
    const port = startPort + i;

    // eslint-disable-next-line no-await-in-loop
    if (await isPortAvailable(port)) {
      return port;
    }
    console.log(`Port ${port} is busy, trying next...`);
  }
  return null;
}

async function main() {
  const explicitPort = process.env.PORT;
  const preferredPort = explicitPort ? parseInt(explicitPort, 10) : DEFAULT_PORT;

  let port: number;

  if (explicitPort) {
    // When PORT is explicitly set, don't fallback - fail if busy
    if (!(await isPortAvailable(preferredPort))) {
      console.error(`\nError: Port ${preferredPort} is already in use.`);
      console.error('Stop the process using this port or set a different PORT.\n');
      process.exit(1);
    }
    port = preferredPort;
  } else {
    // Auto-detect available port starting from default
    const availablePort = await findAvailablePort(preferredPort, MAX_PORT_ATTEMPTS);
    if (availablePort === null) {
      console.error(
        `\nError: No available port found in range ${preferredPort}-${preferredPort + MAX_PORT_ATTEMPTS - 1}\n`,
      );
      process.exit(1);
    }
    port = availablePort;
  }

  if (!explicitPort && port !== DEFAULT_PORT) {
    console.log(`\n>>> Starting dev server on port ${port} (port ${DEFAULT_PORT} was busy)\n`);
  }

  const currentDir = url.fileURLToPath(new URL('.', import.meta.url));
  const docsDir = path.resolve(currentDir, '..');

  const nextProcess = spawn(`next dev --port ${port}`, {
    cwd: docsDir,
    stdio: 'inherit',
    shell: true,
  });

  process.on('SIGINT', () => nextProcess.kill('SIGINT'));
  process.on('SIGTERM', () => nextProcess.kill('SIGTERM'));
  nextProcess.on('exit', (code) => process.exit(code ?? 0));
}

main().catch((error) => {
  console.error('Failed to start dev server:', error);
  process.exit(1);
});
