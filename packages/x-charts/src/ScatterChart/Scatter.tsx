'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import { useStore } from '@mui/x-internals/store';
import { ScatterMarkerSlotProps, ScatterMarkerSlots } from './ScatterMarker.types';
import { DefaultizedScatterSeriesType, ScatterItemIdentifier } from '../models/seriesType/scatter';
import { getInteractionItemProps } from '../hooks/useInteractionItemProps';
import { useChartStore } from '../internals/store/useChartStore';

import { D3Scale } from '../models/axis';
import { useItemHighlightedGetter } from '../hooks/useItemHighlightedGetter';
import {
  selectorChartsIsVoronoiEnabled,
  UseChartClosestPointSignature,
} from '../internals/plugins/featurePlugins/useChartClosestPoint';
import { ScatterMarker } from './ScatterMarker';
import { ColorGetter } from '../internals/plugins/models/seriesConfig';
import { ScatterClasses, useUtilityClasses } from './scatterClasses';
import { useScatterPlotData } from './useScatterPlotData';
import { useChartContext } from '../context/ChartProvider';
import { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { useIsItemFocusedGetter } from '../hooks/useIsItemFocusedGetter';

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
  const store = useChartStore<[UseChartClosestPointSignature]>();
  const isVoronoiEnabled = useStore(store, selectorChartsIsVoronoiEnabled);

  const skipInteractionHandlers = isVoronoiEnabled || series.disableHover;
  const { isFaded, isHighlighted } = useItemHighlightedGetter();
  const isFocused = useIsItemFocusedGetter();

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
