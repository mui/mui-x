import * as React from 'react';

import { useXScale, useYScale, useZColorScale } from '@mui/x-charts';
import { useHeatmapSeries } from '../hooks/useSeries';

export function HeatmapPlot() {
  const xScale = useXScale<'band'>();
  const yScale = useYScale<'band'>();
  const colorScale = useZColorScale()!;
  const series = useHeatmapSeries();

  const xDomain = xScale.domain();
  const yDomain = yScale.domain();

  if (!series || series.seriesOrder.length === 0) {
    return null;
  }
  const seriesToDisplay = series.series[series.seriesOrder[0]];

  return (
    <g>
      {seriesToDisplay.data.map(([xIndex, yIndex, value]) => {
        return (
          <rect
            key={`${xIndex}_${yIndex}`}
            width={xScale.bandwidth()}
            height={yScale.bandwidth()}
            x={xScale(xDomain[xIndex])}
            y={yScale(yDomain[yIndex])}
            fill={colorScale?.(value) ?? undefined}
          />
        );
      })}
    </g>
  );
}
