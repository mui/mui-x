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
    'docs/data/**/[A-Z]*.js',
    // Hooks examples
    'docs/data/**/use[A-Z]*.js',
    // ================== Exclusions ==================
    '!docs/data/charts/lines/GDPperCapita.js',
    '!docs/data/data-grid/list-view/components/*.js',
    // Excludes demos that we don't want
    '!docs/data/**/*NoSnap.*',
    '!docs/data/data-grid/filtering/RemoveBuiltInOperators', // Needs interaction
    '!docs/data/data-grid/filtering/CustomRatingOperator', // Needs interaction
    '!docs/data/data-grid/filtering/CustomInputComponent', // Needs interaction
    '!docs/data/data-grid/server-side-data/ServerSideLazyLoadingRevalidation', // Flashes cause flaky argos screenshots
    '!docs/data/data-grid/server-side-data/ServerSideLazyLoadingFullyReplaced', // Flashes cause flaky argos screenshots
    '!docs/data/data-grid/server-side-data/ServerSideDataGridRevalidation', // Flashes cause flaky argos screenshots
    '!docs/data/data-grid/server-side-data/ServerSideTreeDataRevalidation', // Flashes cause flaky argos screenshots
    '!docs/data/date-pickers/date-calendar/DateCalendarServerRequest', // Has random behavior (TODO: Use seeded random)
    '!docs/data/charts/tooltip/Custom*', // Composition example
    '!docs/data/charts/tooltip/Item*', // Composition example
    '!docs/data/charts/tooltip/AxisFormatter',
    '!docs/data/charts/tooltip/Formatting',
    '!docs/data/charts/tooltip/SeriesFormatter',
    '!docs/data/charts/tooltip/TooltipStyle',
    '!docs/data/charts/brush/*',
    '!docs/data/data-grid/server-side-data/useNestedPagination',
    '!docs/data/data-grid/server-side-data/NestedPaginationGroupingCell',
    '!docs/data/data-grid/tree-data/utils/TreeDataSyncRowDataGroupingCell',
    '!docs/data/data-grid/tree-data/utils/DataStore',
    '!docs/data/charts/export/ExportOptionSelector', // sub-component for demo purpose
    '!docs/data/charts/axis-ticks/SelectTimeFrequency', // sub-component for demo purpose
    '!docs/data/charts/sankey/CustomNodeLabelPlot', // sub-component for demo purpose
    '!docs/data/charts/references/ReferenceArea', // sub-component for demo purpose
    '!docs/data/charts/references/ReferencePoint', // sub-component for demo purpose
    '!docs/data/charts/scatter/ScatterWebGLRenderer', // Timeout due to the large number of points.

    // Exclude shared utility files that don't have a default export
    '!docs/data/**/shared/*',

    // Streaming demos conflict with sinon fake timers (cancelAnimationFrame on native timer)
    '!docs/data/chat/core/examples/controlled-state/ControlledStateHeadlessChat',

    // Exclude codesandbox embedded demos since they're not using packages built from the branch anyway.
    '!docs/data/migration/migration-pickers-v5/MobileKeyboardView',
    '!docs/data/migration/migration-data-grid-v4/CoreV5WithCoreV4',
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
