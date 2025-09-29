'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import { ScatterMarkerSlotProps, ScatterMarkerSlots } from './ScatterMarker.types';
import {
  DefaultizedScatterSeriesType,
  ScatterItemIdentifier,
  ScatterValueType,
} from '../models/seriesType/scatter';
import { getInteractionItemProps } from '../hooks/useInteractionItemProps';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import { D3Scale } from '../models/axis';
import { useItemHighlightedGetter } from '../hooks/useItemHighlightedGetter';
import {
  selectorChartsIsVoronoiEnabled,
  UseChartClosestPointSignature,
} from '../internals/plugins/featurePlugins/useChartClosestPoint';
import { ScatterMarker } from './ScatterMarker';
import { ColorGetter } from '../internals/plugins/models/seriesConfig';
import { ScatterClasses, useUtilityClasses } from './scatterClasses';
import { useChartContext } from '../context/ChartProvider';
import { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { useIsItemFocusedGetter } from '../hooks/useIsItemFocusedGetter';
import { SeriesId } from '../models/seriesType/common';
import { selectorChartAxisZoomData, selectorChartSeriesFlatbush } from '../internals';

export interface ScatterProps {
  series: DefaultizedScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  color: string;
  colorGetter?: ColorGetter<'scatter'>;
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    scatterItemIdentifier: ScatterItemIdentifier,
  ) => void;
  classes?: Partial<ScatterClasses>;
  slots?: ScatterSlots;
  slotProps?: ScatterSlotProps;
}

export interface ScatterSlots extends ScatterMarkerSlots {}

export interface ScatterSlotProps extends ScatterMarkerSlotProps {}

/**
 * Demos:
 *
 * - [Scatter](https://mui.com/x/react-charts/scatter/)
 * - [Scatter demonstration](https://mui.com/x/react-charts/scatter-demo/)
 *
 * API:
 *
 * - [Scatter API](https://mui.com/x/api/charts/scatter/)
 */
function Scatter(props: ScatterProps) {
  const {
    series,
    xScale,
    yScale,
    color,
    colorGetter,
    onItemClick,
    classes: inClasses,
    slots,
    slotProps,
  } = props;

  const { instance } =
    useChartContext<[UseChartInteractionSignature, UseChartHighlightSignature]>();
  const store = useStore<[UseChartClosestPointSignature]>();
  const isVoronoiEnabled = useSelector(store, selectorChartsIsVoronoiEnabled);

  const skipInteractionHandlers = isVoronoiEnabled || series.disableHover;
  const { isFaded, isHighlighted } = useItemHighlightedGetter();
  const isFocused = useIsItemFocusedGetter();

  const scatterPlotData = useScatterPlotData(series, xScale, yScale);

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

  const classes = useUtilityClasses(inClasses);

  return (
    <g data-series={series.id} className={classes.root}>
      {scatterPlotData.map((dataPoint) => {
        const isItemHighlighted = isHighlighted(dataPoint);
        const isItemFaded = !isItemHighlighted && isFaded(dataPoint);
        const isItemFocused = isFocused({
          seriesType: 'scatter',
          seriesId: series.id,
          dataIndex: dataPoint.dataIndex,
        });
        return (
          <Marker
            key={dataPoint.id ?? dataPoint.dataIndex}
            dataIndex={dataPoint.dataIndex}
            color={colorGetter ? colorGetter(dataPoint.dataIndex) : color}
            isHighlighted={isItemHighlighted}
            isFaded={isItemFaded}
            x={dataPoint.x}
            y={dataPoint.y}
            onClick={
              onItemClick &&
              ((event) =>
                onItemClick(event, {
                  type: 'scatter',
                  seriesId: series.id,
                  dataIndex: dataPoint.dataIndex,
                }))
            }
            data-highlighted={isItemHighlighted || undefined}
            data-faded={isItemFaded || undefined}
            data-focused={isItemFocused || undefined}
            {...(skipInteractionHandlers
              ? undefined
              : getInteractionItemProps(instance, dataPoint))}
            {...markerProps}
          />
        );
      })}
    </g>
  );
}

function useScatterPlotData(
  series: DefaultizedScatterSeriesType,
  xScale: D3Scale,
  yScale: D3Scale,
) {
  const { store } = useChartContext<[UseChartInteractionSignature, UseChartHighlightSignature]>();
  const flatbush = useSelector(store, selectorChartSeriesFlatbush, [series.id]);
  const xAxisZoom = useSelector(store, selectorChartAxisZoomData, [
    series.xAxisId ?? 'defaultized-x-axis-0',
  ]);
  const yAxisZoom = useSelector(store, selectorChartAxisZoomData, [
    series.yAxisId ?? 'defaultized-y-axis-0',
  ]);
  const xZoomStart = (xAxisZoom?.start ?? 0) / 100;
  const xZoomEnd = (xAxisZoom?.end ?? 100) / 100;
  const yZoomStart = (yAxisZoom?.start ?? 0) / 100;
  const yZoomEnd = (yAxisZoom?.end ?? 100) / 100;
  const fx = xScale.range()[1] - xScale.range()[0];
  const fy = yScale.range()[1] - yScale.range()[0];
  const xMin = xScale.range()[0];
  const yMin = yScale.range()[0];

  return React.useMemo(() => {
    const points = flatbush?.search(xZoomStart, yZoomStart, xZoomEnd, yZoomEnd) ?? [];

    const temp: (ScatterValueType & {
      dataIndex: number;
      seriesId: SeriesId;
      type: 'scatter';
    })[] = [];

    for (let i = 0; i < points.length; i += 3) {
      const index = points[i];
      const x = xMin + fx * points[i + 1];
      const y = yMin + fy * points[i + 2];

      temp.push({
        x,
        y,
        id: series.data[index].id,
        seriesId: series.id,
        type: 'scatter',
        dataIndex: index,
      });
    }

    return temp;
  }, [
    flatbush,
    xZoomStart,
    yZoomStart,
    xZoomEnd,
    yZoomEnd,
    xMin,
    fx,
    yMin,
    fy,
    series.data,
    series.id,
  ]);
}

Scatter.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  color: PropTypes.string.isRequired,
  colorGetter: PropTypes.func,
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  onItemClick: PropTypes.func,
  series: PropTypes.object.isRequired,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
} as any;

export { Scatter };
