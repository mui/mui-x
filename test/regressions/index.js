import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LicenseInfo } from '@mui/x-data-grid-pro';
import { withStyles } from '@mui/styles';
import TestViewer from 'test/regressions/TestViewer';
import { useFakeTimers } from 'sinon';
import addons, { mockChannel } from '@storybook/addons';

// See https://storybook.js.org/docs/react/workflows/faq#why-is-there-no-addons-channel
addons.setChannel(mockChannel());

// Remove the license warning from demonstration purposes
LicenseInfo.setLicenseKey(
  '0f94d8b65161817ca5d7f7af8ac2f042T1JERVI6TVVJLVN0b3J5Ym9vayxFWFBJUlk9MTY1NDg1ODc1MzU1MCxLRVlWRVJTSU9OPTE=',
);

const blacklist = [
  /^docs-components-(.*)(?<=NoSnap)\.png$/, // Excludes demos that we don't want
  'docs-components-data-grid-filtering/ColumnTypeFilteringGrid.png', // Needs interaction
  'docs-components-data-grid-filtering/CustomRatingOperator.png', // Needs interaction
  'docs-components-data-grid-filtering/ExtendNumericOperator.png', // Needs interaction
  // TODO import the Rating from @mui/material, not the lab.
  'docs-components-data-grid-components/CustomFooter.png',
  // 'docs-system-typography',
  /^stories(.*)(?<!Snap)\.png$/, // Excludes stories that aren't suffixed with 'Snap'.
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

// Get all the tests specifically written for preventing regressions.
const requireStories = require.context('packages/storybook/src/stories', true, /\.(js|ts|tsx)$/);
const stories = requireStories.keys().reduce((res, path) => {
  let suite = path
    .replace('./', '')
    .replace('.stories', '')
    .replace(/\.\w+$/, '');
  suite = `stories-${suite}`;

  const cases = requireStories(path);

  Object.keys(cases).forEach((name) => {
    if (name !== 'default' && !excludeTest(suite, name)) {
      res.push({
        path,
        suite,
        name,
        case: cases[name],
      });
    }
  });

  return res;
}, []);

// Also use some of the demos to avoid code duplication.
const requireDocs = require.context('docsx/src/pages', true, /js$/);
const docs = requireDocs.keys().reduce((res, path) => {
  const [name, ...suiteArray] = path.replace('./', '').replace('.js', '').split('/').reverse();
  const suite = `docs-${suiteArray.reverse().join('-')}`;

  if (excludeTest(suite, name)) {
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

const tests = stories.concat(docs);

if (unusedBlacklistPatterns.size > 0) {
  console.warn(
    `The following patterns are unused:\n\n${Array.from(unusedBlacklistPatterns)
      .map((pattern) => `- ${pattern}`)
      .join('\n')}`,
  );
}

const GlobalStyles = withStyles({
  '@global': {
    html: {
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
      // Do the opposite of the docs in order to help catching issues.
      boxSizing: 'content-box',
    },
    '*, *::before, *::after': {
      boxSizing: 'inherit',
      // Disable transitions to avoid flaky screenshots
      transition: 'none !important',
      animation: 'none !important',
    },
    body: {
      margin: 0,
      overflowX: 'hidden',
    },
  },
})(() => null);

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
      <GlobalStyles />
      <Routes>
        {tests.map((test) => {
          const path = computePath(test);
          const TestCase = test.case;
          if (TestCase === undefined) {
            console.warn('Missing test.case for ', test);
            return null;
          }

          let dataGridContainer = false;
          if (path.indexOf('/docs-components-data-grid') === 0 || path.indexOf('/stories-') === 0) {
            dataGridContainer = true;
          }

          return (
            <Route
              key={path}
              exact
              path={path}
              element={
                <TestViewer dataGridContainer={dataGridContainer}>
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

ReactDOM.render(<App />, document.getElementById('react-root'));
