# Experiment: bound docs build memory via require-cache eviction

NOT FOR MERGE. This branch tests whether we can fix the docs static-export OOM in a
**single** `next build` (no sharding, so no cross-section navigation tradeoff) by
countering the Next.js internals issue directly.

## The issue (root cause)

Next's static-generation worker renders its whole batch of pages in one long-lived
process. For each page it calls `loadComponents()`, which `require()`s that page's
compiled server bundle (with the MUI docs' statically-bundled live demos). There is
no `require.cache` eviction in the build/export path and no worker recycling /
`idleMemoryLimit` in `createStaticWorker`, so hundreds of page bundles accumulate
off-heap (V8 compiled-code space). On the Netlify Linux builder the single build
peaks ~10.5 GB, right at the container ceiling -> intermittent OOM.

## What this branch does

- `docs/scripts/evictPageCache.cjs`: a `NODE_OPTIONS=--require` preload that
  Proxy-wraps Next's `load-components` module (its exports are non-configurable
  getters) and, after each page renders, evicts that page's newly-added compiled
  modules from `require.cache` (keeping `node_modules`), then runs GC.
- `next.config.ts`: `experimental.staticGenerationMaxConcurrency: 1` so generation
  is serial and eviction between pages does not race concurrent renders.
- `docs:build:evict` / `docs/package.json build:evict`: a normal unsharded build
  with the preload wired via `NODE_OPTIONS`. `netlify.toml` points at it.

## What to look for on the deploy

Grep the build log for `[evict]`. It prints the worker's RSS every 25 pages:

- If RSS stays bounded (e.g. a few GB) as the page count climbs -> the eviction is
  working and the accumulation is confirmed as the root cause.
- If the build completes with all pages -> a single-build fix is viable.

## Known limitation (observed locally on macOS)

Eviction bounded the worker from the unbounded ~10 GB climb to ~3.5 GB (confirming
the mechanism), but evicting the _shared_ `server/chunks/` that the next page
re-`require()`s causes re-compilation churn, which triggered a V8 heap OOM around
page ~65. `staticGenerationMaxConcurrency: 1` + `--expose-gc` are here to mitigate
that; the Linux builder runs leaner than macOS in these builds, so the point of this
branch is to measure the real behavior there. A production version would need
section-aware eviction (drop a section's chunks only once it is fully rendered).

The durable fix is upstream: Next recycling the static-generation worker
(`idleMemoryLimit` / pages-per-worker restart).
