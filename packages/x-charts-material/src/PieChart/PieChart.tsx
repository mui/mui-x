import * as React from 'react';
import { type PieChartProps } from '@mui/x-charts';
import { PieChart as PieChartBase } from '@mui/x-charts-headless';
import { ChartsSurface } from '../ChartsSurface/ChartsSurface';
import { ChartsTooltip } from '../ChartsTooltip';

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
        <PieChartBase.Plot />
        <PieChartBase.LabelPlot />
      </ChartsSurface>
      <ChartsTooltip trigger="item" />
    </PieChartBase.Root>
  );
});
