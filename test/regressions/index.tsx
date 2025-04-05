import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet, NavLink, useNavigate } from 'react-router';
import { Globals } from '@react-spring/web';
import { setupFakeClock } from '../utils/setupFakeClock'; // eslint-disable-line
import { generateTestLicenseKey, setupTestLicenseKey } from '../utils/testLicense'; // eslint-disable-line
import TestViewer from './TestViewer';

/* eslint-disable guard-for-in */

setupFakeClock();

setupTestLicenseKey(generateTestLicenseKey(new Date('2099-01-01')));

Globals.assign({
  skipAnimation: true,
});

declare global {
  interface Window {
    muiFixture: {
      isReady: () => boolean;
      navigate: ReturnType<typeof useNavigate>;
    };
  }
}

window.muiFixture = {
  isReady: () => false,
  navigate: () => {
    throw new Error(`muiFixture.navigate is not ready`);
  },
};

interface Test {
  path: string;
  suite: string;
  name: string;
  case: React.ComponentType;
}

const tests: Test[] = [];
const suiteTestsMap: Record<string, Test[]> = {};

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

main();

async function main() {
  await prepareTests();

  ReactDOM.createRoot(document.getElementById('react-root')!).render(<App />);
}

async function prepareTests() {
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

  // Also use some of the demos to avoid code duplication.
  // @ts-ignore
  const requireDocs = await loadAll(import.meta.glob('../../docs/data/**/*.js'));
  for (const path in requireDocs) {
    const [name, ...suiteArray] = path
      .replace('../../docs/data/', '')
      .replace('.js', '')
      .split('/')
      .reverse();
    const suite = `docs-${suiteArray.reverse().join('-')}`;

    if (excludeTest(suite, name)) {
      continue;
    }

    const exports = requireDocs[path];
    if (exports.default === undefined) {
      continue;
    }

    tests.push({
      path,
      suite,
      name,
      case: exports.default,
    });
  }

  // @ts-ignore
  const requireRegressions = await loadAll(import.meta.glob('./data-grid/**/*.js'));
  for (const path in requireRegressions) {
    const name = path.replace('./data-grid/', '').replace('.js', '');
    const suite = `test-regressions-data-grid`;
    const exports = requireRegressions[path];

    tests.push({
      path,
      suite,
      name,
      case: exports.default,
    });
  }

  if (unusedBlacklistPatterns.size > 0) {
    console.warn(
      [
        'The following patterns are unused:',
        ...Array.from(unusedBlacklistPatterns).map((pattern) => `- ${pattern}`),
      ].join('\n'),
    );
  }

  tests.forEach((test) => {
    if (!suiteTestsMap[test.suite]) {
      suiteTestsMap[test.suite] = [];
    }
    suiteTestsMap[test.suite].push(test);
  });
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
              <TestViewer isDataGridTest={isDataGridTest} path={computePath(test)}>
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

function Root() {
  const hash = useHash();
  const isDev = computeIsDev(hash);

  const navigate = useNavigate();
  React.useEffect(() => {
    window.muiFixture.navigate = navigate;
    window.muiFixture.isReady = () => true;
  }, [navigate]);

  return (
    <React.Fragment>
      <Outlet />
      {isDev ? (
        <div>
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
      ) : null}
    </React.Fragment>
  );
}

function useHash() {
  const subscribe = React.useCallback((callback: any) => {
    window.addEventListener('hashchange', callback);
    return () => {
      window.removeEventListener('hashchange', callback);
    };
  }, []);
  const getSnapshot = React.useCallback(() => window.location.hash, []);
  const getServerSnapshot = React.useCallback(() => '', []);
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function computeIsDev(hash: string) {
  if (hash === '#dev') {
    return true;
  }
  if (hash === '#no-dev') {
    return false;
  }
  return process.env.NODE_ENV === 'development';
}

function computePath(test: Test) {
  return `/${test.suite}/${test.name}`;
}

async function loadAll(imports: Record<string, () => Promise<any>>) {
  const result = {} as any;
  const promises = [];
  for (const key in imports) {
    promises.push(
      imports[key]().then((exports) => {
        result[key] = exports;
      }),
    );
  }
  await Promise.all(promises);
  return result;
}
