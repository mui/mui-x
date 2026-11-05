const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const babel = require('@babel/core');
const transform = require('./loadDemoExportDeps.cjs');

const PICKERS_PACKAGE = '@mui/x-date-pickers';
const ADAPTER_IMPORT = `${PICKERS_PACKAGE}/AdapterDayjs`;
const PICKERS_VERSION = '^9.0.0';

// Pinned product versions must still resolve adapter and generator peers.
test('resolves pinned dependencies with their full import paths', async () => {
  const { exportVariant } = await import('@mui/internal-docs-infra/useDemo');
  let imports;
  const { exported } = exportVariant(
    {
      source: 'export default function Demo() { return null; }',
      fileName: 'Demo.tsx',
      externals: [ADAPTER_IMPORT],
    },
    {
      versions: { [PICKERS_PACKAGE]: PICKERS_VERSION },
      resolveDependencies(packageName, _envVars, importPaths) {
        assert.equal(packageName, PICKERS_PACKAGE);
        imports = importPaths;
        return { [packageName]: 'latest', dayjs: 'latest' };
      },
    },
  );
  const { dependencies } = JSON.parse(exported.extraFiles['../package.json'].source);

  assert.equal(dependencies.dayjs, 'latest');
  assert.equal(dependencies[PICKERS_PACKAGE], PICKERS_VERSION);
  assert.deepEqual(imports, [ADAPTER_IMPORT]);
});

// Exercise the compiled preview through the consumer loader and public exporter.
test('keeps bundled declarations without nonexistent type packages', async () => {
  const corePath = path.join(
    path.dirname(require.resolve('@mui/internal-core-docs/package.json')),
    'DemoContent/exportConfig.js',
  );
  const coreSource = transform(fs.readFileSync(corePath, 'utf8')).replace(
    "'@mui/internal-docs-infra/useDemo'",
    JSON.stringify(pathToFileURL(require.resolve('@mui/internal-docs-infra/useDemo')).href),
  );
  const adapterPath = path.resolve(__dirname, '../src/modules/utils/postProcessImport.ts');
  const { code } = babel.transformSync(fs.readFileSync(adapterPath, 'utf8'), {
    filename: adapterPath,
    babelrc: false,
    configFile: false,
    presets: [require.resolve('@babel/preset-typescript')],
  });
  const { postProcessImport } = await import(
    `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
  );
  const { buildExportConfig } = await import(
    `data:text/javascript;base64,${Buffer.from(coreSource).toString('base64')}`
  );
  const previousDeps = process.env.PICKERS_ADAPTERS_DEPS;
  process.env.PICKERS_ADAPTERS_DEPS = JSON.stringify({ 'date-fns-jalali': 'latest' });

  try {
    const config = buildExportConfig({
      csbConfig: { postProcessImport },
      useTypescriptRef: { current: true },
    });
    const { exported } = config.exportFunction(
      {
        source: 'export default function Demo() { return null; }',
        fileName: 'Demo.tsx',
        externals: [
          `${PICKERS_PACKAGE}/AdapterDateFnsJalali`,
          '@emotion/cache',
          'rxjs',
          '@tanstack/query-core',
        ],
      },
      { ...config, useTypescript: true },
    );
    const { dependencies } = JSON.parse(exported.extraFiles['../package.json'].source);

    for (const [dependency, types] of [
      ['date-fns-jalali', '@types/date-fns-jalali'],
      ['@emotion/cache', '@types/emotion__cache'],
      ['rxjs', '@types/rxjs'],
      ['@tanstack/query-core', '@types/tanstack__query-core'],
    ]) {
      assert.ok(dependencies[dependency], dependency);
      assert.equal(dependencies[types], undefined, types);
    }
  } finally {
    if (previousDeps === undefined) {
      delete process.env.PICKERS_ADAPTERS_DEPS;
    } else {
      process.env.PICKERS_ADAPTERS_DEPS = previousDeps;
    }
  }
});
