'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useXScale, useYScale, useZColorScale } from '@mui/x-charts/hooks';
import {
  type HighlightItemData,
  selectorChartsIsFadedCallback,
  selectorChartsIsHighlightedCallback,
  useStore,
} from '@mui/x-charts/internals';
import { useRegisterPointerInteractions } from '@mui/x-charts/internals';
import { useHeatmapSeriesContext } from '../hooks/useHeatmapSeries';
import { HeatmapItem, type HeatmapItemProps } from './HeatmapItem';
import { selectorHeatmapItemAtPosition } from '../plugins/selectors/useChartHeatmapPosition.selectors';
import { shouldRegisterPointerInteractionsGlobally } from './shouldRegisterPointerInteractionsGlobally';

export interface HeatmapPlotProps extends Pick<HeatmapItemProps, 'slots' | 'slotProps'> {}

const MemoHeatmapItem = React.memo(HeatmapItem);

function HeatmapPlot(props: HeatmapPlotProps) {
  const store = useStore();
  const xScale = useXScale<'band'>();
  const yScale = useYScale<'band'>();
  const colorScale = useZColorScale()!;
  const series = useHeatmapSeriesContext();

  const isHighlighted = store.use(selectorChartsIsHighlightedCallback);
  const isFaded = store.use(selectorChartsIsFadedCallback);

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

          const item: HighlightItemData = {
            seriesId: seriesToDisplay.id,
            dataIndex,
          };

          return (
            <MemoHeatmapItem
              key={`${xIndex}_${yIndex}`}
              width={xScale.bandwidth()}
              height={yScale.bandwidth()}
              x={x}
              y={y}
              color={color}
              dataIndex={dataIndex}
              seriesId={series.seriesOrder[0]}
              value={value}
              slots={props.slots}
              slotProps={props.slotProps}
              isHighlighted={isHighlighted(item)}
              isFaded={isFaded(item)}
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

HeatmapPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { HeatmapPlot };
