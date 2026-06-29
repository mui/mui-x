/**
 * @file Configuration file for bundle-size-checker
 *
 * This file determines which packages and components will have their bundle sizes measured.
 */
import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import { defineConfig } from '@mui/internal-bundle-size-checker';
import generateReleaseInfo from '../../scripts/generateReleaseInfo.mjs';

const rootDir = path.resolve(import.meta.dirname, '../..');

async function findComponents(packageFolder, packageName) {
  const pkgBuildFolder = path.join(rootDir, `packages/${packageFolder}/build`);
  const pkgFiles = await globby(path.join(pkgBuildFolder, '([A-Z])*/index.js'));
  const pkgComponents = pkgFiles.map((componentPath) => {
    const componentName = path.basename(path.dirname(componentPath));
    return `${packageName}/${componentName}`;
  });
  return pkgComponents;
}

// Sub-path exports that aren't renderable components and therefore shouldn't be
// tracked individually for bundle size (types, locales, augmentations, internals).
// Add to this denylist when introducing non-component sub-path exports (e.g. `utils`, `colors`).
const NON_COMPONENT_EXPORTS = new Set(['models', 'locales', 'theme-augmentation', 'internals']);

/**
 * Lists the component entrypoints of a package from its `exports` field.
 *
 * Unlike `findComponents`, which scans the build output for PascalCase component
 * folders, this reads the explicit kebab-case sub-path exports used by the
 * scheduler packages, so newly added views are tracked automatically without
 * hardcoding them here.
 */
function findComponentsFromExports(packageFolder, packageName) {
  const pkgJsonPath = path.join(rootDir, `packages/${packageFolder}/package.json`);
  const { exports: pkgExports } = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  return Object.keys(pkgExports)
    .filter((key) => key.startsWith('./'))
    .map((key) => key.slice(2))
    .filter((name) => !NON_COMPONENT_EXPORTS.has(name) && !name.startsWith('use-'))
    .map((name) => `${packageName}/${name}`);
}

/**
 * Generates the entrypoints configuration by scanning the project structure.
 */
export default defineConfig(async () => {
  const [
    chartsComponents,
    chartsProComponents,
    chartsPremiumComponents,
    datePickersComponents,
    datePickersProComponents,
    treeViewComponents,
    treeViewProComponents,
  ] = await Promise.all([
    findComponents('x-charts', '@mui/x-charts'),
    findComponents('x-charts-pro', '@mui/x-charts-pro'),
    findComponents('x-charts-premium', '@mui/x-charts-premium'),
    findComponents('x-date-pickers', '@mui/x-date-pickers'),
    findComponents('x-date-pickers-pro', '@mui/x-date-pickers-pro'),
    findComponents('x-tree-view', '@mui/x-tree-view'),
    findComponents('x-tree-view-pro', '@mui/x-tree-view-pro'),
  ]);

  // Return the complete entrypoints configuration
  return {
    entrypoints: [
      '@mui/x-data-grid',
      '@mui/x-data-grid/DataGrid',
      '@mui/x-data-grid-pro',
      '@mui/x-data-grid-pro/DataGridPro',
      '@mui/x-data-grid-premium',
      '@mui/x-data-grid-premium/DataGridPremium',
      '@mui/x-charts',
      ...chartsComponents,
      '@mui/x-charts-pro',
      ...chartsProComponents,
      '@mui/x-charts-premium',
      ...chartsPremiumComponents,
      '@mui/x-date-pickers',
      ...datePickersComponents.filter(
        (component) =>
          !component.includes('AdapterDateFnsJalaliV2') && !component.includes('AdapterDateFnsV2'),
      ),
      '@mui/x-date-pickers-pro',
      ...datePickersProComponents.filter(
        (component) =>
          !component.includes('AdapterDateFnsJalaliV2') && !component.includes('AdapterDateFnsV2'),
      ),
      '@mui/x-tree-view',
      ...treeViewComponents,
      '@mui/x-tree-view-pro',
      ...treeViewProComponents,
      '@mui/x-scheduler',
      ...findComponentsFromExports('x-scheduler', '@mui/x-scheduler'),
      '@mui/x-scheduler-premium',
      ...findComponentsFromExports('x-scheduler-premium', '@mui/x-scheduler-premium'),
      '@mui/x-license',
      '@mui/x-license/internals',
    ],
    upload: !!process.env.CI,
    replace: {
      // Stabilize release info string
      [JSON.stringify(generateReleaseInfo())]: JSON.stringify('__RELEASE_INFO__'),
    },
    comment: true,
  };
});
