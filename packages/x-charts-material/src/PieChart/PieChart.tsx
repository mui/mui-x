import * as React from 'react';
import { type PieChartProps } from '@mui/x-charts';
import { PieChart as PieChartBase } from '@mui/x-charts-headless';
import { styled } from '@mui/material/styles';
import { ChartsSurface } from '../ChartsSurface/ChartsSurface';
import { ChartsTooltip } from '../ChartsTooltip';

const Arc = styled(PieChartBase.Arc)(({ theme }) => ({
  stroke: theme.palette.background.paper,
  strokeWidth: 2,
}));

const ArcLabel = styled(PieChartBase.ArcLabel)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.pxToRem(20),
  fontWeight: theme.typography.fontWeightMedium,
}));

export const PieChart = React.forwardRef(function PieChart(
  props: PieChartProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const { title, desc, sx, ...other } = props;

  return (
    <PieChartBase.Root {...other}>
      <ChartsSurface ref={ref} sx={sx}>
        <title>{title}</title>
        <desc>{desc}</desc>
        <PieChartBase.Plot>{(item, index) => <Arc key={index} {...item} />}</PieChartBase.Plot>
        <PieChartBase.LabelPlot>
          {(item, index) => <ArcLabel key={index} {...item} />}
        </PieChartBase.LabelPlot>
      </ChartsSurface>
      <ChartsTooltip trigger="item" />
    </PieChartBase.Root>
  );
});
