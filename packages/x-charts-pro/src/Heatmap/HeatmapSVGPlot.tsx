'use client';
import * as React from 'react';
import { useXScale, useYScale, useZColorScale } from '@mui/x-charts/hooks';
import {
  selectorChartsIsFadedCallback,
  selectorChartsIsHighlightedCallback,
  useStore,
  useRegisterPointerInteractions,
  type HighlightCreator,
} from '@mui/x-charts/internals';
import { useHeatmapSeriesContext } from '../hooks';
import { HeatmapItem } from './HeatmapItem';
import { selectorHeatmapItemAtPosition } from '../plugins/selectors/useChartHeatmapPosition.selectors';
import { shouldRegisterPointerInteractionsGlobally } from './shouldRegisterPointerInteractionsGlobally';
import { type HeatmapRendererPlotProps } from './Heatmap.types';
import { type HighlightItemIdentifier } from '../models';

const MemoHeatmapItem = React.memo(HeatmapItem);

export function HeatmapSVGPlot(props: HeatmapRendererPlotProps) {
  const store = useStore();
  const xScale = useXScale<'band'>();
  const yScale = useYScale<'band'>();
  const colorScale = useZColorScale()!;
  const series = useHeatmapSeriesContext();

  const isHighlighted: ReturnType<HighlightCreator<'heatmap'>> = store.use(
    selectorChartsIsHighlightedCallback,
  );

  const isFaded: ReturnType<HighlightCreator<'heatmap'>> = store.use(selectorChartsIsFadedCallback);

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
      <g>
        {seriesToDisplay.data.map(([xIndex, yIndex, value], dataIndex) => {
          const x = xScale(xDomain[xIndex]);
          const y = yScale(yDomain[yIndex]);
          const color = colorScale?.(value);

          if (x === undefined || y === undefined || !color) {
            return null;
          }

          const item: HighlightItemIdentifier<'heatmap'> = {
            type: 'heatmap',
            seriesId: seriesToDisplay.id,
            xIndex,
            yIndex,
          };

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
              dataIndex={dataIndex}
              seriesId={series.seriesOrder[0]}
              value={value}
              slots={props.slots}
              slotProps={props.slotProps}
              isHighlighted={isHighlighted(item)}
              isFaded={isFaded(item)}
              borderRadius={props.borderRadius}
            />
          );
        })}
      </g>
    </React.Fragment>
  );
}

function RegisterHeatmapPointerInteractions() {
  useRegisterPointerInteractions(selectorHeatmapItemAtPosition);
  return null;
}
