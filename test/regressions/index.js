import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LicenseInfo } from '@mui/x-license-pro';
import TestViewer from 'test/regressions/TestViewer';
import { useFakeTimers } from 'sinon';

// This license key is only valid for use with Material UI SAS's projects
// See the terms: https://mui.com/r/x-license-eula
LicenseInfo.setLicenseKey(
  'd483a722e0dc68f4d483487da0ccac45Tz1NVUktRG9jLEU9MTcxNTE2MzgwOTMwNyxTPXByZW1pdW0sTE09c3Vic2NyaXB0aW9uLEtWPTI=',
);

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

// Also use some of the demos to avoid code duplication.
const requireDocs = require.context('docsx/data', true, /js$/);
const tests = requireDocs.keys().reduce((res, path) => {
  const [name, ...suiteArray] = path.replace('./', '').replace('.js', '').split('/').reverse();
  const suite = `docs-${suiteArray.reverse().join('-')}`;

  if (excludeTest(suite, name)) {
    return res;
  }

  // TODO: Why does webpack include a key for the absolute and relative path?
  // We just want the relative path
  if (!path.startsWith('./')) {
    return res;
  }

  res.push({
    path,
    suite,
    name,
    case: requireDocs(path).default,
  });

  return res;
}, []);

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

          const isDataGridTest = path.indexOf('/docs-data-grid') === 0;

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
