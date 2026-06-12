// Standalone perf spike for Web Worker data transfer modes.
// Runs as a vitest browser test (not via @mui/internal-benchmark) because we
// want raw transfer timings, not React render timings.

import { it, expect } from 'vitest';

type Mode = 'main' | 'clone' | 'transfer' | 'sab';

interface Stats {
  mode: Mode;
  total: number;
  send: number;
  workerProcessing: number;
  receive: number;
  note?: string;
}

function generate(n: number) {
  const data = new Float64Array(2 * n);
  let s = 1;
  for (let i = 0; i < 2 * n; i += 1) {
    s = (s * 9301 + 49297) % 233280;
    data[i] = s / 233280;
  }
  return data;
}

function processSync(buffer: Float64Array) {
  for (let i = 0; i < buffer.length; i += 2) {
    buffer[i] = buffer[i] * 0.001;
    buffer[i + 1] = buffer[i + 1] * 0.001;
  }
}

async function runOnce(mode: Mode, n: number): Promise<Stats> {
  const data = generate(n);
  const start = performance.now();

  if (mode === 'main') {
    processSync(data);
    const total = performance.now() - start;
    return { mode, total, send: 0, workerProcessing: total, receive: 0 };
  }

  const worker = new Worker(new URL('./workerSpike/worker.ts', import.meta.url), {
    type: 'module',
  });

  const messageReceived = new Promise<{ processingMs: number }>((resolve) => {
    worker.onmessage = (e) => resolve(e.data as { processingMs: number });
  });

  const tBeforeSend = performance.now();

  try {
    if (mode === 'sab') {
      const sab = new SharedArrayBuffer(data.byteLength);
      new Float64Array(sab).set(data);
      worker.postMessage({ mode, sab });
    } else if (mode === 'transfer') {
      worker.postMessage({ mode, data }, [data.buffer]);
    } else {
      worker.postMessage({ mode, data });
    }
  } catch (err) {
    worker.terminate();
    return {
      mode,
      total: 0,
      send: 0,
      workerProcessing: 0,
      receive: 0,
      note: `unsupported: ${(err as Error).message}`,
    };
  }

  const send = performance.now() - tBeforeSend;
  const result = await messageReceived;
  const total = performance.now() - start;
  const workerProcessing = result.processingMs;
  const receive = total - send - workerProcessing;
  worker.terminate();

  return { mode, total, send, workerProcessing, receive };
}

const SIZES = [100_000, 1_000_000] as const;
const MODES: Mode[] = ['main', 'clone', 'transfer', 'sab'];
const RUNS = 5;

const results: Stats[][] = [];

for (const n of SIZES) {
  for (const mode of MODES) {
    it(`worker transfer ${n.toLocaleString()} pts — ${mode}`, async () => {
      const samples: Stats[] = [];
      for (let i = 0; i < RUNS; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        samples.push(await runOnce(mode, n));
      }
      const note = samples[0].note;
      const totals = samples.map((s) => s.total);
      const sends = samples.map((s) => s.send);
      const workers = samples.map((s) => s.workerProcessing);
      const receives = samples.map((s) => s.receive);
      const mean = (a: number[]) => a.reduce((p, c) => p + c, 0) / a.length;

      // eslint-disable-next-line no-console
      console.log(
        `[spike] n=${n} mode=${mode}` +
          (note ? ` note="${note}"` : '') +
          ` total_mean=${mean(totals).toFixed(2)}` +
          ` send_mean=${mean(sends).toFixed(2)}` +
          ` worker_mean=${mean(workers).toFixed(2)}` +
          ` recv_mean=${mean(receives).toFixed(2)}` +
          ` runs=${RUNS}`,
      );
      results.push(samples);
      expect(samples.length).toBe(RUNS);
    }, 60_000);
  }
}
