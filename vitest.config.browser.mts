import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig } from 'vitest/config';
import sharedConfig from './vitest.shared.mts';
// The plugin rewrites imports for the v2 date adapters and is already scoped to their
// directories, so it is harmless for the packages that do not use those adapters.
import { filterReplace } from './packages/x-date-pickers/vitest.config.jsdom.mts';

const url = (path: string) => fileURLToPath(new URL(path, import.meta.url));

const SETUP_DATA_GRID = url('./test/utils/setupDataGrid.ts');
const SETUP_PICKERS = url('./test/utils/setupPickers.js');
const SETUP_SINON = url('./test/utils/setupSinon.ts');
const SETUP_SHARED = url('./test/setupVitest.ts');

const BASE_EXCLUDE = ['**/*.spec.{js,ts,tsx}', '**/node_modules/**', '**/dist/**'];
const MATERIAL_VERSION = '**/materialVersion.test.tsx';

interface PackageSuite {
  /** Package directory under `packages/`, also the project name. */
  name: string;
  /** Extra setup files, on top of the shared one. */
  setupFiles?: string[];
  /** Extra excludes, on top of `BASE_EXCLUDE`. */
  exclude?: string[];
  /** Whether the suite calls into Sinon and needs the default sandbox restored. */
  sinon?: boolean;
  isolate?: boolean;
}

// One entry per package that runs browser tests. `sinon: true` pulls in the ~341kB Sinon
// graph, so it is opt-in: the packages that never import it do not pay for it.
const SUITES: PackageSuite[] = [
  { name: 'x-charts', exclude: [MATERIAL_VERSION], sinon: true },
  { name: 'x-charts-premium' },
  { name: 'x-charts-vendor' },
  { name: 'x-charts-pro', exclude: [MATERIAL_VERSION], sinon: true },
  { name: 'x-chat', exclude: ['**/docsCorrectnessGuard/**'] },
  { name: 'x-chat-headless', sinon: true },
  { name: 'x-data-grid', setupFiles: [SETUP_DATA_GRID], exclude: [MATERIAL_VERSION], sinon: true },
  {
    name: 'x-data-grid-premium',
    setupFiles: [SETUP_DATA_GRID],
    sinon: true,
    exclude: [
      MATERIAL_VERSION,
      '**/hooks/features/formula/engine/*.test.ts',
      '**/hooks/features/formula/gridFormulaPlainEditing.test.ts',
      '**/hooks/features/formula/gridFormulaLiveGeometry.test.ts',
      '**/hooks/features/formula/gridFormulaReferenceHighlights.test.ts',
      '**/hooks/features/formula/createFormulaEvaluation.test.ts',
      '**/hooks/features/formula/gridFormulaAutocomplete.test.tsx',
      '**/hooks/features/formula/gridFormulaPreview.test.tsx',
      '**/components/formulaEditorCaret.test.ts',
    ],
  },
  {
    name: 'x-data-grid-pro',
    setupFiles: [SETUP_DATA_GRID],
    exclude: [MATERIAL_VERSION],
    sinon: true,
  },
  { name: 'x-date-pickers', setupFiles: [SETUP_PICKERS], exclude: [MATERIAL_VERSION], sinon: true },
  {
    name: 'x-date-pickers-pro',
    setupFiles: [SETUP_PICKERS],
    exclude: [MATERIAL_VERSION],
    sinon: true,
  },
  {
    name: 'x-internal-gestures',
    setupFiles: [url('./packages/x-internal-gestures/src/matchers/index.ts')],
    isolate: true,
  },
  { name: 'x-license' },
  { name: 'x-scheduler', sinon: true },
  { name: 'x-scheduler-internals', sinon: true },
  { name: 'x-scheduler-internals-premium', sinon: true },
  { name: 'x-scheduler-premium', sinon: true },
  { name: 'x-tree-view', exclude: [MATERIAL_VERSION], sinon: true },
  { name: 'x-tree-view-pro', exclude: [MATERIAL_VERSION], sinon: true },
  { name: 'x-virtualizer' },
];

export default mergeConfig(
  sharedConfig,
  defineConfig({
    plugins: [filterReplace],
    // The project root is the repository root, so the dependency scanner would otherwise
    // crawl `scripts/` and try to pre-bundle Node-only packages such as `execa`.
    optimizeDeps: {
      entries: SUITES.map((suite) => `packages/${suite.name}/src/**/*.test.{ts,tsx}`),
      exclude: ['execa', 'npm-run-path', 'unicorn-magic'],
    },
    resolve: {
      alias: [
        {
          find: 'moment/locale',
          replacement: 'moment/dist/locale',
        },
      ],
    },
    test: {
      name: 'browser',
      // Bounds the dependency scanner to the packages that have a browser suite. A wider
      // glob drags Node-only tests (`child_process`, `execa`) into the browser optimizer.
      // Each instance narrows this further to its own package.
      include: SUITES.map((suite) => `packages/${suite.name}/src/**/*.test.{ts,tsx}`),
      browser: {
        enabled: true,
        // A single parent project keeps one pair of Vite servers for the whole run instead
        // of one pair per package. See https://github.com/vitest-dev/vitest/issues/9696.
        instances: SUITES.map((suite) => ({
          browser: 'chromium' as const,
          name: suite.name,
          include: [`packages/${suite.name}/src/**/*.test.{ts,tsx}`],
          exclude: [...BASE_EXCLUDE, ...(suite.exclude ?? [])],
          setupFiles: [
            SETUP_SHARED,
            ...(suite.sinon ? [SETUP_SINON] : []),
            ...(suite.setupFiles ?? []),
          ],
          ...(suite.isolate === undefined ? {} : { isolate: suite.isolate }),
        })),
      },
    },
  }),
);
