# Decision

<aside>

✅ **Option: B — Async pipeline + skeleton, with sampling and cache living inside the worker.**

**Why?** The marketing target ("smooth at 1M, responsive at 100k") only looks reachable structurally. In our test rig, 1M scatter blocks the main thread for ~12.6 s before first paint; the async-pipeline POC brought first paint down to ~22 ms on the same rig. Sampling and caching alone (Option A) cap out at ~2x mount-time and never unfreeze the browser before first paint. All numbers in this doc are POC measurements — see the caveats in Benchmarks.

</aside>

# Context

We want to render line/bar/scatter charts at 100k–1M points without freezing the browser, and to be perceived as a "fast" charts library next to ECharts, AG Charts, and Highcharts. The previous objective (Charts Performance — WebGL rendering) lifted the "too many elements on screen" ceiling for some chart types. This effort covers the other half: data prep, sampling, and main-thread responsiveness during processing.

Several small POCs were built on dedicated branches to evaluate concrete approaches against the existing codebase. Each branch has a draft PR linked below; the numbers in this doc are POC-level measurements, not commitments — production performance will depend on integration shape, dataset characteristics, browser, and device.

# Problems

1. **Frozen browser during initial mount at 1M points.** `ScatterChart` mount + first paint blocks the main thread for ~12.6 s at 1M in our test rig. Hover, click, scroll — all unresponsive.
2. **Sampling alone caps below 1M.** LTTB on a line series brings 100k from laggy to smooth, but at 1M the upstream pipeline (d3-stack, `flatMap` over `xData`) still walks the full array and dominates.
3. **No async/worker entry point in the current pipeline.** Selectors run synchronously inside React render.
4. **Progressive rendering at the leaf component level does not help.** The dominant cost is upstream of the leaf, so chunking just the path-string emission saves ~5 % of mount time (POC 4).
5. **Pan/zoom re-runs sampling from scratch each render.** No memoization of sampled output today.
6. **`SharedArrayBuffer` carries an app-level branding cost.** SAB is the cheapest worker transfer mode but requires consumers to set COOP+COEP server headers.

# Options

## A. Incremental wins (sampling + cache + transfer-mode worker for sampling)

Ship LTTB sub-sampling on line/bar (POC 1), viewport-keyed memoization cache (POC 6), and optionally move the LTTB call itself into a worker (informed by POC 5 transfer numbers). Keep the synchronous selector pipeline. No skeleton state; mount is still synchronous, just cheaper.

**What lands**

- Line series gets a `sampling: 'lttb'` opt-in (POC 1).
- Bar series gets a min/max bucketing equivalent (not built — projected from POC 1).
- Sampler output is memoized per `(data ref, target, viewport)` (POC 6).
- Optionally the LTTB pass moves to a worker (POC 5 says use `Transferable`, default mode).

**Expected gains** (from POC measurements; production may differ)

- 100k line series mount: ~148 ms → ~80 ms.
- 1M line series mount: ~1.5 s → ~0.6 s.
- Re-renders with a stable data prop hit the cache for ~free (~50x in the micro-bench).

**What it doesn't buy**

- 1M scatter still freezes the browser before first paint. The pipeline is synchronous and must process the full dataset before React can commit.
- The "responsive while loading" claim is not honestly defensible.

## B. Async pipeline with skeleton chart

Refactor the chart so a worker computes the heavy parts of the pipeline (extremums, scale, optionally path-string generation) off the main thread. The component renders a skeleton (existing `ChartsLoadingOverlay`) immediately, then swaps in the full data when the worker returns. POC 5b validated the architecture for scatter; the plugin-based implementation on `feat/async-chart-pipeline` extends it to line/bar/scatter through the existing chart components.

**What lands**

