import * as React from 'react';
import { PieChartProps } from '@mui/x-charts';
import { PieChart as PieChartBase } from 'packages/x-charts-headless/src';
import { ChartsSurface } from '../ChartsSurface/ChartsSurface';
import { ChartsTooltip } from '../ChartsTooltip';
import { FakeCss } from '../FakeCss';

export const PieChart = React.forwardRef(function PieChart(
  props: PieChartProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const { title, desc, sx, ...other } = props;

  return (
    <PieChartBase.Root {...other}>
      <FakeCss>
        <ChartsSurface ref={ref} title={title} desc={desc} sx={sx}>
          <PieChartBase.Plot />
          <PieChartBase.LabelPlot />
        </ChartsSurface>
        <ChartsTooltip trigger="item" />
      </FakeCss>
    </PieChartBase.Root>
  );
});
