'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import { ScatterMarkerSlotProps, ScatterMarkerSlots } from './ScatterMarker.types';
import { DefaultizedScatterSeriesType, ScatterItemIdentifier } from '../models/seriesType/scatter';
import { getInteractionItemProps } from '../hooks/useInteractionItemProps';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import { D3Scale } from '../models/axis';
import { useItemHighlightedGetter } from '../hooks/useItemHighlightedGetter';
import {
  selectorChartsVoronoiIsVoronoiEnabled,
  UseChartVoronoiSignature,
} from '../internals/plugins/featurePlugins/useChartVoronoi';
import { ScatterMarker } from './ScatterMarker';
import { ColorGetter } from '../internals/plugins/models/seriesConfig';
import { ScatterClasses, useUtilityClasses } from './scatterClasses';
import { useScatterPlotData } from './useScatterPlotData';
import { useChartContext } from '../context/ChartProvider';
import { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';

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
  const store = useStore<[UseChartVoronoiSignature]>();
  const isVoronoiEnabled = useSelector(store, selectorChartsVoronoiIsVoronoiEnabled);

  const skipInteractionHandlers = isVoronoiEnabled || series.disableHover;
  const { isFaded, isHighlighted } = useItemHighlightedGetter();

  const scatterPlotData = useScatterPlotData(series, xScale, yScale, instance.isPointInside);

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

  const children = React.useMemo(
    () =>
      scatterPlotData.map((dataPoint, i) => {
        const isItemHighlighted = isHighlighted(dataPoint);
        const isItemFaded = !isItemHighlighted && isFaded(dataPoint);

        return (
          <Marker
            key={dataPoint.id ?? dataPoint.dataIndex}
            dataIndex={dataPoint.dataIndex}
            color={colorGetter ? colorGetter(i) : color}
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
            {...(skipInteractionHandlers
              ? undefined
              : getInteractionItemProps(instance, dataPoint))}
            {...markerProps}
          />
        );
      }),
    [
      Marker,
      color,
      colorGetter,
      instance,
      isFaded,
      isHighlighted,
      markerProps,
      onItemClick,
      scatterPlotData,
      series.id,
      skipInteractionHandlers,
    ],
  );

  return (
    <g data-series={series.id} className={classes.root}>
      {children}
    </g>
  );
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
