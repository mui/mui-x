import * as React from 'react';
import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import Paper from '@mui/material/Paper';

const settings = {
  height: 100,
  yAxis: { min: 0, max: 20 },
};

const values = [0, 2, 3, 4, 6, 8, 7, 9, 15, 6, 8, 7, 12];

export default function ColorCustomizationMode() {
  return (
    <DarkModeWrapper>
      <SparkLineChart
        data={values}
        color={(mode) => (mode === 'light' ? 'black' : 'white')}
        {...settings}
      />
    </DarkModeWrapper>
  );
}

function DarkModeWrapper(props) {
  const theme = useTheme();
  const [colorMode, setColorMode] = React.useState(theme.palette.mode);

  const newTheme = createTheme({ palette: { mode: colorMode } });
  return (
    <ThemeProvider theme={newTheme}>
      <Stack>
        <Button
          onClick={() =>
            setColorMode((prev) => (prev === 'light' ? 'dark' : 'light'))
          }
          color="inherit"
          endIcon={colorMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        >
          {colorMode} mode
        </Button>
        <Paper sx={{ p: 2, width: '100%', maxWidth: 300 }}>{props.children}</Paper>
      </Stack>
    </ThemeProvider>
  );
}
