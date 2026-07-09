/**
 * @file Configuration file for bundle-size-checker
 *
 * This file determines which packages and components will have their bundle sizes measured.
 */
import { defineConfig } from '@mui/internal-bundle-size-checker';
import generateReleaseInfo from '../../scripts/generateReleaseInfo.mjs';

// `expand` measures one entrypoint per sub-path export declared in a package's
// (built) `package.json`, minus the `exclude` micromatch globs (matched against
// the export subpath). The excludes below express *what is not a renderable
// component*, so newly added components are tracked automatically.

// Renderable components are PascalCase; every lowercase-first sub-path export
// (hooks, models, locales, internals, utils, internals/demo, moduleAugmentation/*, …)
// is a non-component. A single rule covers them at any depth.
const componentPackage = { exclude: ['[a-z]*', '[a-z]*/**'] };

// Date-pickers additionally ship deprecated v2 adapters we don't track.
const pickersPackage = {
  exclude: [...componentPackage.exclude, 'AdapterDateFnsJalaliV2', 'AdapterDateFnsV2'],
};

// Scheduler views are kebab-case (lowercase), so the case rule can't distinguish
// them from non-components; deny the known non-view sub-paths instead.
const schedulerPackage = {
  exclude: ['models', 'locales', 'theme-augmentation', 'internals', 'use-*'],
};

export default defineConfig({
  entrypoints: [
    { id: '@mui/x-data-grid', expand: componentPackage },
    { id: '@mui/x-data-grid-pro', expand: componentPackage },
    { id: '@mui/x-data-grid-premium', expand: componentPackage },
    { id: '@mui/x-charts', expand: componentPackage },
    { id: '@mui/x-charts-pro', expand: componentPackage },
    { id: '@mui/x-charts-premium', expand: componentPackage },
    { id: '@mui/x-date-pickers', expand: pickersPackage },
    { id: '@mui/x-date-pickers-pro', expand: pickersPackage },
    { id: '@mui/x-tree-view', expand: componentPackage },
    { id: '@mui/x-tree-view-pro', expand: componentPackage },
    { id: '@mui/x-scheduler', expand: schedulerPackage },
    { id: '@mui/x-scheduler-premium', expand: schedulerPackage },
    { id: '@mui/x-chat', expand: componentPackage },
    { id: '@mui/x-license', expand: componentPackage },
  ],
  upload: !!process.env.CI,
  replace: {
    // Stabilize release info string
    [JSON.stringify(generateReleaseInfo())]: JSON.stringify('__RELEASE_INFO__'),
  },
  comment: true,
});
