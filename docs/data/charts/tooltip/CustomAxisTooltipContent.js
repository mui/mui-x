import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltipContainer } from '@mui/x-charts/ChartsTooltip';
import { CustomAxisTooltip } from './CustomAxisTooltip';
import { dataset, valueFormatter } from '../dataset/weather';

export default function CustomAxisTooltipContent() {
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
        <ChartsTooltipContainer trigger="axis">
          <CustomAxisTooltip />
        </ChartsTooltipContainer>
      </ChartContainer>
    </div>
  );
}
