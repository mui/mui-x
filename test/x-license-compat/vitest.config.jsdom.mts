import { mergeConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export default mergeConfig(sharedConfig, {
  plugins: [
    {
      name: 'allow-test-licenses-in-pinned-x-license-v9',
      // Published v9 was built with `__ALLOW_TEST_LICENSES__` inlined as `false`, which
      // means `if (license.isTestKey && !false)` always rejects T=true test fixtures.
      // We can't redefine the global at runtime (it's already inlined), so we patch the
      // single guard expression in v9's compiled verifyLicense.js to flip `!false` → `!true`,
      // letting test keys through.
      transform(code: string, id: string) {
        if (/verifyLicense\.m?js$/.test(id) && code.includes('license.isTestKey && !false')) {
          return {
            code: code.replace('license.isTestKey && !false', 'license.isTestKey && !true'),
            map: null,
          };
        }
        return null;
      },
    },
  ],
  test: {
    name: getTestName(import.meta.url),
    environment: 'jsdom',
    server: {
      // Force Vite to run our `transform` hook on v9's source instead of pre-bundling it.
      // Match by package name (`@mui/x-license`, since that's what pnpm resolves the alias to).
      deps: {
        inline: ['@mui/x-license', /@mui[\\/+]x-license/, 'x-license-v9'],
      },
    },
  },
});
