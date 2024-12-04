import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import TestViewer from './TestViewer';

interface Fixture {
  path: string;
  suite: string;
  name: string;
  Component: React.ComponentType;
}

const fixtures: Fixture[] = [];

// @ts-ignore
const requireFixtures = require.context('./fixtures', true, /\.(js|ts|tsx)$/);
requireFixtures.keys().forEach((path: string) => {
  // require.context contains paths for module alias imports and relative imports
  if (!path.startsWith('.')) {
    return;
  }
  const [suite, name] = path
    .replace('./', '')
    .replace(/\.\w+$/, '')
    .split('/');
  fixtures.push({
    path,
    suite: `e2e/${suite}`,
    name,
    Component: requireFixtures(path).default,
  });
});

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

  function computePath(fixture: Fixture) {
    return `/${fixture.suite}/${fixture.name}`;
  }

  const suiteFixturesMap = React.useMemo(
    () =>
      fixtures.reduce(
        (acc, fixture) => {
          if (!acc[fixture.suite]) {
            acc[fixture.suite] = [];
          }
          acc[fixture.suite].push(fixture);
          return acc;
        },
        {} as Record<string, Fixture[]>,
      ),
    [],
  );

  return (
    <Router>
      <Routes>
        {Object.keys(suiteFixturesMap).map((suite) => {
          return (
            <Route key={suite} path={suite}>
              {suiteFixturesMap[suite].map((fixture) => {
                const FixtureComponent = fixture.Component;
                if (FixtureComponent === undefined) {
                  console.warn('Missing `Component` ', fixture);
                  return null;
                }

                return (
                  <Route
                    key={fixture.name}
                    path={fixture.name}
                    element={
                      <TestViewer>
                        <FixtureComponent />
                      </TestViewer>
                    }
                  />
                );
              })}
            </Route>
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
              {fixtures.map((test) => {
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

ReactDOM.createRoot(document.getElementById('react-root')!).render(<App />);
