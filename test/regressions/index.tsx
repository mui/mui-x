import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet, NavLink, useNavigate } from 'react-router';
import { Globals } from '@react-spring/web';
import { LicenseInfo } from '@mui/x-license';
import { TEST_LICENSE_KEY_PREMIUM } from 'test/utils/licenseKeys';
import {
  clearDemoDataCache,
  clearMockServerCache,
  resetRandomGenerators,
} from '@mui/x-data-grid-generator';
import loadFonts from '@mui/internal-test-utils/loadFonts';
// Static font files, installed from npm instead of loaded from Google Fonts. Google
// serves Roboto as a variable font, and for the same stylesheet URL it sometimes
// returns a file with the weight axis trimmed to the requested range (300-700
// instead of 100-900). That file renders weights other than 400 with slightly
// different glyph outlines and advances, which shows up as random anti-aliasing
// diffs in the screenshots.
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/400-italic.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { fakeTimers, flushTimers } from './fakeClock';
import TestViewer from './TestViewer';
import OverviewWrapper from './overviews/OverviewWrapper';
import { type Test, testsBySuite } from './testsBySuite';

LicenseInfo.setLicenseKey(TEST_LICENSE_KEY_PREMIUM);

Globals.assign({
  skipAnimation: true,
});

declare global {
  interface Window {
    muiFixture: {
      allTests: { url: string }[];
      fontsReady: Promise<void>;
      isReady: boolean;
      navigate: (test: string) => void;
      flushTimers: () => Promise<void>;
    };
  }
}

const allTests = Object.values(testsBySuite).flatMap((suite) =>
  suite.map((test) => ({ url: computePath(test) })),
);

window.muiFixture = {
  allTests,
  // `index.test.ts` awaits this in `navigateToTest`, before any fixture mounts.
  // The font imports above declare the faces.
  fontsReady: loadFonts({
    stylesheets: [],
    faces: [
      ...[300, 400, 500, 700].map((weight) => ({ family: 'Roboto', weight })),
      { family: 'Roboto', weight: 400, style: 'italic' },
    ],
    subsets: [
      { name: 'latin', text: ' ' },
      // Chart demos label standard deviations, e.g.
      // `docs/data/charts/composition/BellCurveOverlay.js`.
      { name: 'greek', text: 'σ' },
    ],
  }),
  isReady: false,
  navigate: () => {
    throw new Error(`muiFixture.navigate is not ready`);
  },
  // Called by the runner once the test case mounted, see `navigateToTest`.
  flushTimers,
};

main();

async function main() {
  ReactDOM.createRoot(document.getElementById('react-root')!).render(<App />);
}

function Root() {
  const hash = useHash();
  const isDev = computeIsDev(hash);

  const navigate = useNavigate();
  React.useEffect(() => {
    window.muiFixture.navigate = (path) => {
      // Each demo should observe the same seeded random sequence regardless
      // of what was rendered before on this page.
      resetRandomGenerators();
      // Same for the generated data: a cache hit skips the empty first render,
      // which changes how some demos render compared to a cold cache.
      clearDemoDataCache();
      clearMockServerCache();
      fakeTimers();
      navigate(path);
    };
    window.muiFixture.isReady = true;
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
        const isDataGridTest =
          suite.startsWith('docs-data-grid') || suite === 'test-regressions-data-grid';
        const isDataGridPivotTest = isDataGridTest && suite.startsWith('docs-data-grid-pivoting');
        const isOverviewTest = suite.startsWith('test-regressions-overviews-');

        return {
          path: suite,
          children: testsBySuite[suite].map((test) => ({
            path: test.name,
            element: (
              <TestViewer
                isDataGridTest={isDataGridTest}
                isDataGridPivotTest={isDataGridPivotTest}
                path={computePath(test)}
              >
                {isOverviewTest ? (
                  <OverviewWrapper>
                    <test.case />
                  </OverviewWrapper>
                ) : (
                  <test.case />
                )}
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
  return false;
}

function computePath(test: Test) {
  return `/${test.suite}/${test.name}`;
}
