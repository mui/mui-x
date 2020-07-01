import React, { useCallback, useReducer } from 'react';
import { DemoAppBar } from './app-bar';

import './app.less';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { AppDrawer } from './app-drawer';
import { appReducer } from './app-reducer';
import { ThemeProvider, useTheme } from './demos/theme';
import { RealDataGridDemo } from './demos/grid/real-data-grid.demo';

import { AppIntro } from './app-intro';
import styled from 'styled-components';

const StyledApp = styled.div`
  background: ${p => p.theme.colors.background};
`;

export const App: React.FC<{}> = () => {
  const [state, dispatch] = useReducer(appReducer, { isOpen: false });
  const toggleDrawer = useCallback(
    () => dispatch({ type: state.isOpen ? 'close-drawer' : 'open-drawer' }),
    [state, dispatch],
  );

  const [theme, themeId, toggleTheme, isDark] = useTheme();

  return (
    <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
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
              <RealDataGridDemo />
            </Route>
            <Route path="/">
              <AppIntro />
            </Route>
          </Switch>
        </StyledApp>
      </HashRouter>
    </ThemeProvider>
  );
};
export default App;
