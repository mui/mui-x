import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      name: getTestName(import.meta.url),
      setupFiles: [fileURLToPath(new URL('../../test/utils/setupDataGrid.ts', import.meta.url))],
      exclude: [
        '**/materialVersion.test.tsx',
        // The formula engine is DOM-free by design (no React/grid imports) —
        // its suites run in jsdom only to keep the browser run lean.
        '**/hooks/features/formula/engine/*.test.ts',
        // These formula unit suites assert pure function results (or DOM that
        // jsdom implements, for the caret module) — jsdom covers them fully,
        // and `createFormulaEvaluation` allocates 100k-row fixtures that don't
        // belong in the shared browser process. Real-browser behavior stays
        // covered by the formula integration suites in `src/tests`.
        '**/hooks/features/formula/gridFormulaPlainEditing.test.ts',
        '**/hooks/features/formula/gridFormulaLiveGeometry.test.ts',
        '**/hooks/features/formula/gridFormulaReferenceHighlights.test.ts',
        '**/hooks/features/formula/createFormulaEvaluation.test.ts',
        '**/hooks/features/formula/gridFormulaAutocomplete.test.tsx',
        '**/hooks/features/formula/gridFormulaPreview.test.tsx',
        '**/components/formulaEditorCaret.test.ts',
      ],
      browser: {
        enabled: true,
        instances: [{ browser: 'chromium' }],
      },
    },
  }),
);
