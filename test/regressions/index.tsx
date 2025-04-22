import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet, NavLink, useNavigate } from 'react-router';
import { Globals } from '@react-spring/web';
import { setupFakeClock, restoreFakeClock } from '../utils/setupFakeClock'; // eslint-disable-line
import { generateTestLicenseKey, setupTestLicenseKey } from '../utils/testLicense'; // eslint-disable-line
import TestViewer from './TestViewer';
import type { Test } from './testsBySuite';

setupTestLicenseKey(generateTestLicenseKey(new Date('2099-01-01')));

Globals.assign({
  skipAnimation: true,
});

declare global {
  interface Window {
    muiFixture: {
      isReady: () => boolean;
      navigate: (test: string) => void;
    };
  }
}

window.muiFixture = {
  isReady: () => false,
  navigate: () => {
    throw new Error(`muiFixture.navigate is not ready`);
  },
};

let testsBySuite: typeof import('./testsBySuite').testsBySuite;

main();

async function main() {
  setupFakeClock();

  testsBySuite = (await import('./testsBySuite')).testsBySuite;

  restoreFakeClock();

  ReactDOM.createRoot(document.getElementById('react-root')!).render(<App />);
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
                {Object.values(testsBySuite).map((suite) => (
                  <React.Fragment>
                    {suite.map((test) => {
                      const path = computePath(test);
                      return (
                        <li key={path}>
                          <NavLink to={path}>{path}</NavLink>
                        </li>
                      );
                    })}
                  </React.Fragment>
                ))}
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
      children: Object.keys(testsBySuite).map((suite) => {
        const isPrintExportChartTest =
          suite.startsWith('docs-charts') && suite.includes('PrintChart');
        const isDataGridTest =
          suite.startsWith('docs-data-grid') || suite === 'test-regressions-data-grid';
        const isDataGridPivotTest = isDataGridTest && suite.startsWith('docs-data-grid-pivoting');
        return {
          path: suite,
          children: testsBySuite[suite].map((test) => ({
            path: test.name,
            element: (
              <TestViewer
                isDataGridTest={isDataGridTest}
                isDataGridPivotTest={isDataGridPivotTest}
                isPrintExportChartTest={isPrintExportChartTest}
                path={computePath(test)}
              >
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
