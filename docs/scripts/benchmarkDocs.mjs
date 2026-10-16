/* eslint-disable no-await-in-loop, no-console */
// Run measurements serially and print progress so concurrent work cannot bias timing.
/**
 * Compare production docs builds with interleaved cold-browser Lighthouse runs.
 * Install optional tooling outside the workspace:
 * npm install --prefix /tmp/mui-x-lighthouse-tool lighthouse@13.4.1 chrome-launcher
 *
 * LIGHTHOUSE_TOOLING_DIR=/tmp/mui-x-lighthouse-tool node docs/scripts/benchmarkDocs.mjs \
 *   --baseline https://master--material-ui-x.netlify.app/x/ \
 *   --candidate https://deploy-preview-N--material-ui-x.netlify.app/x/ \
 *   --output /tmp/mui-x-docs-performance
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { gzipSync, brotliCompressSync } from 'node:zlib';
import { chromium } from 'playwright';

const { values } = parseArgs({
  options: {
    baseline: { type: 'string' },
    candidate: { type: 'string' },
    output: { type: 'string' },
    runs: { type: 'string', default: '3' },
    'chrome-path': { type: 'string' },
    'baseline-sha': { type: 'string' },
    'candidate-sha': { type: 'string' },
  },
});
if (!values.baseline || !values.candidate || !values.output) {
  throw new Error('Supply --baseline, --candidate, and --output. See the example in this script.');
}
const runs = Number(values.runs);
if (!Number.isInteger(runs) || runs < 1) {
  throw new Error('--runs must be a positive integer. Use at least three runs for comparisons.');
}
const tooling = process.env.LIGHTHOUSE_TOOLING_DIR;
const lighthouseModule = tooling
  ? pathToFileURL(path.resolve(tooling, 'node_modules/lighthouse/core/index.js')).href
  : 'lighthouse';
const launcherModule = tooling
  ? pathToFileURL(path.resolve(tooling, 'node_modules/chrome-launcher/dist/index.js')).href
  : 'chrome-launcher';
const { default: lighthouse } = await import(lighthouseModule);
const { launch } = await import(launcherModule);
const output = path.resolve(values.output);
const chromePath = values['chrome-path'] ?? process.env.CHROME_PATH ?? chromium.executablePath();
const targets = [
  { name: 'baseline', origin: new URL(values.baseline).origin, sha: values['baseline-sha'] },
  { name: 'candidate', origin: new URL(values.candidate).origin, sha: values['candidate-sha'] },
];
const routes = [
  '/x/react-data-grid/column-definition/',
  '/x/react-data-grid/row-grouping/',
  '/x/react-charts/axis/',
  '/x/react-charts/lines/',
  '/x/react-tree-view/simple-tree-view/items/',
];
await fs.mkdir(output, { recursive: true });
await fs.writeFile(
  path.join(output, 'manifest.json'),
  JSON.stringify(
    { targets, routes, runs, chromePath, measuredAt: new Date().toISOString() },
    null,
    2,
  ),
);
const rows = [];
for (const route of routes) {
  const sizes = {};
  for (const target of targets) {
    const url = `${target.origin}${route}`;
    const response = await fetch(url);
    if (!response.ok || new URL(response.url).origin !== target.origin) {
      throw new Error(`${url}: HTTP ${response.status}, resolved to ${response.url}`);
    }
    const html = Buffer.from(await response.arrayBuffer());
    const scripts = [...html.toString().matchAll(/<script[^>]+src="([^"]+)"/g)];
    for (const [, script] of scripts) {
      if (!script.startsWith('/')) {
        continue;
      }
      const asset = await fetch(`${target.origin}${script}`);
      if (!asset.ok || !asset.headers.get('content-type')?.includes('javascript')) {
        throw new Error(`${target.name}: broken script ${script} (HTTP ${asset.status})`);
      }
    }
    sizes[target.name] = {
      htmlBytes: html.length,
      htmlGzipBytes: gzipSync(html).length,
      htmlBrotliBytes: brotliCompressSync(html).length,
    };
  }
  for (let run = 1; run <= runs; run += 1) {
    // Reverse the order on alternate runs to reduce warm-up and time-of-day bias.
    for (const target of run % 2 ? targets : [...targets].reverse()) {
      const chrome = await launch({
        chromePath,
        chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
      });
      try {
        const result = await lighthouse(`${target.origin}${route}`, {
          port: chrome.port,
          onlyCategories: ['performance'],
          output: 'json',
          logLevel: 'error',
        });
        const { lhr } = result;
        if (lhr.runtimeError || new URL(lhr.finalDisplayedUrl).origin !== target.origin) {
          throw new Error(
            `${target.name}: ${JSON.stringify(lhr.runtimeError ?? lhr.finalDisplayedUrl)}`,
          );
        }
        const row = {
          target: target.name,
          sha: target.sha,
          route,
          run,
          timestamp: lhr.fetchTime,
          browser: lhr.environment.hostUserAgent,
          lighthouseVersion: lhr.lighthouseVersion,
          configSettings: lhr.configSettings,
          lcpMs: lhr.audits['largest-contentful-paint'].numericValue,
          tbtMs: lhr.audits['total-blocking-time'].numericValue,
          cls: lhr.audits['cumulative-layout-shift'].numericValue,
          performanceScore: lhr.categories.performance.score,
          ...sizes[target.name],
        };
        rows.push(row);
        const name = `${target.name}-${route.split('/').filter(Boolean).join('-')}-${run}.json`;
        await fs.writeFile(path.join(output, name), result.report);
        await fs.writeFile(path.join(output, 'summary.json'), JSON.stringify(rows, null, 2));
        console.log(
          JSON.stringify({
            target: row.target,
            route,
            run,
            lcpMs: row.lcpMs,
            tbtMs: row.tbtMs,
            cls: row.cls,
            htmlBytes: row.htmlBytes,
          }),
        );
      } finally {
        await chrome.kill();
      }
    }
  }
}
