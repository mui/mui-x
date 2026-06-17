'use client';
import * as React from 'react';
import clsx from 'clsx';
import useSlotProps from '@mui/utils/useSlotProps';
import type { DefaultizedScatterSeriesType } from '../../models/seriesType/scatter';
import { getInteractionItemProps } from '../../hooks/useInteractionItemProps';
import { useStore } from '../../internals/store/useStore';
import { useItemHighlightStateGetter } from '../../hooks/useItemHighlightStateGetter';
import { selectorChartsIsVoronoiEnabled } from '../../internals/plugins/featurePlugins/useChartClosestPoint';
import type { UseChartClosestPointSignature } from '../../internals/plugins/featurePlugins/useChartClosestPoint';
import { ScatterMarker } from '../ScatterMarker';
import type { ColorGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { useUtilityClasses } from '../scatterClasses';
import { useChartsContext } from '../../context/ChartsProvider';
import type { UseChartTooltipSignature } from '../../internals/plugins/featurePlugins/useChartTooltip';
import type { UseChartInteractionSignature } from '../../internals/plugins/featurePlugins/useChartInteraction';
import type { UseChartHighlightSignature } from '../../internals/plugins/featurePlugins/useChartHighlight';
import type { ScatterProps } from '../Scatter';
import {
  getScatterBatchView,
  selectorScatterSeriesRenderData,
} from './scatterRenderData.selectors';

export interface ScatterAsyncBatchProps extends Pick<
  ScatterProps,
  'series' | 'colorGetter' | 'onItemClick' | 'slots' | 'slotProps' | 'classes'
> {
  series: DefaultizedScatterSeriesType;
  colorGetter: ColorGetter<'scatter'>;
  /** First point index of this batch (inclusive). */
  start: number;
  /** Last point index of this batch (exclusive). */
  end: number;
  /**
   * Whether this batch is allowed to render its markers yet. `ScatterAsync`
   * ramps this up batch by batch across animation frames for a progressive
   * paint. When `false` the `<g>` still mounts but stays empty.
   */
  revealed: boolean;
}

/**
 * @ignore - internal component.
 */
function ScatterAsyncBatchComponent(props: ScatterAsyncBatchProps) {
  const {
    series,
    colorGetter,
    onItemClick,
    slots,
    slotProps,
    start,
    end,
    revealed,
    classes: inClasses,
  } = props;

  const classes = useUtilityClasses({ classes: inClasses });

  const { instance } =
    useChartsContext<
      [
        UseChartInteractionSignature,
        UseChartHighlightSignature<'scatter'>,
        UseChartTooltipSignature,
      ]
    >();
  const store = useStore<[UseChartClosestPointSignature]>();
  const isVoronoiEnabled = store.use(selectorChartsIsVoronoiEnabled);
  const skipInteractionHandlers = isVoronoiEnabled;
  const getHighlightState = useItemHighlightStateGetter();

  const renderData = store.use(selectorScatterSeriesRenderData, series.id);

  const Marker = slots?.marker ?? ScatterMarker;
  const { ownerState, ...markerProps } = useSlotProps({
    elementType: Marker,
    externalSlotProps: slotProps?.marker,
    additionalProps: {
      seriesId: series.id,
      size: series.markerSize,
    },
    ownerState: {},
  });

  if (renderData === undefined || !revealed) {
    return <g data-series={series.id} className={classes.series} />;
  }

  const view = getScatterBatchView(renderData, start, end);

  const markers: React.ReactNode[] = [];
  const nLocal = view.length / 3;
  for (let local = 0; local < nLocal; local += 1) {
    const x = view[local * 3];
    const y = view[local * 3 + 1];
    const dataIndex = view[local * 3 + 2];

    const dataPoint = { x, y, dataIndex, seriesId: series.id, type: 'scatter' as const };
    const highlightState = getHighlightState(dataPoint);
    const isItemHighlighted = highlightState === 'highlighted';
    const isItemFaded = highlightState === 'faded';

    markers.push(
      <Marker
        key={dataIndex}
        className={clsx(classes.marker, markerProps.className)}
        dataIndex={dataIndex}
        color={colorGetter(dataIndex)}
        isHighlighted={isItemHighlighted}
        isFaded={isItemFaded}
        x={x}
        y={y}
        onClick={
          onItemClick &&
          ((event: React.MouseEvent<SVGElement, MouseEvent>) =>
            onItemClick(event, {
              type: 'scatter',
              seriesId: series.id,
              dataIndex,
            }))
        }
        data-highlighted={isItemHighlighted || undefined}
        data-faded={isItemFaded || undefined}
        {...(skipInteractionHandlers ? undefined : getInteractionItemProps(instance, dataPoint))}
        {...markerProps}
      />,
    );
  }

  return (
    <g data-series={series.id} className={classes.series}>
      {markers}
    </g>
  );
}

// Memoized so a reveal tick (which re-renders every `ScatterAsync`) only
// re-renders the one batch whose `revealed` prop changed.
const ScatterAsyncBatch = React.memo(ScatterAsyncBatchComponent);

export { ScatterAsyncBatch };