- A core plugin `useChartAsyncSeriesProcessor` that runs the per-type `seriesProcessor` in a Web Worker.
- New chart-level prop `asyncProcessing` on `LineChart`, `BarChart`, `ScatterChart`.
- Skeleton render (axes + empty plot area) while the worker is busy, via the existing `ChartsLoadingOverlay`. The chart's `loading` prop is OR-ed with the internal processing state.
- Cancellation when the data prop changes mid-flight.
- Layered over A: LTTB sampling and the cache run inside the worker, so the main thread never sees them.

**Expected gains** (from POC measurements; production may differ)

- 1M scatter first paint: ~22 ms vs ~12.6 s today (~570x in the spike, where the ChartProvider pipeline is bypassed). Conservative production target: still well under 100 ms.
- 1M scatter full paint: ~1.3 s vs ~12.6 s today (~10x in the spike; expect 3–5x once the lib pipeline is re-added).
- Main thread stays responsive during processing — hover, click, pan should all keep working.
- Marketing claim "responsive at 1M" looks defensible against ECharts numbers.

**What it costs**

- Architectural refactor of the chart pipeline (selectors → state-driven processed series via a plugin).
- Worker bundling that survives downstream consumer bundlers (Vite, Webpack 5, Next, esbuild all handle `new Worker(new URL(...), { type: 'module' })`).
- Open design questions: per-chart vs shared worker pool, cancellation semantics, data-shape (Float64 zero-copy vs `{x,y}[]` clone), `valueGetter` support.

## Comparison

