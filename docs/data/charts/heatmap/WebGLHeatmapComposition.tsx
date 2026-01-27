import * as React from 'react';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { HeatmapValueType } from '@mui/x-charts-pro/models';
import { HeatmapPlotPremium } from '@mui/x-charts-premium/HeatmapPremium';
import { ChartsSurface, ChartsWrapper, useChartTooltip } from '@mui/x-charts';
import {
  useChartCartesianAxis,
  useChartHighlight,
  useChartInteraction,
  useChartZAxis,
} from '@mui/x-charts/plugins';
import { ChartDataProviderPremium } from '@mui/x-charts-premium/ChartDataProviderPremium';
import { useChartProExport, useChartProZoom } from '@mui/x-charts-pro';
import {
  useChartBrush,
  useChartItemClick,
  useChartKeyboardNavigation,
} from '@mui/x-charts/internals';
import { interpolateOrRd } from 'd3-scale-chromatic';

const data: HeatmapValueType[] = [
  [0, 0, 10],
  [0, 1, 20],
  [0, 2, 40],
  [0, 3, 90],
  [0, 4, 70],
  [1, 0, 30],
  [1, 1, 50],
  [1, 2, 10],
  [1, 3, 70],
  [1, 4, 40],
  [2, 0, 50],
  [2, 1, 20],
  [2, 2, 90],
  [2, 3, 20],
  [2, 4, 70],
  [3, 0, 40],
  [3, 1, 50],
  [3, 2, 20],
  [3, 3, 70],
  [3, 4, 90],
];

export default function WebGLHeatmapComposition() {
  return (
    <ChartDataProviderPremium
      series={[{ type: 'heatmap', data }]}
      xAxis={[
        {
          data: [1, 2, 3, 4],
          scaleType: 'band',
          id: 'x-axis-id',
          categoryGapRatio: 0,
        },
      ]}
      yAxis={[
        {
          data: ['A', 'B', 'C', 'D', 'E'],
          scaleType: 'band',
          id: 'y-axis-id',
          categoryGapRatio: 0,
        },
      ]}
      zAxis={[
        {
          min: 0,
          max: 100,
          colorMap: {
            type: 'continuous',
            color: interpolateOrRd,
            max: 100,
          },
        },
      ]}
      height={400}
    >
      <ChartsWrapper>
        <ChartsSurface>
          <HeatmapPlotPremium renderer="webgl" />
          <ChartsXAxis label="X axis" axisId="x-axis-id" />
          <ChartsYAxis label="Y axis" axisId="y-axis-id" />
        </ChartsSurface>
      </ChartsWrapper>
    </ChartDataProviderPremium>
  );
}
