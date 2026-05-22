import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { buildTheme, type ThemeFlavor, type ThemeMode } from './theme';

function Root() {
  const [mode, setMode] = React.useState<ThemeMode>('light');
  const [flavor, setFlavor] = React.useState<ThemeFlavor>('plain');
  const theme = React.useMemo(() => buildTheme(mode, flavor), [mode, flavor]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <App mode={mode} flavor={flavor} onModeChange={setMode} onFlavorChange={setFlavor} />
      </HashRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
