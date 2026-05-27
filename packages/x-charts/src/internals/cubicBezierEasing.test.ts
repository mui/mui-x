/* eslint-disable no-bitwise */
import BezierEasingV2 from 'bezier-easing';

import BezierEasingV3 from 'bezier-easing-v3';
import { cubicRoots } from './cubiqSolver';

/**
 * This test compares three ways of evaluating a cubic Bezier curve on the
 * workloads that matter to MUI X Charts.
 *
 * The internal rows call `cubicRoots` from `./cubiqSolver`. That is the
 * analytic solver already used by `curveEvaluation.ts` in the line chart,
 * and through it by the radial line chart. This file does not introduce any
 * new production code. The coefficient setup and y-evaluation mirror what
 * `findTForX` and `evaluateSegmentY` already do.
 *
 * The v2 row uses `bezier-easing@2`, the package currently imported from
 * `animation.ts`. The v3 row uses `bezier-easing@3`, installed under the
 * `bezier-easing-v3` npm alias just for this comparison.
 *
 * Each scenario runs all three implementations on the same inputs with the
 * same loop shape, so the only thing that changes between rows is the
 * algorithm being timed. Results are printed to the console when the test
 * runs
 */

// A small pseudo-random generator. Using a fixed seed means re-runs of the
// test use the same workload.
function makeRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

const EVAL_COUNT_A = 100_000;
const SEGMENT_COUNT_B = 10_000;
const ITERATIONS = 20;
const WARMUP = 3;

// Run the function a few unmeasured times to let the JIT warm up, then time
// it for `ITERATIONS` runs and return summary stats in milliseconds.
function measure(name: string, fn: () => void) {
  for (let i = 0; i < WARMUP; i += 1) {
    fn();
  }
  const samples: number[] = new Array(ITERATIONS);
  for (let i = 0; i < ITERATIONS; i += 1) {
    const start = performance.now();
    fn();
    samples[i] = performance.now() - start;
  }
  samples.sort((a, b) => a - b);
  const sum = samples.reduce((a, b) => a + b, 0);
  return {
    name,
    iterations: ITERATIONS,
    mean_ms: +(sum / ITERATIONS).toFixed(3),
    min_ms: +samples[0].toFixed(3),
    p50_ms: +samples[Math.floor(ITERATIONS / 2)].toFixed(3),
    p99_ms: +samples[Math.floor(ITERATIONS * 0.99)].toFixed(3),
    max_ms: +samples[ITERATIONS - 1].toFixed(3),
  };
}

function logResults(scenario: string, results: ReturnType<typeof measure>[]) {
  // Sort fastest first so the winner is at the top of the table.
  const sorted = [...results].sort((a, b) => a.mean_ms - b.mean_ms);
  const winner = sorted[0];
  const withRelative = sorted.map((r) => ({
    ...r,
    'vs winner': r === winner ? '1.00×' : `${(r.mean_ms / winner.mean_ms).toFixed(2)}×`,
  }));
  // eslint-disable-next-line no-console
  console.log(`\n=== ${scenario} ===`);
  // eslint-disable-next-line no-console
  console.table(withRelative);
}

// Scenario A inputs and per-implementation callers.

const scenarioATs: number[] = (() => {
  const rng = makeRandom(0xa11ce);
  const out = new Array<number>(EVAL_COUNT_A);
  for (let i = 0; i < EVAL_COUNT_A; i += 1) {
    out[i] = rng();
  }
  return out;
})();

const ANIM_X1 = 0.66;
const ANIM_Y1 = 0;
const ANIM_X2 = 0.34;
const ANIM_Y2 = 1;

// Coefficients of x(s) for the animation curve. The endpoints are fixed at
// (0, 0) and (1, 1), so the constant term drops out.
const ANIM_AX = 1 + 3 * ANIM_X1 - 3 * ANIM_X2;
const ANIM_BX = 3 * ANIM_X2 - 6 * ANIM_X1;
const ANIM_CX = 3 * ANIM_X1;

