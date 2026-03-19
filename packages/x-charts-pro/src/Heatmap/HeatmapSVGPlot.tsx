'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { useXScale, useYScale, useZColorScale } from '@mui/x-charts/hooks';
import {
  selectorChartsHighlightStateCallback,
  useStore,
  useRegisterPointerInteractions,
} from '@mui/x-charts/internals';
import { useHeatmapSeriesContext } from '../hooks';
import { HeatmapItem } from './HeatmapItem';
import { selectorHeatmapItemAtPosition } from '../plugins/selectors/useChartHeatmapPosition.selectors';
import { shouldRegisterPointerInteractionsGlobally } from './shouldRegisterPointerInteractionsGlobally';
import { type HeatmapRendererPlotProps } from './Heatmap.types';
import { type HighlightItemIdentifierWithType } from '../models';
import { heatmapClasses } from './heatmapClasses';

const MemoHeatmapItem = React.memo(HeatmapItem);

const HeatmapPlotRoot = styled('g', {
  name: 'MuiHeatmapPlot',
  slot: 'Root',
})();

export function HeatmapSVGPlot(props: HeatmapRendererPlotProps) {
  const store = useStore();
  const xScale = useXScale<'band'>();
  const yScale = useYScale<'band'>();
  const colorScale = useZColorScale()!;
  const series = useHeatmapSeriesContext();

  const getHighlightState = store.use(selectorChartsHighlightStateCallback);

  const xDomain = xScale.domain();
  const yDomain = yScale.domain();

  if (!series || series.seriesOrder.length === 0) {
    return null;
  }
  const seriesToDisplay = series.series[series.seriesOrder[0]];

  return (
    <React.Fragment>
      {shouldRegisterPointerInteractionsGlobally(props.slots, props.slotProps) ? (
        <RegisterHeatmapPointerInteractions />
      ) : null}
      <HeatmapPlotRoot
        className={clsx(heatmapClasses.root, props.className)}
        data-series={seriesToDisplay.id}
      >
        {seriesToDisplay.data.map(([xIndex, yIndex, value]) => {
          const x = xScale(xDomain[xIndex]);
          const y = yScale(yDomain[yIndex]);
          const color = colorScale?.(value);

          if (x === undefined || y === undefined || !color) {
            return null;
          }

          const item: HighlightItemIdentifierWithType<'heatmap'> = {
            type: 'heatmap',
            seriesId: seriesToDisplay.id,
            xIndex,
            yIndex,
          };
          const highlightState = getHighlightState(item);

          return (
            <MemoHeatmapItem
              key={`${xIndex}_${yIndex}`}
              width={xScale.bandwidth()}
              height={yScale.bandwidth()}
              x={x}
              y={y}
              xIndex={xIndex}
              yIndex={yIndex}
              color={color}
              seriesId={series.seriesOrder[0]}
              value={value}
              slots={props.slots}
              slotProps={props.slotProps}
              isHighlighted={highlightState === 'highlighted'}
              isFaded={highlightState === 'faded'}
              borderRadius={props.borderRadius}
            />
          );
        })}
      </HeatmapPlotRoot>
    </React.Fragment>
  );
}

function RegisterHeatmapPointerInteractions() {
  useRegisterPointerInteractions(selectorHeatmapItemAtPosition);
  return null;
}
