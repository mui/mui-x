import { ScatterChart, ScatterSeries } from '@mui/x-charts/ScatterChart';
import { ChartsTooltipContainer, useItemTooltip } from '@mui/x-charts/ChartsTooltip';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import data from 'docsx/data/charts/dataset/transistorCPUdata';
import ChartDemoWrapper from '../ChartDemoWrapper';

const chartSetting = {
  yAxis: [{ width: 50, scaleType: 'log' as const }],
  xAxis: [{ valueFormatter: (v: number | null) => (v ? v.toString() : '') }],
};

const constructors = ['Intel', 'Apple', 'AMD'];

const series = [
  {
    type: 'scatter',
    label: 'Other',
    highlightScope: { highlight: 'item', fade: 'global' },
    markerSize: 3,
    data: data
      .filter((item) => !constructors.includes(item.constructor) && item.density !== null)
      .map((item) => ({ x: item.year, y: item.density as number, id: item.id })),
  },
  ...constructors.map(
    (constructor): ScatterSeries => ({
      label: constructor,
      highlightScope: { highlight: 'item', fade: 'global' },
      markerSize: 3,
      data: data
        .filter((item) => item.constructor === constructor && item.density !== null)
        .map((item) => ({ x: item.year, y: item.density as number, id: item.id })),
    }),
  ),
] satisfies ScatterSeries[];

const numberFormatter = new Intl.NumberFormat('en-US').format;

const TooltipPaper = styled('div', {
  name: 'Tooltip',
  slot: 'Paper',
})(({ theme }) => {
  return {
    padding: theme.spacing(1),
    backgroundColor: (theme.vars || theme).palette.background.paper,
    color: (theme.vars || theme).palette.text.primary,
    borderRadius: (theme.vars || theme).shape?.borderRadius,
    border: `solid ${(theme.vars || theme).palette.divider} 1px`,
  };
});

function CustomTooltip() {
  const item = useItemTooltip<'scatter'>();

  return (
    <ChartsTooltipContainer trigger="item">
      <TooltipPaper>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Box
            sx={{ width: 20, height: 20, backgroundColor: item?.color, borderRadius: 1, mr: 2 }}
          />
          <Typography>{item?.label}</Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 3 }}>{item?.value.x}</Typography>
          <Typography>
            {item?.value.y == null ? 'NaN' : `${numberFormatter(item?.value.y)} transistor/mm²`}
          </Typography>
        </Box>
      </TooltipPaper>
    </ChartsTooltipContainer>
  );
}

function Scatter() {
  return (
    <Stack height="100%">
      <Typography align="center">Processor density (in transistor/mm²)</Typography>
      <ScatterChart
        series={series}
        grid={{ horizontal: true, vertical: true }}
        voronoiMaxRadius={20}
        slots={{ tooltip: CustomTooltip }}
        {...chartSetting}
      />
    </Stack>
  );
}

export default function ScatterChartDemo() {
  return (
    <ChartDemoWrapper link="/x/react-charts/scatter/">
      <Scatter />
    </ChartDemoWrapper>
  );
}
