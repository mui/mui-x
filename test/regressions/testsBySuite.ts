export interface Test {
  path: string;
  suite: string;
  name: string;
  case: React.ComponentType;
}

const tests: Test[] = [];

const removeExtension = (filePath: string) => {
  const extStart = filePath.lastIndexOf('.');
  return extStart >= 0 ? filePath.slice(0, extStart) : filePath;
};

// Also use some of the demos to avoid code duplication.
const docsImports = import.meta.glob<React.ComponentType>(
  [
    'docsx/data/**/[A-Z]*.js',
    // Hooks examples
    'docsx/data/**/use[A-Z]*.js',
    // ================== Exclusions ==================
    '!docsx/data/charts/lines/GDPperCapita.js',
    '!docsx/data/data-grid/list-view/components/*.js',
    // Excludes demos that we don't want
    '!docsx/data/**/*NoSnap.*',
    '!docsx/data/data-grid/filtering/RemoveBuiltInOperators', // Needs interaction
    '!docsx/data/data-grid/filtering/CustomRatingOperator', // Needs interaction
    '!docsx/data/data-grid/filtering/CustomInputComponent', // Needs interaction
    '!docsx/data/date-pickers/date-calendar/DateCalendarServerRequest', // Has random behavior (TODO: Use seeded random)
    '!docsx/data/charts/tooltip/Custom*', // Composition example
    '!docsx/data/charts/tooltip/Item*', // Composition example
    '!docsx/data/charts/tooltip/AxisFormatter',
    '!docsx/data/charts/tooltip/Formatting',
    '!docsx/data/charts/tooltip/SeriesFormatter',
    '!docsx/data/charts/tooltip/TooltipStyle',
    '!docsx/data/charts/brush/*',
    '!docsx/data/data-grid/server-side-data/useNestedPagination',
    '!docsx/data/data-grid/server-side-data/NestedPaginationGroupingCell',
    '!docsx/data/data-grid/tree-data/utils/TreeDataSyncRowDataGroupingCell',
    '!docsx/data/data-grid/tree-data/utils/DataStore',
    '!docsx/data/charts/export/ExportOptionSelector', // sub-component for demo purpose
    '!docsx/data/charts/axis/SelectTimeFrequency', // sub-component for demo purpose
    '!docsx/data/charts/sankey/CustomNodeLabelPlot', // sub-component for demo purpose
    '!docsx/data/scheduler/lazy-loading/BasicDataSource.tsx', // Has random behavior

    // Exclude codesandbox embedded demos since they're not using packages built from the branch anyway.
    '!docsx/data/migration/migration-pickers-v5/MobileKeyboardView',
    '!docsx/data/migration/migration-data-grid-v4/CoreV5WithCoreV4',
    //
  ],
  { eager: true, import: 'default' },
);
Object.keys(docsImports).forEach((path: string) => {
  const [name, ...suiteArray] = path
    .replace('../../docs/data/', '')
    .replace('.js', '')
    .split('/')
    .reverse();
  const suite = `docs-${suiteArray.reverse().join('-')}`;

  if (docsImports[path] === undefined) {
    return;
  }

  tests.push({
    path,
    suite,
    name,
    case: docsImports[path],
  });
});

const regressionsImports = import.meta.glob<React.ComponentType>('./data-grid/**/*.{js,tsx}', {
  eager: true,
  import: 'default',
});
Object.keys(regressionsImports).forEach((path: string) => {
  const name = removeExtension(path.replace('./data-grid/', ''));
  const suite = `test-regressions-data-grid`;

  tests.push({
    path,
    suite,
    name,
    case: regressionsImports[path],
  });
});

const chartsImports = import.meta.glob<React.ComponentType>('./charts/**/*.{js,tsx}', {
  eager: true,
  import: 'default',
});
Object.keys(chartsImports).forEach((path: string) => {
  const name = removeExtension(path.replace('./charts/', ''));
  const suite = `test-regressions-charts`;

  tests.push({
    path,
    suite,
    name,
    case: chartsImports[path],
  });
});

const pickersImports = import.meta.glob<React.ComponentType>('./pickers/**/*.{js,tsx}', {
  eager: true,
  import: 'default',
});
Object.keys(pickersImports).forEach((path: string) => {
  const name = removeExtension(path.replace('./pickers/', ''));
  const suite = `test-regressions-pickers`;

  tests.push({
    path,
    suite,
    name,
    case: pickersImports[path],
  });
});

export const testsBySuite = tests.reduce(
  (acc, test) => {
    if (!acc[test.suite]) {
      acc[test.suite] = [];
    }
    acc[test.suite].push(test);
    return acc;
  },
  {} as Record<string, Test[]>,
);
