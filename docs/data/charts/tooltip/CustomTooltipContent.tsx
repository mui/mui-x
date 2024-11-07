import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { CustomItemTooltip } from './CustomItemTooltip';
import { dataset, valueFormatter } from '../dataset/weather';

export default function CustomTooltipContent() {
  const id = React.useId();
  const clipPathId = `${id}-clip-path`;
  return (
    <div style={{ width: '100%' }}>
      <ChartContainer
        height={300}
        dataset={dataset}
        series={[
          { type: 'bar', dataKey: 'seoul', label: 'Seoul', valueFormatter },
          { type: 'bar', dataKey: 'paris', label: 'Paris', valueFormatter },
        ]}
        xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      >
        <ChartsClipPath id={clipPathId} />
        <g clipPath={`url(#${clipPathId})`}>
          <BarPlot />
        </g>
        <ChartsXAxis />
        <ChartsYAxis />

        <CustomItemTooltip />
      </ChartContainer>
    </div>
  );
}
