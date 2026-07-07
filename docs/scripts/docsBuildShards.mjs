// 3-way split of the docs static export to bound peak build memory.
//
// The full `next build` accumulates native memory across the ~717-page
// generation loop in a single process (~10.5 GB peak on the Netlify builder,
// right at the ~11 GiB ceiling). Building disjoint subsets in separate
// processes resets that accumulation: each shard peaks at ~2-4 GB.
//
// Each shard is driven two ways that MUST stay in sync:
//   * `--debug-build-paths` (file globs)  -> which pages Next compiles + generates
//   * `exportPathMap` gate (route pathnames, via `shardOfPathname`) -> which pages it exports
// The section prefixes below are shared by both representations
// (`pages/x/<section>/**` <-> route `/x/<section>/...`).

// Special pages must be compiled by EVERY shard (dropping them breaks the build).
const SPECIAL = ['pages/_app.tsx', 'pages/_document.tsx'];

// Sections that get their own shard; shard 2 is the complement (everything else).
const API = 'x/api';
const HEAVY = ['x/react-chat', 'x/react-data-grid'];

export const SHARDS = [
  {
    name: 'api',
    debugBuildPaths: [...SPECIAL, `pages/${API}/**`],
  },
  {
    name: 'chat+data-grid',
    debugBuildPaths: [...SPECIAL, ...HEAVY.map((s) => `pages/${s}/**`)],
  },
  {
    name: 'rest',
    debugBuildPaths: [
      ...SPECIAL,
      'pages/**',
      `!pages/${API}/**`,
      ...HEAVY.map((s) => `!pages/${s}/**`),
      '!pages/playground/**',
    ],
  },
];

export const SHARD_COUNT = SHARDS.length;

// Classify an exported route pathname (e.g. `/x/api/data-grid/data-grid`) into
// its shard index. Mirrors the section prefixes in SHARDS so `exportPathMap`
// emits exactly the pages that shard compiled.
export function shardOfPathname(pathname) {
  const inSection = (section) => pathname === `/${section}` || pathname.startsWith(`/${section}/`);
  if (inSection(API)) {
    return 0;
  }
  if (HEAVY.some(inSection)) {
    return 1;
  }
  return 2;
}
