'use client';
import * as React from 'react';
import clsx from 'clsx';
import useSlotProps from '@mui/utils/useSlotProps';
import type {
  DefaultizedScatterSeriesType,
  ScatterItemIdentifier,
} from '../../models/seriesType/scatter';
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
import { selectorScatterSeriesRenderData } from './scatterRenderData.selectors';
import { useActivateChartItem } from '../../hooks/useActivateChartItem';

export interface ScatterAsyncBatchProps extends Pick<
  ScatterProps,
  'series' | 'colorGetter' | 'onItemClick' | 'slots' | 'slotProps' | 'classes'
> {
  series: DefaultizedScatterSeriesType;
  colorGetter: ColorGetter<'scatter'>;
  /** First `dataIndex` this batch renders. */
  start: number;
  /** Stride between rendered `dataIndex`es, so the batch is a uniform sample. */
  step: number;
  /**
   * Whether this batch may render its markers yet. Ramped batch by batch across
   * frames for the progressive paint. When `false` the `<g>` mounts empty.
   */
  revealed: boolean;
  /**
   * Whether a zoom/pan interaction is in progress. While interacting, per-marker
   * highlight state and interaction handlers are skipped: useless mid-drag and
   * the dominant per-frame cost.
   */
  isInteracting?: boolean;
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
    step,
    revealed,
    isInteracting,
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
  const activateItem = useActivateChartItem();
  const shouldAttachMarkerClick = !isVoronoiEnabled || onItemClick !== undefined;

  const handleMarkerClick = (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    dataIndex: number,
  ) => {
    const item: ScatterItemIdentifier = {
      type: 'scatter',
      seriesId: series.id,
      dataIndex,
    };

    if (!isVoronoiEnabled) {
      activateItem(item);
    }

    onItemClick?.(event, item);
  };

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

  const { coords, count } = renderData;

  const markers: React.ReactNode[] = [];
  const safeStep = Math.max(1, step);
  for (let dataIndex = start; dataIndex < count; dataIndex += safeStep) {
    // Skip off-screen points (kept in-array to keep batches stable across pan).
    if (coords[dataIndex * 3 + 2] === 0) {
      continue;
    }
    const x = coords[dataIndex * 3];
    const y = coords[dataIndex * 3 + 1];

    const dataPoint = { x, y, dataIndex, seriesId: series.id, type: 'scatter' as const };
    const highlightState = isInteracting ? 'none' : getHighlightState(dataPoint);
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
          shouldAttachMarkerClick
            ? (event) => handleMarkerClick(event, dataIndex)
            : undefined
        }
        data-highlighted={isItemHighlighted || undefined}
        data-faded={isItemFaded || undefined}
        {...(skipInteractionHandlers || isInteracting
          ? undefined
          : getInteractionItemProps(instance, dataPoint))}
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

// Memoized so a reveal tick only re-renders the batch whose `revealed` changed.
const ScatterAsyncBatch = React.memo(ScatterAsyncBatchComponent);

export { ScatterAsyncBatch };
