import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { LicenseInfo } from '@material-ui/x-grid';
import webfontloader from 'webfontloader';
import TestViewer from 'test/regressions/TestViewer';

// Remove the license warning from demonstration purposes
LicenseInfo.setLicenseKey(
  '0f94d8b65161817ca5d7f7af8ac2f042T1JERVI6TVVJLVN0b3J5Ym9vayxFWFBJUlk9MTY1NDg1ODc1MzU1MCxLRVlWRVJTSU9OPTE=',
);

const blacklist = [
  // 'docs-system-spacing', // Unit tests are enough
  // 'docs-system-typography', // Unit tests are enough
  // 'docs-versions', // No public components
  // /^docs-guides-.*/, // No public components
];

const unusedBlacklistPatterns = new Set(blacklist);

function excludeTest(suite, name) {
  if (/^docs-premium-themes(.*)/.test(suite)) {
    return true;
  }

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
    if (pattern.test(suite)) {
      unusedBlacklistPatterns.delete(pattern);
      return true;
    }
    return false;
  });
}

// Get all the tests specifically written for preventing regressions.
const requireStories = require.context('packages/storybook/src/stories', true, /\.(js|ts|tsx)$/);
const stories = requireStories.keys().reduce((res, path) => {
  const suite = path
    .replace('./', '')
    .replace('.stories', '')
    .replace(/\.\w+$/, '');

  const cases = requireStories(path);

  Object.keys(cases).forEach((name) => {
    if (name !== 'default' && !excludeTest(suite, name)) {
      res.push({
        path,
        suite: `stories-${suite}`,
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

const tests = stories.concat(docs);

if (unusedBlacklistPatterns.size > 0) {
  console.warn(
    `The following patterns are unused:\n\n${Array.from(unusedBlacklistPatterns)
      .map((pattern) => `- ${pattern}`)
      .join('\n')}`,
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

  // Using <link rel="stylesheet" /> does not apply the google Roboto font in chromium headless/headfull.
  const [fontState, setFontState] = React.useState('pending');
  React.useEffect(() => {
    webfontloader.load({
      google: {
        families: ['Roboto:300,400,500,700', 'Material+Icons'],
      },
      custom: {
        families: ['Font Awesome 5 Free:n9'],
        urls: ['https://use.fontawesome.com/releases/v5.1.0/css/all.css'],
      },
      timeout: 20000,
      active: () => {
        setFontState('active');
      },
      inactive: () => {
        setFontState('inactive');
      },
    });
  }, []);

  const testPrepared = fontState !== 'pending';

  function computePath(test) {
    return `/${test.suite}/${test.name}`;
  }

  return (
    <Router>
      <Switch>
        {tests.map((test) => {
          const path = computePath(test);
          const TestCase = test.case;
          if (TestCase === undefined) {
            console.warn('Missing test.case for ', test);
            return null;
          }

          return (
            <Route key={path} exact path={path}>
              {testPrepared && (
                <TestViewer>
                  <TestCase />
                </TestViewer>
              )}
            </Route>
          );
        })}
      </Switch>
      <div hidden={!isDev}>
        <div data-webfontloader={fontState}>webfontloader: {fontState}</div>
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
