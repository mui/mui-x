'use client';
import * as React from 'react';
import {
  ChartsTooltipPaper,
  ChartsTooltipTable,
  ChartsTooltipRow,
  ChartsTooltipCell,
  ChartsTooltipMark,
  useItemTooltip,
} from '@mui/x-charts/ChartsTooltip';
import { useXAxis, useYAxis } from '@mui/x-charts/hooks';
import { getLabel } from '@mui/x-charts/internals';
import { useHeatmapSeries } from '../hooks/useSeries';

function DefaultHeatmapTooltipContent() {
  const xAxis = useXAxis();
  const yAxis = useYAxis();
  const heatmapSeries = useHeatmapSeries();

  const tooltipData = useItemTooltip<'heatmap'>();

  if (!tooltipData || !heatmapSeries || heatmapSeries.seriesOrder.length === 0) {
    return null;
  }

  const { series, seriesOrder } = heatmapSeries;
  const seriesId = seriesOrder[0];

  const { color, value, identifier } = tooltipData;

  const [xIndex, yIndex] = value;

  const formattedX =
    xAxis.valueFormatter?.(xAxis.data![xIndex], { location: 'tooltip' }) ??
    xAxis.data![xIndex].toLocaleString();
  const formattedY =
    yAxis.valueFormatter?.(yAxis.data![yIndex], { location: 'tooltip' }) ??
    yAxis.data![yIndex].toLocaleString();
  const formattedValue = series[seriesId].valueFormatter(value, {
    dataIndex: identifier.dataIndex,
  });

  const seriesLabel = getLabel(series[seriesId].label, 'tooltip');

  return (
    <ChartsTooltipPaper>
      <ChartsTooltipTable>
        <thead>
          <ChartsTooltipRow>
            <ChartsTooltipCell>{formattedX}</ChartsTooltipCell>
            {formattedX && formattedY && <ChartsTooltipCell />}
            <ChartsTooltipCell>{formattedY}</ChartsTooltipCell>
          </ChartsTooltipRow>
        </thead>
        <tbody>
          <ChartsTooltipRow>
            <ChartsTooltipCell>
              <ChartsTooltipMark color={color} />
            </ChartsTooltipCell>
            <ChartsTooltipCell>{seriesLabel}</ChartsTooltipCell>
            <ChartsTooltipCell>{formattedValue}</ChartsTooltipCell>
          </ChartsTooltipRow>
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}

export { DefaultHeatmapTooltipContent };
