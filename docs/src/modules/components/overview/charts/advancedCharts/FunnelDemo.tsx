/* eslint-disable material-ui/no-hardcoded-labels */
import * as React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import DemoWrapper from '../../DemoWrapper';

// Data from https://ourworldindata.org/grapher/gender-gap-education-levels

const commonSeries = {
  curve: 'linear',
  variant: 'outlined',
  borderRadius: 0,
  valueFormatter: ({ value }: { value: number }) => `${value}%`,
} as const;

function Funnel() {
  return (
    <Stack sx={{ height: '100%' }}>
      <Typography>World education enrollement in 2000 and 2020</Typography>
      <div style={{ flexGrow: 1 }}>
        <FunnelChart
          sx={{ '.MuiFunnelSection-series-2020': { filter: 'brightness(0.7)' } }}
          margin={{ left: 50, right: 50 }}
          series={[
            {
              id: '2020',
              data: [
                {
                  label: (location) => (location === 'legend' ? 'primary' : 'primary (2020)'),
                  value: 90,
                },
                {
                  label: (location) =>
                    location === 'legend' ? 'lower secondary' : 'lower secondary (2020)',
                  value: 85,
                },
                {
                  label: (location) => (location === 'legend' ? 'secondary' : 'secondary (2020)'),
                  value: 67,
                },
                {
                  label: (location) => (location === 'legend' ? 'tertiary' : 'tertiary (2020)'),
                  value: 40,
                },
              ],
              sectionLabel: {
                position: { horizontal: 'end' },
                textAnchor: 'start',
                offset: { x: 10 },
              },
              ...commonSeries,
            },
            {
              id: '2000',
              data: [
                {
                  label: (location) => (location === 'legend' ? undefined : 'primary (2000)'),
                  value: 85,
                },
                {
                  label: (location) =>
                    location === 'legend' ? undefined : 'lower secondary (2000)',
                  value: 74,
                },
                {
                  label: (location) => (location === 'legend' ? undefined : 'secondary (2000)'),
                  value: 50,
                },
                {
                  label: (location) => (location === 'legend' ? undefined : 'tertiary (2000)'),
                  value: 19,
                },
              ],
              ...commonSeries,
            },
          ]}
          gap={6}
          slotProps={{ tooltip: { disablePortal: true } }}
        />
      </div>
      <Typography variant="caption" textAlign="end">
        Data from{' '}
        <a href="https://ourworldindata.org/grapher/gender-gap-education-levels/">
          ourworldindata.org
        </a>
      </Typography>
    </Stack>
  );
}

export default function FunnelDemo() {
  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  return (
    <DemoWrapper link="/x/react-charts/pie/">
      <Stack spacing={1} sx={{ width: '100%', padding: 2 }} justifyContent="space-between">
        <Box
          sx={{
            height: 352,
            overflow: 'auto',
            minWidth: 260,
            padding: 2,
            width: '100%',
            alignSelf: 'center',
          }}
        >
          <ThemeProvider theme={theme}>
            <Funnel />
          </ThemeProvider>
        </Box>
      </Stack>
    </DemoWrapper>
  );
}
