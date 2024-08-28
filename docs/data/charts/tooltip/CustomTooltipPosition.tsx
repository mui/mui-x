import * as React from 'react';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ItemTooltip } from './ItemTooltip';

export default function CustomTooltipPosition() {
  const id = React.useId();
  const clipPathId = `${id}-clip-path`;
  return (
    <ResponsiveChartContainer
      height={300}
      series={[{ type: 'bar', data: [5, 15, null, 50, 10] }]}
      xAxis={[
        { scaleType: 'band', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
      ]}
    >
      <g clipPath={`url(#${clipPathId})`}>
        <BarPlot />
      </g>
      <ChartsXAxis />
      <ChartsYAxis />

      <ItemTooltip />
      <ChartsClipPath id={clipPathId} />
    </ResponsiveChartContainer>
  );
}
