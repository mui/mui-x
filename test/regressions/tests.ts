const blacklist = [
  /^docs-(.*)(?<=NoSnap)\.png$/, // Excludes demos that we don't want
  /^docs-data-grid-custom-columns-cell-renderers\/(.*)\.png$/, // Custom components used to build docs pages
  'docs-data-grid-filtering/RemoveBuiltInOperators.png', // Needs interaction
  'docs-data-grid-filtering/CustomRatingOperator.png', // Needs interaction
  'docs-data-grid-filtering/CustomInputComponent.png', // Needs interaction
  /^docs-charts-tooltip\/(.*).png/, // Needs interaction
  'docs-date-pickers-date-calendar/DateCalendarServerRequest.png', // Has random behavior (TODO: Use seeded random)
  // 'docs-system-typography',
];

const unusedBlacklistPatterns = new Set(blacklist);

function excludeTest(suite: string, name: string) {
  return blacklist.some((pattern) => {
    if (typeof pattern === 'string') {
      if (pattern === suite) {
        unusedBlacklistPatterns.delete(pattern);

        return true;
      }
      if (pattern === `${suite}/${name}.png`) {
        unusedBlacklistPatterns.delete(pattern);

        return true;
      }

      return false;
    }

    // assume regex
    if (pattern.test(`${suite}/${name}.png`)) {
      unusedBlacklistPatterns.delete(pattern);
      return true;
    }
    return false;
  });
}

export interface Test {
  path: string;
  suite: string;
  name: string;
  case: React.ComponentType;
}

export const tests: Test[] = [];

// Also use some of the demos to avoid code duplication.
// @ts-ignore
const requireDocs = import.meta.glob('../../docs/data/**/*.js', { eager: true });
Object.keys(requireDocs).forEach((path: string) => {
  const [name, ...suiteArray] = path
    .replace('../../docs/data/', '')
    .replace('.js', '')
    .split('/')
    .reverse();
  const suite = `docs-${suiteArray.reverse().join('-')}`;

  if (excludeTest(suite, name)) {
    return;
  }

  if (requireDocs[path].default === undefined) {
    return;
  }

  tests.push({
    path,
    suite,
    name,
    case: requireDocs[path].default,
  });
});

// @ts-ignore
const requireRegressions = import.meta.glob('./data-grid/**/*.js', { eager: true });
Object.keys(requireRegressions).forEach((path: string) => {
  const name = path.replace('./data-grid/', '').replace('.js', '');
  const suite = `test-regressions-data-grid`;

  tests.push({
    path,
    suite,
    name,
    case: requireRegressions[path].default,
  });
});

if (unusedBlacklistPatterns.size > 0) {
  console.warn(
    [
      'The following patterns are unused:',
      ...Array.from(unusedBlacklistPatterns).map((pattern) => `- ${pattern}`),
    ].join('\n'),
  );
}

export const suiteTestsMap = tests.reduce(
  (acc, test) => {
    if (!acc[test.suite]) {
      acc[test.suite] = [];
    }
    acc[test.suite].push(test);
    return acc;
  },
  {} as Record<string, Test[]>,
);
