import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet, NavLink, useNavigate } from 'react-router';
import { Globals } from '@react-spring/web';
import { setupFakeClock, restoreFakeClock } from '../utils/setupFakeClock'; // eslint-disable-line
import { generateTestLicenseKey, setupTestLicenseKey } from '../utils/testLicense'; // eslint-disable-line
import TestViewer from './TestViewer';
import type { Test } from './tests';

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

let exports: typeof import('./tests');

main();

async function main() {
  setupFakeClock();

  exports = await import('./tests');

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
                {exports.tests.map((test) => {
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
      children: Object.keys(exports.suiteTestsMap).map((suite) => {
        const isDataGridTest =
          suite.indexOf('docs-data-grid') === 0 || suite === 'test-regressions-data-grid';
        return {
          path: suite,
          children: exports.suiteTestsMap[suite].map((test) => ({
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
