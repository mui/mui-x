// Build the docs static export in shards to keep peak build memory well under
// the CI/Netlify container limit. See `docsBuildShards.mjs` for the rationale
// (a single full `next build` accumulates native memory across the ~717-page
// generation loop and peaks near the container ceiling; separate processes
// reset that accumulation, so each shard peaks at ~3-7 GB instead of ~10.5 GB).
//
// Each shard is a separate `next build`, driven by:
//   * `--debug-build-paths` : which page files Next compiles + generates
//   * `DOCS_BUILD_SHARD`     : read by next.config.ts's exportPathMap gate,
//                              so the shard exports exactly what it compiled
// The shard `export/` outputs are disjoint (different pages; self-contained,
// content-hashed assets) and unioned into the final `export/`.

/* eslint-disable no-console */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { SHARDS } from './docsBuildShards.mjs';

const docsDir = path.resolve(url.fileURLToPath(new URL('.', import.meta.url)), '..');
const exportDir = path.join(docsDir, 'export');
const mergedDir = path.join(docsDir, 'export-sharded');
const nextBin = path.join(docsDir, 'node_modules', '.bin', 'next');

function countHtml(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      total += countHtml(path.join(dir, entry.name));
    } else if (entry.name.endsWith('.html')) {
      total += 1;
    }
  }
  return total;
}

fs.rmSync(mergedDir, { recursive: true, force: true });
fs.mkdirSync(mergedDir, { recursive: true });

SHARDS.forEach((shard, index) => {
  console.log(`\nBuilding docs shard ${index + 1}/${SHARDS.length} (${shard.name})`);
  fs.rmSync(exportDir, { recursive: true, force: true });
  execFileSync(
    nextBin,
    ['build', '--webpack', '--debug-build-paths', shard.debugBuildPaths.join(',')],
    { cwd: docsDir, stdio: 'inherit', env: { ...process.env, DOCS_BUILD_SHARD: String(index) } },
  );
  // Union this shard's output into the merged export. Page HTML is disjoint
  // across shards and hashed assets don't collide; identical top-level files
  // (_headers, robots.txt, 404) overwrite harmlessly.
  fs.cpSync(exportDir, mergedDir, { recursive: true });
});

fs.rmSync(exportDir, { recursive: true, force: true });
fs.renameSync(mergedDir, exportDir);

console.log(`\nSharded docs build complete: ${countHtml(exportDir)} pages in export/`);