// The internal path for the animation curve. It solves `x(s) = t` with
// `cubicRoots`, then evaluates `y(s)`. This is the same sequence used by
// `findTForX` and `evaluateSegmentY` in `curveEvaluation.ts`, specialized
// to the (0, 0) and (1, 1) endpoints.
function easeAnimInternal(t: number): number {
  if (t === 0 || t === 1) {
    return t;
  }
  const roots = cubicRoots([ANIM_AX, ANIM_BX, ANIM_CX, -t]);
  if (roots.length === 0) {
    return t;
  }
  const s = roots[0];
  const m = 1 - s;
  return 3 * m * m * s * ANIM_Y1 + 3 * m * s * s * ANIM_Y2 + s * s * s;
}

function runScenarioA(impl: (t: number) => number): void {
  let sink = 0;
  for (let i = 0; i < EVAL_COUNT_A; i += 1) {
    sink += impl(scenarioATs[i]);
  }
  if (sink === Infinity) {
    throw new Error('unreachable');
  }
}

// Scenario B inputs and per-implementation callers.

type Segment = {
  x0: number;
  y0: number;
  cpx1: number;
  cpy1: number;
  cpx2: number;
  cpy2: number;
  x1: number;
  y1: number;
  targetX: number;
};

const scenarioBSegments: Segment[] = (() => {
  const rng = makeRandom(0xb0b);
  const out: Segment[] = [];
  for (let i = 0; i < SEGMENT_COUNT_B; i += 1) {
    const x0 = rng() * 800;
    // Make sure each segment has a non-zero width, otherwise the normalized
    // wrapper below would divide by zero.
    const x1 = x0 + 1 + rng() * 80;
    const y0 = rng() * 600;
    const y1 = rng() * 600;
    const cpx1 = x0 + (x1 - x0) * (0.2 + rng() * 0.2);
    const cpx2 = x0 + (x1 - x0) * (0.6 + rng() * 0.2);
    const cpy1 = rng() * 600;
    const cpy2 = rng() * 600;
    out.push({
      x0,
      y0,
      cpx1,
      cpy1,
      cpx2,
      cpy2,
      x1,
      y1,
      targetX: x0 + (x1 - x0) * rng(),
    });
  }
  return out;
})();

// The internal path for chart segments. Identical to the `findTForX`
// followed by `evaluateSegmentY` sequence in `curveEvaluation.ts`.
function evalSegmentInternal(s: Segment): number {
  const ax = -s.x0 + 3 * s.cpx1 - 3 * s.cpx2 + s.x1;
  const bx = 3 * s.x0 - 6 * s.cpx1 + 3 * s.cpx2;
  const cx = -3 * s.x0 + 3 * s.cpx1;
  const dx = s.x0 - s.targetX;
  const roots = cubicRoots([ax, bx, cx, dx]);
  if (roots.length === 0) {
    return s.y0;
  }
  const t = roots[0];
  const m = 1 - t;
  return m * m * m * s.y0 + 3 * m * m * t * s.cpy1 + 3 * m * t * t * s.cpy2 + t * t * t * s.y1;
}

// `bezier-easing` only handles curves whose endpoints are fixed at (0, 0)
// and (1, 1). To use it on a chart segment, we first normalize the segment
// into the unit square, build the easing function, evaluate it, and then
// de-normalize the result. The normalization cost is part of what is being
// measured here, because it is what a real consumer would have to pay.
function evalSegmentWithBezierEasing(
  builder: (x1: number, y1: number, x2: number, y2: number) => (t: number) => number,
  s: Segment,
): number {
  const dx = s.x1 - s.x0;
  const dy = s.y1 - s.y0;
  const nx1 = (s.cpx1 - s.x0) / dx;
  const nx2 = (s.cpx2 - s.x0) / dx;
  const ny1 = dy === 0 ? 0 : (s.cpy1 - s.y0) / dy;
  const ny2 = dy === 0 ? 0 : (s.cpy2 - s.y0) / dy;
  const ease = builder(nx1, ny1, nx2, ny2);
  const nt = (s.targetX - s.x0) / dx;
  return s.y0 + dy * ease(nt);
}

