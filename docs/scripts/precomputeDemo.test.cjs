const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { performance } = require('node:perf_hooks');
const { createRequire } = require('node:module');
const nextWebpack = require('next/dist/compiled/webpack/webpack');

const webpack = nextWebpack.webpack;

const DEFERRED_QUERY = '?mui-deferred-precompute';
const WATCH_TIMEOUT_MS = 30_000;
const WATCH_AGGREGATE_MS = 20;
const VARIANT_MEASURE =
  '| Load Precomputed Code Highlighter | Complete Variants Loading - index.ts';
const loader = require.resolve('@mui/internal-docs-infra/pipeline/loadPrecomputedCodeHighlighter');

// Deferred source must watch imported files, not retain the previous compilation's code.
test(
  'refreshes deferred demo source after a watched dependency changes',
  { timeout: WATCH_TIMEOUT_MS },
  async () => {
    const directory = await fs.realpath(
      await fs.mkdtemp(path.join(os.tmpdir(), 'mui-demo-precompute-')),
    );
    const demoPath = path.join(directory, 'Demo.js');
    const helperPath = path.join(directory, 'helper.js');
    const outputPath = path.join(directory, 'dist', 'main.cjs');
    const loadOutput = createRequire(outputPath);
    await fs.writeFile(helperPath, 'export const label = "Before";\n');
    await fs.writeFile(
      demoPath,
      'import { label } from "./helper";\nexport default function Demo() { return label; }\n',
    );
    await fs.writeFile(
      path.join(directory, 'factory.js'),
      'export function createDemo(url, demo, options) { return options; }\n',
    );
    await fs.writeFile(
      path.join(directory, 'index.ts'),
      'import { createDemo } from "./factory";\nimport Demo from "./Demo";\nexport default createDemo(import.meta.url, Demo, {});\n',
    );

    const compiler = webpack({
      mode: 'development',
      target: 'node',
      context: directory,
      entry: './index.ts',
      output: {
        path: path.join(directory, 'dist'),
        filename: 'main.cjs',
        chunkFilename: '[id].[contenthash].cjs',
        library: { type: 'commonjs2' },
      },
      resolve: { extensions: ['.ts', '.js'] },
      module: {
        rules: [
          {
            test: /index\.ts$/,
            use: [{ loader, options: { deferPrecompute: true, output: 'hast' } }],
          },
        ],
      },
      optimization: { minimize: false },
      devtool: false,
    });
    let watching;
    let builds = 0;
    const priorMeasures = performance.getEntriesByName(VARIANT_MEASURE).length;

    try {
      await new Promise((resolve, reject) => {
        watching = compiler.watch({ aggregateTimeout: WATCH_AGGREGATE_MS }, (error, stats) => {
          (async () => {
            assert.ifError(error);
            assert.equal(stats.hasErrors(), false, stats.toString({ all: false, errors: true }));
            const deferred = [...stats.compilation.modules].find((module) =>
              module.resource?.endsWith(DEFERRED_QUERY),
            );
            assert.ok(deferred, 'deferred source module');
            const dependencies = new Set(deferred.buildInfo.snapshot.getFileIterable());
            assert.ok(dependencies.has(demoPath), 'demo dependency');
            assert.ok(dependencies.has(helperPath), 'transitive helper dependency');
            delete require.cache[outputPath];
            const variants = await loadOutput(outputPath).default.loadPrecompute();
            const serialized = JSON.stringify(variants);
            builds += 1;
            assert.equal(
              performance.getEntriesByName(VARIANT_MEASURE).length - priorMeasures,
              builds,
              'precomputes each demo once per compilation',
            );

            if (builds === 1) {
              assert.ok(serialized.includes('Before'));
              await fs.writeFile(helperPath, 'export const label = "After";\n');
              return;
            }

            assert.ok(serialized.includes('After'));
            assert.equal(serialized.includes('Before'), false);
            resolve();
          })().catch(reject);
        });
      });
    } finally {
      await new Promise((resolve) => {
        watching.close(resolve);
      });
      await new Promise((resolve) => {
        compiler.close(resolve);
      });
      await fs.rm(directory, { recursive: true, force: true });
    }
  },
);

// Non-enumerable output options must not collide with JSON-equivalent loader options.
test('preserves a deferred output option omitted by JSON serialization', async () => {
  const directory = await fs.realpath(
    await fs.mkdtemp(path.join(os.tmpdir(), 'mui-demo-precompute-options-')),
  );
  const outputPath = path.join(directory, 'dist', 'main.cjs');
  const loadOutput = createRequire(outputPath);
  await fs.writeFile(
    path.join(directory, 'Demo.js'),
    'export default function Demo() { return "Demo"; }\n',
  );
  await fs.writeFile(
    path.join(directory, 'factory.js'),
    'export function createDemo(url, demo, options) { return options; }\n',
  );
  await fs.writeFile(
    path.join(directory, 'index.ts'),
    'import { createDemo } from "./factory";\nimport Demo from "./Demo";\nexport default createDemo(import.meta.url, Demo, {});\n',
  );
  const deferredOptions = { deferPrecompute: true };
  Object.defineProperty(deferredOptions, 'output', { value: 'hast' });
  const compiler = webpack({
    mode: 'development',
    target: 'node',
    context: directory,
    entry: './index.ts',
    output: {
      path: path.join(directory, 'dist'),
      filename: 'main.cjs',
      library: { type: 'commonjs2' },
    },
    resolve: { extensions: ['.ts', '.js'] },
    module: {
      rules: [
        {
          test: /index\.ts$/,
          oneOf: [
            {
              resourceQuery: /mui-deferred-precompute/,
              use: [{ loader, options: deferredOptions }],
            },
            { use: [{ loader, options: { deferPrecompute: true } }] },
          ],
        },
      ],
    },
    optimization: { minimize: false },
    devtool: false,
  });

  try {
    await new Promise((resolve, reject) => {
      compiler.run((error, stats) => {
        if (error) {
          reject(error);
          return;
        }
        if (stats.hasErrors()) {
          reject(new Error(stats.toString({ all: false, errors: true })));
          return;
        }
        resolve();
      });
    });
    const variants = await loadOutput(outputPath).default.loadPrecompute();
    assert.equal(variants.Default.source.type, 'root');
  } finally {
    await new Promise((resolve) => {
      compiler.close(resolve);
    });
    await fs.rm(directory, { recursive: true, force: true });
  }
});
