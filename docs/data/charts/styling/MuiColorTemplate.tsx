import * as React from 'react';
import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Chance } from 'chance';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { ScatterValueType } from '@mui/x-charts/models';
import {
  blueberryTwilightPalette,
  mangoFusionPalette,
  cheerfulFiestaPalette,
} from '@mui/x-charts/colorPalettes';

const chance = new Chance(42);

function getGaussianSeriesData(
  mean: [number, number],
  stdev: [number, number] = [0.3, 0.4],
  N: number = 50,
) {
  return [...Array(N)].map((_, i) => {
    const x =
      Math.sqrt(-2.0 * Math.log(1 - chance.floating({ min: 0, max: 0.99 }))) *
        Math.cos(2.0 * Math.PI * chance.floating({ min: 0, max: 0.99 })) *
        stdev[0] +
      mean[0];
    const y =
      Math.sqrt(-2.0 * Math.log(1 - chance.floating({ min: 0, max: 0.99 }))) *
        Math.cos(2.0 * Math.PI * chance.floating({ min: 0, max: 0.99 })) *
        stdev[1] +
      mean[1];
    return { x, y, id: i };
  });
}

const legendPlacement = {
  slotProps: {
    legend: {
      position: {
        vertical: 'middle',
        horizontal: 'right',
      },
      direction: 'column',
      itemGap: 2,
    },
  },
  margin: {
    top: 20,
    right: 100,
  },
} as const;

const series = [
  { label: 'Series 1', data: getGaussianSeriesData([-5, 0]) },
  { label: 'Series 2', data: getGaussianSeriesData([-4, 0]) },
  { label: 'Series 3', data: getGaussianSeriesData([-3, 0]) },
  { label: 'Series 4', data: getGaussianSeriesData([-2, 0]) },
  { label: 'Series 5', data: getGaussianSeriesData([-1, 0]) },
  { label: 'Series 6', data: getGaussianSeriesData([0, 0]) },
  { label: 'Series 7', data: getGaussianSeriesData([1, 0]) },
  { label: 'Series 8', data: getGaussianSeriesData([2, 0]) },
  { label: 'Series 9', data: getGaussianSeriesData([3, 0]) },
  { label: 'Series 10', data: getGaussianSeriesData([4, 0]) },
  { label: 'Series 11', data: getGaussianSeriesData([5, 0]) },
  { label: 'Series 12', data: getGaussianSeriesData([6, 0]) },
  { label: 'Series 13', data: getGaussianSeriesData([7, 0]) },
].map((s) => ({
  ...s,
  valueFormatter: (v: ScatterValueType) => `(${v.x.toFixed(1)}, ${v.y.toFixed(1)})`,
}));

const categories = {
  blueberryTwilight: blueberryTwilightPalette,
  mangoFusion: mangoFusionPalette,
  cheerfulFiesta: cheerfulFiestaPalette,
} as const;

type PaletteKey = keyof typeof categories;

export default function MuiColorTemplate() {
  const theme = useTheme();
  const [colorScheme, setColorScheme] =
    React.useState<PaletteKey>('blueberryTwilight');
  const [colorMode, setColorMode] = React.useState(theme.palette.mode);

  const newTheme = createTheme({ palette: { mode: colorMode } });
  return (
    <ThemeProvider theme={newTheme}>
      <Paper sx={{ width: '100%', p: 2 }} elevation={0}>
        <Stack direction="column" spacing={2}>
          <ScatterChart
            height={400}
            series={series}
            yAxis={[{ min: -1.5, max: 1.5 }]}
            colors={categories[colorScheme]}
            {...legendPlacement}
          />
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="space-evenly"
          >
            <div>
              <Button
                sx={{ ml: 1 }}
                onClick={() =>
                  setColorMode((prev) => (prev === 'light' ? 'dark' : 'light'))
                }
                color="inherit"
                endIcon={
                  colorMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />
                }
              >
                {colorMode} mode
              </Button>
            </div>
            <TextField
              select
              sx={{ maxWidth: 1 }}
              value={colorScheme}
              onChange={(event) => setColorScheme(event.target.value as PaletteKey)}
            >
              {Object.entries(categories).map(([name, colors]) => (
                <MenuItem key={name} value={name}>
                  <Stack direction="row" alignItems="center">
                    <Typography sx={{ mr: 2 }}>{name}</Typography>
                    <div style={{ width: 200, height: 20 }}>
                      {colors(colorMode).map((c) => (
                        <div
                          key={c}
                          style={{
                            width: 20,
                            height: 20,
                            backgroundColor: c,
                            display: 'inline-block',
                          }}
                        />
                      ))}
                    </div>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>
      </Paper>
    </ThemeProvider>
  );
}
