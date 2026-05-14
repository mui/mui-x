import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AxisValueFormatterContext } from '@mui/x-charts/models';
import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';
import { temperatureBerlinPorto } from 'docs/data/charts/dataset/temperatureBerlinPorto';
import ChartDemoWrapper from '../ChartDemoWrapper';
import { overviewChartPalette } from '../theme/colors';
import SourceCaption from './SourceCaption';

function RangeBar() {
  return (
    <Stack sx={{ height: '100%' }}>
      <Typography align="center">Average monthly temperature ranges</Typography>
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <BarChartPremium
          colors={overviewChartPalette}
          xAxis={[
            {
              data: temperatureBerlinPorto.months,
              valueFormatter: (value: string, context: AxisValueFormatterContext) =>
                context.location === 'tick' ? value.slice(0, 3) : value,
            },
          ]}
          yAxis={[{ width: 42, valueFormatter: (value: number) => `${value}°C` }]}
          series={[
            {
              id: 'porto',
              type: 'rangeBar',
              label: 'Porto',
              data: temperatureBerlinPorto.porto,
              valueFormatter: (value) => (value === null ? null : `${value[0]}°C - ${value[1]}°C`),
            },
            {
              id: 'berlin',
              type: 'rangeBar',
              label: 'Berlin',
              data: temperatureBerlinPorto.berlin,
              valueFormatter: (value) => (value === null ? null : `${value[0]}°C - ${value[1]}°C`),
            },
          ]}
          grid={{ horizontal: true }}
          margin={{ top: 16, right: 8, bottom: 20, left: 0 }}
          slotProps={{ tooltip: { disablePortal: true } }}
        />
      </div>
      <SourceCaption>Data from IPMA and climate-data.org</SourceCaption>
    </Stack>
  );
}

export default function RangeBarDemo() {
  return (
    <ChartDemoWrapper link="/x/react-charts/range-bar/">
      <RangeBar />
    </ChartDemoWrapper>
  );
}
