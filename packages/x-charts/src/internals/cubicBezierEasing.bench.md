# `cubicBezierEasing` comparison results

Run with: `pnpm test:unit --project "x-charts" --run cubicBezierEasing`

The three rows in each scenario execute the same workload in the same loop shape. The only thing that changes between rows is the algorithm being timed. "internal" inlines the existing in-repo `cubicRoots` call, the same sequence used today by `findTForX` and `evaluateSegmentY` in `LineChart/seriesConfig/curveEvaluation.ts`. No new production code is introduced.

Environment: Node v22.18.0, Windows 11 (MINGW64 / Git Bash), Intel Core 7 150U.

## Scenario A — animation pattern (100k evals, build excluded)

20 iterations after 3 warmup runs. Each iteration runs 100,000 evaluations on a pre-built easing for the production curve `(0.66, 0, 0.34, 1)`. The `BezierEasing(...)` constructor is called once at module load, so this scenario measures only per-call evaluation cost — matching how `animation.ts` uses the result.

| Implementation        | mean (ms) | p50 (ms) | p99 (ms) | vs winner |
| --------------------- | --------- | -------- | -------- | --------- |
| bezier-easing v3      |   2.73    |   2.55   |   5.39   | **1.00×** |
| bezier-easing v2      |   4.12    |   3.97   |   5.60   | 1.51×     |
| internal (cubicRoots) |  27.28    |  27.35   |  30.37   | 9.99×     |

## Scenario B — chart pattern (10k segments, build + 1 eval each)

20 iterations after 3 warmup runs. Each iteration builds and evaluates 10,000 distinct cubic segments. `bezier-easing` only accepts curves with endpoints fixed at (0, 0) and (1, 1), so the v2/v3 rows pay an extra normalization cost per segment — this matches the cost a real chart consumer would pay.

| Implementation                          | mean (ms) | p50 (ms) | p99 (ms) | vs winner |
| --------------------------------------- | --------- | -------- | -------- | --------- |
| bezier-easing v3 (normalized wrapper)   |   2.63    |   2.56   |   3.51   | **1.00×** |
| internal (cubicRoots, direct)           |   2.82    |   2.77   |   3.56   | 1.08×     |
| bezier-easing v2 (normalized wrapper)   |   3.68    |   3.61   |   5.10   | 1.40×     |

## Scenario C — author repro (1 curve, 9 evals, no warmup)

1000 short samples, no warmup. Each sample times nine evaluations at `x = 0.1, 0.2, …, 0.9` on the pre-built production easing. This setup is the one used by the `bezier-easing` maintainer in their own benchmark, included here so the numbers can be compared side-by-side.

| Implementation        | mean (ms) | p50 (ms) | p99 (ms) | max (ms) | vs winner |
| --------------------- | --------- | -------- | -------- | -------- | --------- |
| bezier-easing v3      |  0.00045  | 0.00040  | 0.00060  |  0.0111  | **1.00×** |
| bezier-easing v2      |  0.00065  | 0.00060  | 0.00120  |  0.0222  | 1.44×     |
| internal (cubicRoots) |  0.00282  | 0.00260  | 0.00530  |  0.0628  | 6.27×     |

Note that the maintainer reported v2 slightly faster than v3 on the same shape (medians ≈ 1.7 µs vs 2.0 µs). On this machine, v3 wins all three scenarios. The most likely reasons for the discrepancy are JIT specialization timing in the vitest/jsdom host, `performance.now()` resolution at these sub-microsecond ranges, and engine-version differences. The qualitative ordering is what matters for the decision below.

## Conclusion

`bezier-easing@3` wins in all three scenarios on this machine. The proposal to replace `bezier-easing` with the internal `cubicRoots` wrapper is **not** taken — internal is far behind in Scenario A and loses to v3 in both B and C.

Recommended follow-ups (separate PR, decision for the team):

1. **Upgrade `bezier-easing` to v3** in `packages/x-charts/package.json`. The public API is unchanged, v3 is faster across the board, and `animation.ts` needs no code changes.
2. Optionally migrate `evaluateCurveY` and `evaluateCurveAtAngle` to v3 with the normalized-segment wrapper from this test. That would also speed up `getItemAtPosition` by roughly 1.08× and let `cubicRoots` be deleted.
