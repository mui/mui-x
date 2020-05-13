import React, { useCallback, useReducer } from 'react';
import { DemoAppBar } from './app-bar';
import { SplitterDemo } from './demos/splitter/splitter-demo';
import './app.less';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { AppDrawer } from './app-drawer';
import { appReducer } from './app-reducer';
import { ThemeProvider, useTheme } from './demos/theme';
import { CommodityGridDemo } from './demos/grid/commodity-grid.demo';
import { DevToggle } from './demos/utils/devToggle';
import {AppIntro} from "./app-intro";
import {isIntroPage} from "./utils";

export const App: React.FC<{}> = () => {
  const [state, dispatch] = useReducer(appReducer, { isOpen: false });
  const toggleDrawer = useCallback(() => dispatch({ type: state.isOpen ? 'close-drawer' : 'open-drawer' }), [
    state,
    dispatch,
  ]);

  const [theme, themeId, toggleTheme, isDark] = useTheme();

  return (
    <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
      <HashRouter>
        <div className="app">
          <DemoAppBar onMenuButtonClick={toggleDrawer} onThemeToggle={toggleTheme} isDark={isDark} />
          <AppDrawer isOpen={state.isOpen} toggleDrawer={toggleDrawer} />
          <Switch>
            <Route path="/grid">
              <CommodityGridDemo />
            </Route>
            <Route path="/">
              <AppIntro />
            </Route>
          </Switch>
        </div>
      </HashRouter>
    </ThemeProvider>
  );
};
/*
           <DevToggle>
              <Route path="/splitter">
                <SplitterDemo />
              </Route>
            </DevToggle>

* */
export default App;
