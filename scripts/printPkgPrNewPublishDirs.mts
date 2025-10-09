const publishDirs = {
  '@mui/x-charts': 'packages/x-charts',
  '@mui/x-charts-pro': 'packages/x-charts-pro',
  '@mui/x-charts-premium': 'packages/x-charts-premium',
  '@mui/x-charts-vendor': 'packages/x-charts-vendor',
  '@mui/x-codemod': 'packages/x-codemod',
  '@mui/x-data-grid': 'packages/x-data-grid',
  '@mui/x-data-grid-generator': 'packages/x-data-grid-generator',
  '@mui/x-data-grid-premium': 'packages/x-data-grid-premium',
  '@mui/x-data-grid-pro': 'packages/x-data-grid-pro',
  '@mui/x-date-pickers': 'packages/x-date-pickers',
  '@mui/x-date-pickers-pro': 'packages/x-date-pickers-pro',
  '@mui/x-internals': 'packages/x-internals',
  '@mui/x-internal-gestures': 'packages/x-internal-gestures',
  '@mui/x-license': 'packages/x-license',
  // private packages can not be published
  // '@mui/x-scheduler': 'packages/x-scheduler',
  '@mui/x-telemetry': 'packages/x-telemetry',
  '@mui/x-tree-view': 'packages/x-tree-view',
  '@mui/x-tree-view-pro': 'packages/x-tree-view-pro',
};

// console.log is supposedly adding a line break, which might not be something we want here.
process.stdout.write(Object.values(publishDirs).join(' '));
