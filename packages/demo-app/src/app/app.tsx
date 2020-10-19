import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import './app.less';
import { DemoAppBar } from './app-bar';
import { AppDrawer } from './app-drawer';
import { appReducer } from './app-reducer';
import { ThemeProvider, useTheme } from './demos/theme';
import { RealDataGridDemo } from './demos/grid/real-data-grid.demo';
import { AppIntro } from './app-intro';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: 'source-code-pro', 'Menlo', 'Monaco', 'Consolas', 'Courier New', monospace;
  }

  #root {
    min-width: 100%;
    min-height: 100%;
    display: flex;
    position: absolute;
  }

  .app {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .main-container {
    position: relative;
    flex-grow: 1;
    box-sizing: border-box;
  }

  .fill-space,
  .fill-abs,
  .fill {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .grow {
    flex-grow: 1;
  }

  .center {
    justify-content: center;
  }

  .action-bar {
    display: flex;
    justify-content: center;

    button {
      margin-right: 20px;
    }
  }

  .storybook-img {
    width: 30px;
  }

  @media screen and (max-width: 768px) {
    .big-device {
      display: none !important;
    }
  }

  .negative {
    color: #d20704;
  }

  .positive {
    color: #008508;
  }

  .info-icon {
    color: #2196f3;
    align-self: center;
  }

  .bad {
    background: rgba(255, 128, 171, 0.4);
  }

  .good {
    background: rgba(185, 246, 202, 0.4);
  }
`;

const StyledApp = styled.div`
  background: ${(p) => p.theme.colors.background};
`;

export function App() {
  const [state, dispatch] = React.useReducer(appReducer, { isOpen: false });
  const toggleDrawer = React.useCallback(
    () => dispatch({ type: state.isOpen ? 'close-drawer' : 'open-drawer' }),
    [state],
  );

  const { theme, themeId, toggleTheme, isDark } = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
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
