import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import './app.less';
import { DemoAppBar } from './app-bar';
import { AppDrawer } from './app-drawer';
import { appReducer } from './app-reducer';
import { ThemeProvider, useTheme } from './demos/theme';
import { RealDataGridDemo } from './demos/grid/real-data-grid.demo';
import { AppIntro } from './app-intro';

const StyledApp = styled.div`
  background: ${(p) => p.theme.colors.background};
`;

export function App() {
  const [state, dispatch] = React.useReducer(appReducer, { isOpen: false });
  const toggleDrawer = React.useCallback(
    () => dispatch({ type: state.isOpen ? 'close-drawer' : 'open-drawer' }),
    [state, dispatch],
  );

  const { theme, themeId, toggleTheme, isDark } = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <StyledApp className="app">
          <DemoAppBar
            onMenuButtonClick={toggleDrawer}
            onThemeToggle={toggleTheme}
            isDark={isDark}
          />
          <AppDrawer isOpen={state.isOpen} toggleDrawer={toggleDrawer} />
          <Switch>
            <Route path="/grid">
              <RealDataGridDemo toggleTheme={toggleTheme} themeId={themeId} />
            </Route>
            <Route path="/">
              <AppIntro />
            </Route>
          </Switch>
        </StyledApp>
      </HashRouter>
    </ThemeProvider>
  );
}
