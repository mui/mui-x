import BezierEasingV2 from 'bezier-easing';
// eslint-disable-next-line import/no-unresolved
import BezierEasingV3 from 'bezier-easing-v3';
import { cubicRoots } from './cubiqSolver';

/**
 * Compares three cubic-bezier evaluators on the workloads relevant to
 * `@mui/x-charts`:
 *
 *   - internal  → the existing in-repo analytic solver, `cubicRoots` from
 *                 `./cubiqSolver`. This is the same function used today by
 *                 `LineChart/seriesConfig/curveEvaluation.ts` and (via that)
 *                 by the radial line chart's `getItemAtPosition`. No new
 *                 logic is introduced — this file inlines the same
 *                 coefficient setup and y-evaluation that those call sites
 *                 already perform.
 *   - v2        → `bezier-easing@^2`, the package currently used by
 *                 `internals/animation/animation.ts`.
 *   - v3        → `bezier-easing@^3`, installed as the `bezier-easing-v3`
 *                 npm alias for this comparison.
 *
 * Each scenario runs the three implementations on identical inputs with the
 * same loop shape, so the only thing that differs between rows is the
 * algorithm under test. Results are printed to the console at test time —
 * see `cubicBezierEasing.bench.md` for a recorded snapshot.
 */

// Deterministic LCG so re-runs produce identical workloads.
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

// Run `fn` ITERATIONS times after WARMUP unmeasured runs, return mean/min/max ms.
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
  // Sort fastest first.
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

// ─── Scenario A — inputs and per-impl callers ────────────────────────────────

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

// Coefficients of x(s) for the animation curve (endpoints fixed at 0 and 1).
const ANIM_AX = 1 + 3 * ANIM_X1 - 3 * ANIM_X2;
const ANIM_BX = 3 * ANIM_X2 - 6 * ANIM_X1;
const ANIM_CX = 3 * ANIM_X1;

// Internal: solve x(s) = t with `cubicRoots`, then evaluate y(s). This is
// exactly the (cubicBezierCoeffs + cubicRoots + cubicBezier) sequence used
// by `findTForX` / `evaluateSegmentY` in `curveEvaluation.ts`, specialized
// to (0,0)/(1,1) endpoints.
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
  if (sink === Infinity) throw new Error('unreachable');
}

// ─── Scenario B — inputs and per-impl callers ────────────────────────────────

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
    const x1 = x0 + 1 + rng() * 80; // ensure x1 > x0 by at least 1px
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

// Internal: identical to `findTForX` + `evaluateSegmentY` in `curveEvaluation.ts`.
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

// bezier-easing wrapper for Scenario B: normalize segment to [0,1]×[0,1], build, eval.
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
  if (sink === Infinity) throw new Error('unreachable');
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('cubicBezierEasing comparison', () => {
  it('Scenario A — animation pattern (build once, 100k evals)', () => {
    const results = [
      measure('internal (cubicRoots)', () => runScenarioA(easeAnimInternal)),
      measure('bezier-easing v2', () => {
        const ease = BezierEasingV2(ANIM_X1, ANIM_Y1, ANIM_X2, ANIM_Y2);
        runScenarioA(ease);
      }),
      measure('bezier-easing v3', () => {
        const ease = BezierEasingV3(ANIM_X1, ANIM_Y1, ANIM_X2, ANIM_Y2);
        runScenarioA(ease);
      }),
    ];
    logResults('Scenario A — animation pattern (build once, 100k evals)', results);
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
});
