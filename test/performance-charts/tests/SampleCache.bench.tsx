import { it, expect } from 'vitest';
import { lttbIndices } from './sampleCache/lttb';
import { lttbIndicesCached, resetCacheStats, getCacheStats } from './sampleCache/cachedLttb';

function generate(n: number) {
  const xs = new Float64Array(n);
  const ys = new Float64Array(n);
  let s = 1;
  for (let i = 0; i < n; i += 1) {
    xs[i] = i;
    s = (s * 9301 + 49297) % 233280;
    ys[i] = 50 + Math.sin(i / 5) * 25 + (s / 233280 - 0.5) * 5;
  }
  return { xs, ys, ref: xs };
}

interface BenchResult {
  scenario: string;
  totalMs: number;
  callCount: number;
  hits: number;
  misses: number;
}

function runScenario(name: string, callCount: number, fn: (i: number) => void): BenchResult {
  resetCacheStats();
  const start = performance.now();
  for (let i = 0; i < callCount; i += 1) {
    fn(i);
  }
  const totalMs = performance.now() - start;
  const { hits, misses } = getCacheStats();
  return { scenario: name, totalMs, callCount, hits, misses };
}

function logResult(r: BenchResult) {
  // eslint-disable-next-line no-console
  console.log(
    `[cache] ${r.scenario.padEnd(48)} ` +
      `total=${r.totalMs.toFixed(2).padStart(8)}ms ` +
      `per_call=${(r.totalMs / r.callCount).toFixed(3).padStart(7)}ms ` +
      `calls=${r.callCount} hits=${r.hits} misses=${r.misses}`,
  );
}

const SIZES = [100_000, 1_000_000] as const;
const TARGET = 800;
const CALLS = 60; // simulates one second of pan at 60Hz

for (const n of SIZES) {
  it(`sample cache ${n.toLocaleString()} pts`, () => {
    const data = generate(n);
    const xMaxAll = data.xs[n - 1];

    // Scenario A: uncached LTTB called repeatedly, full range each time
    // (simulates re-render without memoization at all)
    const a = runScenario('A: uncached, full range x' + CALLS, CALLS, () => {
      lttbIndices(data.xs, data.ys, TARGET);
    });

    // Scenario B: cached, full range each call (every call hits)
    const b = runScenario(`B: cached, full range x${CALLS}`, CALLS, () => {
      lttbIndicesCached(data, { target: TARGET, xMin: 0, xMax: xMaxAll });
    });

    // Scenario C: cached, panning across data without quantization
    // (60 unique viewports → all misses)
    const panRange = xMaxAll * 0.5;
    const c = runScenario(`C: cached, pan x${CALLS} (no quantize)`, CALLS, (i) => {
      const xMin = (i / CALLS) * panRange;
      lttbIndicesCached(data, { target: TARGET, xMin, xMax: xMin + panRange });
    });

    // Scenario D: cached, panning with 5% quantization
    // (similar viewports collapse to fewer cache slots)
    const d = runScenario(`D: cached, pan x${CALLS} (quantize 5%)`, CALLS, (i) => {
      const xMin = (i / CALLS) * panRange;
      lttbIndicesCached(
        data,
        { target: TARGET, xMin, xMax: xMin + panRange },
        { quantizeFraction: 0.05 },
      );
    });

    // Scenario E: cached, zoom in/out cycling — same 5 zoom levels visited 12x each
    const zoomLevels = [
      [0, xMaxAll],
      [0, xMaxAll * 0.5],
      [xMaxAll * 0.25, xMaxAll * 0.75],
      [xMaxAll * 0.5, xMaxAll],
      [xMaxAll * 0.4, xMaxAll * 0.6],
    ];
    const e = runScenario(`E: cached, zoom cycle x${CALLS} (5 levels)`, CALLS, (i) => {
      const [xMin, xMax] = zoomLevels[i % zoomLevels.length];
      lttbIndicesCached(data, { target: TARGET, xMin, xMax });
    });

    [a, b, c, d, e].forEach(logResult);
    expect(a.callCount).toBe(CALLS);
  }, 120_000);
}
