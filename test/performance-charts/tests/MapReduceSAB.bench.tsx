import { it, expect } from 'vitest';

interface PartitionResult {
  paths: string[];
  processingMs: number;
  start: number;
  end: number;
}

interface RunStats {
  workerCount: number;
  pointCount: number;
  total: number;
  extremumsMs: number;
  spawnMs: number;
  workerMaxMs: number;
  joinMs: number;
  pathsLen: number;
  note?: string;
}

function generate(n: number): Float64Array {
  const data = new Float64Array(2 * n);
  let s = 1;
  for (let i = 0; i < 2 * n; i += 1) {
    s = (s * 9301 + 49297) % 233280;
    data[i] = s / 233280;
  }
  return data;
}

function computeExtremums(data: Float64Array) {
  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;
  for (let i = 0; i < data.length; i += 2) {
    const x = data[i];
    const y = data[i + 1];
    if (x < xMin) {
      xMin = x;
    }
    if (x > xMax) {
      xMax = x;
    }
    if (y < yMin) {
      yMin = y;
    }
    if (y > yMax) {
      yMax = y;
    }
  }
  return { xMin, xMax, yMin, yMax };
}

async function runWithWorkers(workerCount: number, n: number): Promise<RunStats> {
  if (typeof SharedArrayBuffer === 'undefined') {
    return {
      workerCount,
      pointCount: n,
      total: 0,
      extremumsMs: 0,
      spawnMs: 0,
      workerMaxMs: 0,
      joinMs: 0,
      pathsLen: 0,
      note: 'SharedArrayBuffer unavailable (cross-origin isolation not enabled)',
    };
  }
  const start = performance.now();
  const seed = generate(n);
  const sab = new SharedArrayBuffer(seed.byteLength);
  new Float64Array(sab).set(seed);

  const tExtremums = performance.now();
  const { xMin, xMax, yMin, yMax } = computeExtremums(new Float64Array(sab));
  const extremumsMs = performance.now() - tExtremums;

  const tSpawn = performance.now();
  const workers: Worker[] = [];
  for (let w = 0; w < workerCount; w += 1) {
    workers.push(new Worker(new URL('./mapReduce/worker.ts', import.meta.url), { type: 'module' }));
  }
  const spawnMs = performance.now() - tSpawn;

  const partitionSize = Math.ceil(n / workerCount);
  const promises: Promise<PartitionResult>[] = workers.map((worker, i) => {
    return new Promise<PartitionResult>((resolve) => {
      worker.onmessage = (event: MessageEvent<PartitionResult>) => resolve(event.data);
      worker.postMessage({
        sab,
        start: i * partitionSize,
        end: Math.min((i + 1) * partitionSize, n),
        width: 800,
        height: 400,
        padding: 20,
        markerSize: 2,
        xMin,
        xMax,
        yMin,
        yMax,
      });
    });
  });

  const results = await Promise.all(promises);
  const tJoin = performance.now();
  // Concatenate paths in original order. Each result.paths is already in slice order.
  const allPaths: string[] = [];
  for (const r of results) {
    for (const p of r.paths) {
      allPaths.push(p);
    }
  }
  const joinMs = performance.now() - tJoin;
  const total = performance.now() - start;
  const workerMaxMs = Math.max(...results.map((r) => r.processingMs));

  for (const w of workers) {
    w.terminate();
  }

  return {
    workerCount,
    pointCount: n,
    total,
    extremumsMs,
    spawnMs,
    workerMaxMs,
    joinMs,
    pathsLen: allPaths.length,
  };
}

function logStats(label: string, samples: RunStats[]) {
  const note = samples[0].note;
  const mean = (xs: number[]) => xs.reduce((p, c) => p + c, 0) / xs.length;
  const totals = samples.map((s) => s.total);
  const workerMaxes = samples.map((s) => s.workerMaxMs);
  const spawns = samples.map((s) => s.spawnMs);
  const extremums = samples.map((s) => s.extremumsMs);
  const joins = samples.map((s) => s.joinMs);
  // eslint-disable-next-line no-console
  console.log(
    `[mapreduce] ${label.padEnd(28)} ` +
      (note ? `note="${note}"` : '') +
      `total_mean=${mean(totals).toFixed(2).padStart(8)}ms ` +
      `extr=${mean(extremums).toFixed(2).padStart(6)}ms ` +
      `spawn=${mean(spawns).toFixed(2).padStart(6)}ms ` +
      `worker_max=${mean(workerMaxes).toFixed(2).padStart(7)}ms ` +
      `join=${mean(joins).toFixed(2).padStart(6)}ms ` +
      `paths=${samples[0].pathsLen}`,
  );
}

const SIZES = [1_000_000] as const;
const WORKER_COUNTS = [1, 2, 4, 8] as const;
const RUNS = 5;

for (const n of SIZES) {
  it(`mapreduce ${n.toLocaleString()} pts — hardware concurrency = ${navigator.hardwareConcurrency}`, async () => {
    // eslint-disable-next-line no-console
    console.log(
      `[mapreduce] crossOriginIsolated=${(globalThis as unknown as { crossOriginIsolated: boolean }).crossOriginIsolated} ` +
        `SAB=${typeof SharedArrayBuffer !== 'undefined'} ` +
        `hardwareConcurrency=${navigator.hardwareConcurrency}`,
    );
    for (const wc of WORKER_COUNTS) {
      const samples: RunStats[] = [];
      for (let i = 0; i < RUNS; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        samples.push(await runWithWorkers(wc, n));
      }
      logStats(`workers=${wc}`, samples);
    }
    expect(true).toBe(true);
  }, 180_000);
}
