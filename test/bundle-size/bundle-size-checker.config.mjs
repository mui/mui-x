/**
 * @file Configuration file for bundle-size-checker
 *
 * This file determines which packages and components will have their bundle sizes measured.
 */
import path from 'path';
import glob from 'fast-glob';
import { defineConfig } from '@mui/internal-bundle-size-checker';

const rootDir = path.resolve(import.meta.dirname, '../..');

async function findComponents(packageFolder, packageName) {
  const pkgBuildFolder = path.join(rootDir, `packages/${packageFolder}/build`);
  const pkgFiles = await glob(path.join(pkgBuildFolder, '([A-Z])*/index.js'));
  const pkgComponents = pkgFiles.map((componentPath) => {
    const componentName = path.basename(path.dirname(componentPath));
    return `${packageName}/${componentName}`;
  });
  return pkgComponents;
}

/**
 * Generates the entrypoints configuration by scanning the project structure.
 */
export default defineConfig(async () => {
  const [
    chartsComponents,
    chartsProComponents,
    // TODO: CHARTS-PREMIUM: uncomment when premium is available
    // chartsPremiumComponents,
    datePickersComponents,
    datePickersProComponents,
    treeViewComponents,
    treeViewProComponents,
  ] = await Promise.all([
    findComponents('x-charts', '@mui/x-charts'),
    findComponents('x-charts-pro', '@mui/x-charts-pro'),
    // TODO: CHARTS-PREMIUM: uncomment when premium is available
    // findComponents('x-charts-premium', '@mui/x-charts-premium'),
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
      // TODO: CHARTS-PREMIUM: uncomment when premium is available
      // '@mui/x-charts-premium',
      // ...chartsPremiumComponents,
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
    ],
    upload: !!process.env.CI,
  };
});
