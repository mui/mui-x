import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet, NavLink } from 'react-router';
import TestViewer from 'test/regressions/TestViewer';
import { useFakeTimers } from 'sinon';
import { Globals } from '@react-spring/web';
import { setupTestLicenseKey } from '../utils/testLicense';

setupTestLicenseKey();

Globals.assign({
  skipAnimation: true,
});

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

// Use a "real timestamp" so that we see a useful date instead of "00:00"
// eslint-disable-next-line react-hooks/rules-of-hooks -- not a React hook
const clock = useFakeTimers(new Date('Mon Aug 18 14:11:54 2014 -0500'));

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

interface Test {
  path: string;
  suite: string;
  name: string;
  case: React.ComponentType;
}

const tests: Test[] = [];

// Also use some of the demos to avoid code duplication.
// @ts-ignore
const requireDocs = require.context('docsx/data', true, /\.js$/);
requireDocs.keys().forEach((path: string) => {
  const [name, ...suiteArray] = path.replace('./', '').replace('.js', '').split('/').reverse();
  const suite = `docs-${suiteArray.reverse().join('-')}`;

  if (excludeTest(suite, name)) {
    return;
  }

  // TODO: Why does webpack include a key for the absolute and relative path?
  // We just want the relative path
  if (!path.startsWith('./')) {
    return;
  }

  if (requireDocs(path).default === undefined) {
    return;
  }

  tests.push({
    path,
    suite,
    name,
    case: requireDocs(path).default,
  });
});

// @ts-ignore
const requireRegressions = require.context('./data-grid', true, /\.js$/);
requireRegressions.keys().forEach((path: string) => {
  // "./DataGridRTLVirtualization.js"
  // "test/regressions/data-grid/DataGridRTLVirtualization.js"
  if (!path.startsWith('./')) {
    return;
  }

  const name = path.replace('./', '').replace('.js', '');
  const suite = `test-regressions-data-grid`;

  tests.push({
    path,
    suite,
    name,
    case: requireRegressions(path).default,
  });
});

clock.restore();

if (unusedBlacklistPatterns.size > 0) {
  console.warn(
    [
      'The following patterns are unused:',
      ...Array.from(unusedBlacklistPatterns).map((pattern) => `- ${pattern}`),
    ].join('\n'),
  );
}

const suiteTestsMap = tests.reduce(
  (acc, test) => {
    if (!acc[test.suite]) {
      acc[test.suite] = [];
    }
    acc[test.suite].push(test);
    return acc;
  },
  {} as Record<string, Test[]>,
);

function Root() {
  function computeIsDev() {
    if (window.location.hash === '#dev') {
      return true;
    }
    if (window.location.hash === '#no-dev') {
      return false;
    }
    return process.env.NODE_ENV === 'development';
  }
  const [isDev, setDev] = React.useState(computeIsDev);
  React.useEffect(() => {
    function handleHashChange() {
      setDev(computeIsDev());
    }
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  function computePath(test: Test) {
    return `/${test.suite}/${test.name}`;
  }
  return (
    <React.Fragment>
      <Outlet />
      <div hidden={!isDev}>
        <p>
          Devtools can be enabled by appending <code>#dev</code> in the address bar or disabled by
          appending <code>#no-dev</code>.
        </p>
        <a href="#no-dev">Hide devtools</a>
        <details>
          <summary id="my-test-summary">nav for all tests</summary>
          <nav id="tests">
            <ol>
              {tests.map((test) => {
                const path = computePath(test);
                return (
                  <li key={path}>
                    <NavLink to={path}>{path}</NavLink>
                  </li>
                );
              })}
            </ol>
          </nav>
        </details>
      </div>
    </React.Fragment>
  );
}

function App() {
  const routes = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: Object.keys(suiteTestsMap).map((suite) => {
        const isDataGridTest =
          suite.indexOf('docs-data-grid') === 0 || suite === 'test-regressions-data-grid';
        return {
          path: suite,
          children: suiteTestsMap[suite].map((test) => ({
            path: test.name,
            element: (
              <TestViewer isDataGridTest={isDataGridTest}>
                <test.case />
              </TestViewer>
            ),
          })),
        };
      }),
    },
  ]);

  return <RouterProvider router={routes} />;
}

ReactDOM.createRoot(document.getElementById('react-root')!).render(<App />);