[Comparison](https://www.notion.so/350cbfe7b660800fa32af2be73e9d5d1?pvs=21)

All numeric cells are POC measurements; production may differ.

| Lever                              | A: incremental           | B: async pipeline                          |
| ---------------------------------- | ------------------------ | ------------------------------------------ |
| Engineering size                   | small / medium           | large                                      |
| 100k line mount                    | ~80 ms                   | ~80 ms (same; A's sampling runs in worker) |
| 1M scatter first paint             | ~6 s (still synchronous) | **~22 ms**                                 |
| 1M scatter full paint              | ~6 s                     | **~1.3 s** (POC; expect 3–5x in prod)      |
| Main thread free during processing | no                       | yes                                        |
| Marketing claim "responsive at 1M" | no                       | yes                                        |
| Risk surface                       | low (opt-in props)       | medium (pipeline rewrite)                  |
| Composes with WebGL renderer work  | yes                      | yes                                        |

# Proposal

**Option: B — async pipeline + skeleton, with A's pieces (LTTB + cache) running inside the worker.**

A first-pass implementation of Option B is on the **`feat/async-chart-pipeline`** branch. It adds a core plugin (`useChartAsyncSeriesProcessor`) that runs the per-type `seriesProcessor` in a Web Worker for line, bar, and scatter, and reuses the existing `ChartsLoadingOverlay` while the worker is busy. Public API is a single new prop on the existing chart components:

```tsx
<LineChart asyncProcessing ... />
<BarChart asyncProcessing ... />
<ScatterChart asyncProcessing ... />
```

A docs demo is wired up at `/x/react-charts/scatter/#async-processing-experimental` (`AsyncScatterProcessing.tsx`). It cycles three datasets, exposes the `asyncProcessing` toggle, and shows a 100 ms-tick counter that visualises main-thread responsiveness — the counter freezes during sync render and keeps ticking under async.

Bench measurements from this branch (chromium, 800x400, mean of 3+ runs). Treat as expected gains, not guarantees.

| Chart          | Pts  | Sync paint | Async paint | Expected ratio |
| -------------- | ---- | ---------- | ----------- | -------------- |
| `LineChart`    | 100k | ~297 ms    | **~11 ms**  | ~28x           |
| `BarChart`     | 30k  | ~2562 ms   | **~968 ms** | ~2.6x          |
| `ScatterChart` | 50k  | ~489 ms    | **~10 ms**  | ~51x           |

Bar's smaller indicator reflects that the per-bar SVG render is still on the main thread; only the d3-stack/data-prep moved to the worker. Offloading the path/marker generation layer next is expected to pick up more of the remaining cost (POC 5b suggests this is achievable).

**Why?**

- POC 5b indicators (22 ms vs 12.6 s to first paint at 1M, in our test rig) point clearly at the user-perceived metric. No combination of sampling and caching looks likely to close that gap, because the freeze happens _before_ sampling can run.
- The architecture extends naturally to line and bar (worker is the right home for d3-stack and `flatMap`-over-`xData` at scale) and composes with the existing WebGL renderer (worker can produce WebGL draw lists instead of SVG path strings).
- POC 1 (sampling) and POC 6 (cache) become implementation details inside the worker rather than separate features. Their measured wins still apply; they just stop blocking the main thread.
- POC 4 (progressive at leaf level) showed conclusively that defer-and-batch at the rendering layer doesn't address the upstream cost. Don't pursue it.
- POC 5 (transfer cost) tells us to default to `Transferable` and treat `SharedArrayBuffer` as an opt-in for hosts that can configure COOP+COEP. No need to take that branding cost as a default.

**Sequence of work**

1. Land POC 1 (LTTB on line) as the first user-visible deliverable. Cheap, opt-in, real win at 100k. (~1 sprint)
2. Take `feat/async-chart-pipeline` from experimental to production-ready: API name, `valueGetter` support, cancellation polish, worker bundling guarantees, naming/tier. (~1–2 sprints)
3. Roll the pattern to all chart types that use the chart pipeline (line/bar/scatter ship together; pie/sankey/etc. as the API stabilises). (~1 sprint)
4. Move LTTB + viewport cache inside the worker. (~1 sprint)
5. Document `SharedArrayBuffer` as an advanced opt-in for hosts that can enable cross-origin isolation. (~0.5 sprint)
6. _(Optional, follow-up)_ MapReduce-style multi-worker fan-out for the path-generation stage. POC 7 measured ~3x on top of the single-worker baseline at 1M, gated on cross-origin isolation being enabled. (~1 sprint)

# Benchmarks

All numbers below are POC measurements on a single machine (chromium via vitest browser, predictable JS flags, software rendering). 800x400 chart unless noted. Treat as expected gains for sizing the work, not as production targets — real performance will depend on the final integration shape, dataset, browser, and device.

- **POC 1 — LTTB sub-sampling on `LineChart`** (`perf-poc/subsampling-line-lttb`)
  - 10k pts: mount ~16.6 ms → ~10.6 ms (~1.57x)
  - 100k pts: mount ~148 ms → ~80 ms (~1.85x)
  - 1M pts: mount ~1504 ms → ~640 ms; paint **~3034 ms → ~645 ms** (~4.7x paint)
  - Skipped when the series contains nulls (segmentation-free POC).

- **POC 4 — Progressive `ScatterChart` render at leaf level** (`perf-poc/progressive-scatter`)
  - 50k: mount ~242 ms → ~224 ms; paint ~463 ms → ~463 ms.
  - 200k: mount ~1122 ms → ~1118 ms; paint ~1874 ms → ~1880 ms.
  - 1M: hangs (cumulative O(N²/batchSize) re-walk in the naive impl).
  - **Conclusion: ineffective** — upstream pipeline dominates, leaf-level chunking saves ~5 % of mount.

- **POC 5 — Web Worker transfer cost spike** (`perf-poc/worker-series-processor`)
  - 1M Float64 (16 MB), wallclock to round-trip:
    - main (sync): ~5.5 ms
    - worker via clone: ~16.9 ms (send ~1.8 + worker ~5.6 + recv ~9.5)
    - worker via transfer: ~8.9 ms (send ~0.06 + worker ~5.0 + recv ~3.9)
    - worker via SAB: **unsupported** (vitest browser does not set COOP/COEP)
  - **Default to `Transferable`.** SAB only as opt-in.

- **POC 5b — Async scatter pipeline with skeleton** (`perf-poc/worker-async-pipeline`)
  - 100k: async first paint ~**6 ms** vs sync `ScatterChart` ~1076 ms (~180x); async full paint ~115 ms vs ~1076 ms (~9x).
  - 1M: async first paint ~**22 ms** vs sync ~12 599 ms (~**570x**); async full paint ~1258 ms vs ~12 599 ms (~**10x**).
  - Caveat: the experimental component bypasses the lib `ChartProvider` pipeline. Production integration will re-add some of that overhead. Conservative estimate: ~3–5x full-paint win after re-integration; first-paint win expected to stay intact.

- **POC 6 — Viewport-keyed sample cache** (`perf-poc/memo-sampled-cache`)
  - 1M, 60 calls, per-call cost:
    - Uncached LTTB: ~5.25 ms
    - Cached, full-range repeats (98 % hits): ~**0.10 ms** (~50x)
    - Cached, continuous pan, no quantize (0 % hits): ~26.7 ms (worse — slice cost)
    - Cached, pan with 5 % quantize (48 % hits): ~13.7 ms
    - Cached, zoom cycle through 5 levels (97 % hits): ~**0.61 ms**
  - **Expected free win for re-renders** (Scenario B). **Strong fit for zoom-snap UX** (Scenario E). **Continuous pan needs worker offload, not cache.**

- **POC 7 — MapReduce-style multi-worker fan-out with `SharedArrayBuffer`** (`perf-poc/mapreduce-sab`)
  - 1M scatter, path generation only, hardwareConcurrency=11, mean of 5 runs:
    - 1 worker: ~228.8 ms (baseline)
    - 2 workers: ~127.5 ms (~1.79x)
    - 4 workers: ~88.3 ms (~2.59x)
    - 8 workers: ~**77.0 ms (~2.97x)**
  - Expected speedup ceiling ~3x, not Nx. Bottleneck above 4 workers is output cloning — path strings posted back via structured clone (~10 MB / N per worker). To break through, paths would need to be written into a shared output buffer (UTF-8 bytes) and read back as one string.
  - Required `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp` in the test/perf vitest config. App-level config in production.
  - Browser paint of 1M paths still happens after worker processing — MapReduce only speeds up JS work, not rasterization.
  - **Recommended as a follow-up to Option B**, gated on customer demand for cross-origin isolation. Likely meaningful at 1M+, not transformative.

## Branches and PRs

| Item                                  | Branch                             | Draft PR                                                                 |
| ------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------ |
| **Proposal — async pipeline plugin**  | `feat/async-chart-pipeline`        | **[#22370](https://github.com/mui/mui-x/pull/22370)**                    |
| 1. LTTB sub-sampling (line)           | `perf-poc/subsampling-line-lttb`   | [#22363](https://github.com/mui/mui-x/pull/22363)                        |
| 4. Progressive scatter (leaf level)   | `perf-poc/progressive-scatter`     | [#22364](https://github.com/mui/mui-x/pull/22364) — negative result      |
| 5. Worker transfer cost spike         | `perf-poc/worker-series-processor` | [#22365](https://github.com/mui/mui-x/pull/22365)                        |
| 5b. Async pipeline + skeleton (spike) | `perf-poc/worker-async-pipeline`   | [#22366](https://github.com/mui/mui-x/pull/22366)                        |
| 6. Viewport-keyed sample cache        | `perf-poc/memo-sampled-cache`      | [#22367](https://github.com/mui/mui-x/pull/22367)                        |
| 7. MapReduce SAB fan-out              | `perf-poc/mapreduce-sab`           | [#22368](https://github.com/mui/mui-x/pull/22368) — follow-up            |
| First proposal (superseded)           | `feat/async-scatter-plot`          | [#22369](https://github.com/mui/mui-x/pull/22369) — superseded by #22370 |

POC 2 (bar bucket sub-sampling) and POC 3 (progressive line render) were scoped but not built. Bar bucket is a small port of POC 1; progressive line was deprioritised after POC 4's negative result.
