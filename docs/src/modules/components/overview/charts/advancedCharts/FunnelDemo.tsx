import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import ChartDemoWrapper from '../ChartDemoWrapper';

// Data from https://ourworldindata.org/grapher/gender-gap-education-levels

const commonSeries = {
  curve: 'linear',
  variant: 'outlined',
  borderRadius: 0,
  valueFormatter: ({ value }: { value: number }) => `${value}%`,
} as const;

function Funnel() {
  return (
    <Stack height="100%">
      <Typography align="center" sx={{ width: '100%', mb: 1 }}>
        World education enrollment in 2000 and 2020
      </Typography>
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <FunnelChart
          sx={{ '.MuiFunnelSection-series-2020': { filter: 'brightness(0.7)' } }}
          margin={{ left: 50, right: 50 }}
          series={[
            {
              id: '2020',
              data: [
                {
                  label: (location) => (location === 'legend' ? 'Primary' : 'Primary (2020)'),
                  value: 90,
                },
                {
                  label: (location) =>
                    location === 'legend' ? 'Lower secondary' : 'Lower secondary (2020)',
                  value: 85,
                },
                {
                  label: (location) => (location === 'legend' ? 'Secondary' : 'Secondary (2020)'),
                  value: 67,
                },
                {
                  label: (location) => (location === 'legend' ? 'Tertiary' : 'Tertiary (2020)'),
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
                  label: (location) => (location === 'legend' ? undefined : 'Primary (2000)'),
                  value: 85,
                },
                {
                  label: (location) =>
                    location === 'legend' ? undefined : 'Lower secondary (2000)',
                  value: 74,
                },
                {
                  label: (location) => (location === 'legend' ? undefined : 'Secondary (2000)'),
                  value: 50,
                },
                {
                  label: (location) => (location === 'legend' ? undefined : 'Tertiary (2000)'),
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
  return (
    <ChartDemoWrapper link="/x/react-charts/funnel/">
      <Funnel />
    </ChartDemoWrapper>
  );
}
