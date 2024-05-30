import * as React from 'react';
import '@mui/x-charts-pro/typeOverloads';
import { ChartsAxis } from '@mui/x-charts/ChartsAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import {
  UnstableHeatmapContainer,
  UnstableHeatmapPlot,
} from '@mui/x-charts-pro/Heatmap';

export default function BasicHeatmap() {
  return (
    <UnstableHeatmapContainer
      height={400}
      width={600}
      xAxis={[{ scaleType: 'band', data: [1, 2, 3, 4, 5] }]}
      yAxis={[
        { scaleType: 'band', data: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] },
      ]}
      zAxis={[
        {
          id: 'color-map-id',
          colorMap: {
            type: 'continuous',
            min: -2,
            max: 4,
            color: ['green', 'orange'],
          },
        },
      ]}
      series={[
        {
          type: 'heatmap',
          data: [
            [0, 0, 1],
            [0, 1, 2],
            [0, 2, 3],
            [0, 3, 4],
            [0, 4, 1],
            [0, 5, 2],
            [0, 6, 3],
            [1, 0, 4],
            [1, 1, 1],
            [1, 2, 2],
            [1, 3, 3],
            [1, 4, 4],
            [1, 5, 1],
            [1, 6, 2],
            [2, 0, 3],
            [2, 1, 4],
            [2, 2, 1],
            [2, 3, 2],
            [2, 4, 3],
            [2, 5, 4],
            [2, 6, 1],
            [3, 0, 2],
            [3, 1, 3],
            [3, 2, 4],
            [3, 3, 1],
            [3, 4, 2],
            [3, 5, 3],
            [3, 6, 4],
            [4, 0, 1],
            [4, 1, 2],
            [4, 2, 3],
            [4, 3, 1],
            [4, 4, 2],
            [4, 5, 3],
            [4, 6, 4],
          ],
        },
      ]}
    >
      <ChartsAxis />
      <UnstableHeatmapPlot />
      <ChartsTooltip
      // trigger="item"
      //   {...tooltip} slots={slots} slotProps={slotProps}
      />
    </UnstableHeatmapContainer>
  );
}