function runScenarioB(impl: (s: Segment) => number): void {
  let sink = 0;
  for (let i = 0; i < SEGMENT_COUNT_B; i += 1) {
    sink += impl(scenarioBSegments[i]);
  }
  if (sink === Infinity) {
    throw new Error('unreachable');
  }
}

// Pre-built easing functions for the animation curve. The construction cost
// is paid once at module load, so Scenario A and Scenario C below time only
// the per-call evaluation, matching how `animation.ts` would use the result.
const animEaseV2 = BezierEasingV2(ANIM_X1, ANIM_Y1, ANIM_X2, ANIM_Y2);
const animEaseV3 = BezierEasingV3(ANIM_X1, ANIM_Y1, ANIM_X2, ANIM_Y2);

// Scenario C reproduces the setup used by the `bezier-easing` maintainer as
// closely as possible: one curve, nine evaluations at x = 0.1 ... 0.9, no
// warmup, and many samples so the distribution stays meaningful.
const SCENARIO_C_TS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
const SCENARIO_C_SAMPLES = 1000;

// Like `measure`, but with no warmup. Each sample times a single run of
// `fn`, so the table reports per-run cost rather than per-loop cost.
function measureMicro(name: string, fn: () => void) {
  const samples: number[] = new Array(SCENARIO_C_SAMPLES);
  for (let i = 0; i < SCENARIO_C_SAMPLES; i += 1) {
    const start = performance.now();
    fn();
    samples[i] = performance.now() - start;
  }
  samples.sort((a, b) => a - b);
  const sum = samples.reduce((a, b) => a + b, 0);
  return {
    name,
    iterations: SCENARIO_C_SAMPLES,
    mean_ms: +(sum / SCENARIO_C_SAMPLES).toFixed(5),
    min_ms: +samples[0].toFixed(5),
    p50_ms: +samples[Math.floor(SCENARIO_C_SAMPLES / 2)].toFixed(5),
    p99_ms: +samples[Math.floor(SCENARIO_C_SAMPLES * 0.99)].toFixed(5),
    max_ms: +samples[SCENARIO_C_SAMPLES - 1].toFixed(5),
  };
}

function runScenarioC(impl: (t: number) => number): void {
  let sink = 0;
  for (let i = 0; i < SCENARIO_C_TS.length; i += 1) {
    sink += impl(SCENARIO_C_TS[i]);
  }
  if (sink === Infinity) {
    throw new Error('unreachable');
  }
}

// Tests.

describe('cubicBezierEasing comparison', () => {
  it('Scenario A — animation pattern (100k evals, build excluded)', () => {
    const results = [
      measure('internal (cubicRoots)', () => runScenarioA(easeAnimInternal)),
      measure('bezier-easing v2', () => runScenarioA(animEaseV2)),
      measure('bezier-easing v3', () => runScenarioA(animEaseV3)),
    ];
    logResults('Scenario A — animation pattern (100k evals, build excluded)', results);
  });

  it('Scenario B — chart pattern (10k segments, build + 1 eval each)', () => {
    const results = [
      measure('internal (cubicRoots, direct)', () => runScenarioB(evalSegmentInternal)),
      measure('bezier-easing v2 (normalized wrapper)', () =>
        runScenarioB((s) => evalSegmentWithBezierEasing(BezierEasingV2, s)),
      ),
      measure('bezier-easing v3 (normalized wrapper)', () =>
        runScenarioB((s) => evalSegmentWithBezierEasing(BezierEasingV3, s)),
      ),
    ];
    logResults('Scenario B — chart pattern (10k segments, build + 1 eval each)', results);
  });

  it('Scenario C — author repro (1 curve, 9 evals, no warmup)', () => {
    const results = [
      measureMicro('internal (cubicRoots)', () => runScenarioC(easeAnimInternal)),
      measureMicro('bezier-easing v2', () => runScenarioC(animEaseV2)),
      measureMicro('bezier-easing v3', () => runScenarioC(animEaseV3)),
    ];
    logResults('Scenario C — author repro (1 curve, 9 evals, no warmup)', results);
  });
});
