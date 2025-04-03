import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet, NavLink, useNavigate } from 'react-router';
import { Globals } from '@react-spring/web';
import TestViewer from './TestViewer';
import { generateTestLicenseKey, setupTestLicenseKey } from '../utils/testLicense';

setupTestLicenseKey(generateTestLicenseKey(new Date('2099-01-01')));

Globals.assign({
  skipAnimation: true,
});

declare global {
  interface Window {
    muiFixture: {
      navigate: ReturnType<typeof useNavigate>;
    };
  }
}

window.muiFixture = {
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

// Also use some of the demos to avoid code duplication.
const docsDemos = import.meta.glob<React.ComponentType>(
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
  {
    import: 'default',
    eager: true,
  },
);
Object.keys(docsDemos).forEach((path) => {
  const [name, ...suiteArray] = path
    .replace('../../docs/data/', '')
    .replace('.js', '')
    .split('/')
    .reverse();
  const suite = `docs-${suiteArray.reverse().join('-')}`;

  tests.push({
    path,
    suite,
    name,
    case: docsDemos[path],
  });
});

const additionalRegressionDemos = import.meta.glob<React.ComponentType>(['./data-grid/*.js'], {
  import: 'default',
  eager: true,
});
Object.keys(additionalRegressionDemos).forEach((path) => {
  if (!path.startsWith('./data-grid/')) {
    return;
  }

  const name = path.replace('./data-grid/', '').replace('.js', '');
  const suite = `test-regressions-data-grid`;

  tests.push({
    path,
    suite,
    name,
    case: additionalRegressionDemos[path],
  });
});

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

function Root() {
  const hash = useHash();
  const isDev = computeIsDev(hash);

  const navigate = useNavigate();
  React.useEffect(() => {
    window.muiFixture.navigate = navigate;
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

ReactDOM.createRoot(document.getElementById('react-root')!).render(<App />);
