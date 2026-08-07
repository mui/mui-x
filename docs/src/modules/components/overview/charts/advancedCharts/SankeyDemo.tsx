import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import ChartDemoWrapper from '../ChartDemoWrapper';
import { overviewChartPalette } from '../theme/colors';

const data = {
  links: [
    { source: 'Visitors', target: 'Product pages', value: 100 },
    { source: 'Visitors', target: 'Docs', value: 46 },
    { source: 'Product pages', target: 'Trial', value: 38 },
    { source: 'Docs', target: 'Trial', value: 18 },
    { source: 'Trial', target: 'Active teams', value: 24 },
    { source: 'Trial', target: 'Lost', value: 32 },
    { source: 'Active teams', target: 'Expansion', value: 9 },
  ],
};

const valueFormatter = (value: number) => `${value}k`;

function Sankey() {
  return (
    <Stack sx={{ height: '100%' }}>
      <Typography align="center">Product adoption flow</Typography>
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <SankeyChart
          colors={overviewChartPalette}
          series={{
            data,
            valueFormatter,
            nodeOptions: {
              padding: 18,
              width: 8,
              showLabels: true,
            },
            linkOptions: {
              color: 'source',
              opacity: 0.45,
            },
          }}
          margin={{ top: 24, right: 96, bottom: 24, left: 8 }}
          slotProps={{ tooltip: { disablePortal: true } }}
        />
      </div>
    </Stack>
  );
}

export default function SankeyDemo() {
  return (
    <ChartDemoWrapper link="/x/react-charts/sankey/">
      <Sankey />
    </ChartDemoWrapper>
  );
}
