export interface Test {
  path: string;
  suite: string;
  name: string;
  case: React.ComponentType;
}

const tests: Test[] = [];

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
    '!docsx/data/charts/tooltip/*', // Needs interaction
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

const regressionsImports = import.meta.glob<React.ComponentType>('./data-grid/**/*.js', {
  eager: true,
  import: 'default',
});
Object.keys(regressionsImports).forEach((path: string) => {
  const name = path.replace('./data-grid/', '').replace('.js', '');
  const suite = `test-regressions-data-grid`;

  tests.push({
    path,
    suite,
    name,
    case: regressionsImports[path],
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
