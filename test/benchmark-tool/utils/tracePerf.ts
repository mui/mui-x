import fs from 'node:fs';
import type { CDPSession, Page } from '@playwright/test';
import path from 'node:path';
import { routeToFileName } from './utils';

const tracesDir = path.resolve(__dirname, '../traces');

export class Trace {
  private started = false;
  private client: CDPSession | null = null;

  constructor(
    private page: Page,
    private route: string,
  ) {}

  async start() {
    this.started = true;
    this.client = await this.page.context().newCDPSession(this.page);

    // Start tracing with Performance panel categories
    await this.client.send('Tracing.start', {
      transferMode: 'ReturnAsStream',
      traceConfig: {
        includedCategories: [
          'devtools.timeline',
          'v8.execute',
          'disabled-by-default-devtools.timeline',
          'disabled-by-default-devtools.timeline.frame',
          'disabled-by-default-devtools.timeline.stack',
          'disabled-by-default-v8.cpu_profiler',
        ],
      },
    });
  }

  async stop() {
    if (!this.started) {
      return;
    }

    const client = this.client;

    if (!client) {
      throw new Error('Tracing not started');
    }

    this.started = false;

    const streamPromise = new Promise<string>((resolve, reject) => {
      client.on('Tracing.tracingComplete', async ({ stream: s }) => {
        if (s == null) {
          reject(new Error(`Tracing.tracingComplete`));
        }

        resolve(s!);
      });
    });

    await client.send('Tracing.end');

    const stream = await streamPromise;

    // Read the trace data
    let trace = '';
    let chunk;
    // eslint-disable-next-line no-await-in-loop,no-cond-assign
    while ((chunk = await client.send('IO.read', { handle: stream }))) {
      trace += chunk.data;

      if (chunk.eof) {
        break;
      }
    }
    await client.send('IO.close', { handle: stream });

    fs.mkdirSync(tracesDir, { recursive: true });

    const fileName = `${tracesDir}/${new Date().toISOString()}-${routeToFileName(this.route)}.json`;
    // Save as JSON - can be loaded directly into Chrome DevTools
    fs.writeFileSync(fileName, trace);

    // eslint-disable-next-line no-console
    console.log('Performance trace saved to:', fileName);
  }

  async discard() {
    if (!this.started) {
      return;
    }

    this.started = false;

    const client = this.client;

    if (!client) {
      throw new Error('Tracing not started');
    }

    const streamPromise = new Promise<string>((resolve, reject) => {
      client.on('Tracing.tracingComplete', async ({ stream: s }) => {
        if (s == null) {
          reject(new Error(`Tracing.tracingComplete`));
        }

        resolve(s!);
      });
    });

    await client.send('Tracing.end');

    const stream = await streamPromise;

    await client.send('IO.close', { handle: stream });
  }

  [Symbol.asyncDispose]() {
    return this.stop();
  }
}
