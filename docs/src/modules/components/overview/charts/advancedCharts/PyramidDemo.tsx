import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import ChartDemoWrapper from '../ChartDemoWrapper';
import { overviewChartPalette } from '../theme/colors';

const data = [
  { label: 'Qualified leads', value: 420 },
  { label: 'Opportunities', value: 860 },
  { label: 'Accounts reached', value: 1400 },
  { label: 'Audience', value: 2400 },
];

function Pyramid() {
  return (
    <Stack sx={{ height: '100%' }}>
      <Typography align="center">Pipeline audience pyramid</Typography>
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <FunnelChart
          colors={overviewChartPalette}
          series={[
            {
              curve: 'pyramid',
              data,
              valueFormatter: ({ value }) => value.toLocaleString('en-US'),
            },
          ]}
          gap={4}
          margin={{ top: 16, right: 24, bottom: 16, left: 24 }}
          slotProps={{ tooltip: { disablePortal: true } }}
        />
      </div>
    </Stack>
  );
}

export default function PyramidDemo() {
  return (
    <ChartDemoWrapper link="/x/react-charts/pyramid/">
      <Pyramid />
    </ChartDemoWrapper>
  );
}
