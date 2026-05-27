# `cubicBezierEasing` comparison results

Run with: `pnpm test:unit --project "x-charts" --run cubicBezierEasing`

The three rows in each scenario execute the same workload in the same loop shape. The only thing that changes between rows is the algorithm being timed. "internal" inlines the existing in-repo `cubicRoots` call, the same sequence used today by `findTForX` and `evaluateSegmentY` in `LineChart/seriesConfig/curveEvaluation.ts`. No new production code is introduced.

Numbers below come from a CI run (Linux, Node 22). Local runs on other machines vary by a fixed factor but the ordering is the same.

## Scenario A — animation pattern (100k evals, build excluded)

20 iterations after 3 warmup runs. Each iteration runs 100,000 evaluations on a pre-built easing for the production curve `(0.66, 0, 0.34, 1)`. The `BezierEasing(...)` constructor is called once at module load, so this scenario measures only per-call evaluation cost — matching how `animation.ts` uses the result.

| Implementation        | mean (ms) | p50 (ms) | p99 (ms) | vs winner |
| --------------------- | --------- | -------- | -------- | --------- |
| bezier-easing v3      |   5.17    |   5.03   |   6.05   | **1.00×** |
| bezier-easing v2      |   8.36    |   8.27   |   9.01   | 1.62×     |
| internal (cubicRoots) |  46.94    |  45.52   |  57.74   | 9.08×     |

## Scenario B — chart pattern (10k segments, build + 1 eval each)

20 iterations after 3 warmup runs. Each iteration builds and evaluates 10,000 distinct cubic segments. `bezier-easing` only accepts curves with endpoints fixed at (0, 0) and (1, 1), so the v2/v3 rows pay an extra normalization cost per segment — this matches the cost a real chart consumer would pay.

| Implementation                          | mean (ms) | p50 (ms) | p99 (ms) | vs winner |
| --------------------------------------- | --------- | -------- | -------- | --------- |
| bezier-easing v3 (normalized wrapper)   |   3.56    |   3.45   |   4.08   | **1.00×** |
| internal (cubicRoots, direct)           |   4.30    |   4.12   |   4.90   | 1.21×     |
| bezier-easing v2 (normalized wrapper)   |   5.59    |   5.38   |   6.24   | 1.57×     |

## Scenario C — alex repro (1 curve, 9 evals, no warmup)

1000 short samples, no warmup. Each sample times nine evaluations at `x = 0.1, 0.2, …, 0.9` on the pre-built production easing. This setup is the one used by the `bezier-easing` maintainer in their own benchmark, included here so the numbers can be compared side-by-side.

| Implementation        | mean (ms) | p50 (ms) | p99 (ms) | max (ms) | vs winner |
| --------------------- | --------- | -------- | -------- | -------- | --------- |
| bezier-easing v3      |  0.00062  | 0.00056  | 0.00074  |  0.0326  | **1.00×** |
| bezier-easing v2      |  0.00116  | 0.00107  | 0.00142  |  0.0383  | 1.87×     |
| internal (cubicRoots) |  0.00534  | 0.00435  | 0.01990  |  0.6498  | 8.61×     |

The maintainer reported v2 slightly faster than v3 on the same shape (medians ≈ 1.7 µs vs 2.0 µs). On CI here, v3 wins. The likely causes are JIT specialization timing, `performance.now()` resolution at sub-microsecond ranges, and engine-version differences. The ordering — v3 first, v2 second, internal last — is what matters for the decision below.

## Conclusion

`bezier-easing@3` wins in all three scenarios. The proposal to replace `bezier-easing` with the internal `cubicRoots` wrapper is **not** taken — internal is far behind in Scenario A and loses to v3 in both B and C.

Recommended follow-ups (separate PR, decision for the team):

1. **Upgrade `bezier-easing` to v3** in `packages/x-charts/package.json`. The public API is unchanged, v3 is faster across the board, and `animation.ts` needs no code changes.
2. Optionally migrate `evaluateCurveY` and `evaluateCurveAtAngle` to v3 with the normalized-segment wrapper from this test. That would also speed up `getItemAtPosition` by roughly 1.21× and let `cubicRoots` be deleted.
