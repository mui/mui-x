import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
  'docs-data-grid-filtering/RemoveBuiltInOperators.png', // Needs interaction
  'docs-data-grid-filtering/CustomRatingOperator.png', // Needs interaction
  'docs-data-grid-filtering/CustomInputComponent.png', // Needs interaction
  'docs-date-pickers-date-calendar/DateCalendarServerRequest.png', // Has random behavior (TODO: Use seeded random)
  // 'docs-system-typography',
];

const unusedBlacklistPatterns = new Set(blacklist);

// Use a "real timestamp" so that we see a useful date instead of "00:00"
// eslint-disable-next-line react-hooks/rules-of-hooks -- not a React hook
const clock = useFakeTimers(new Date('Mon Aug 18 14:11:54 2014 -0500'));

function excludeTest(suite, name) {
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

const tests = [];

// Also use some of the demos to avoid code duplication.
const requireDocs = require.context('docsx/data', true, /\.js$/);
requireDocs.keys().forEach((path) => {
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

  tests.push({
    path,
    suite,
    name,
    case: requireDocs(path).default,
  });
});

const requireRegressions = require.context('./data-grid', true, /\.js$/);
requireRegressions.keys().forEach((path) => {
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

function App() {
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

  function computePath(test) {
    return `/${test.suite}/${test.name}`;
  }

  return (
    <Router>
      <Routes>
        {tests.map((test) => {
          const path = computePath(test);
          const TestCase = test.case;
          if (TestCase === undefined) {
            console.warn('Missing test.case for ', test);
            return null;
          }

          const isDataGridTest =
            path.indexOf('/docs-data-grid') === 0 ||
            path.indexOf('test-regressions-data-grid') !== -1;

          return (
            <Route
              key={path}
              exact
              path={path}
              element={
                <TestViewer isDataGridTest={isDataGridTest}>
                  <TestCase />
                </TestViewer>
              }
            />
          );
        })}
      </Routes>
      <div hidden={!isDev}>
        <p>
          Devtools can be enabled by appending <code>#dev</code> in the addressbar or disabled by
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
                    <Link to={path}>{path}</Link>
                  </li>
                );
              })}
            </ol>
          </nav>
        </details>
      </div>
    </Router>
  );
}

const container = document.getElementById('react-root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
