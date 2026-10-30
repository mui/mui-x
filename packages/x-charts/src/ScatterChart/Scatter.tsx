'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useSlotProps from '@mui/utils/useSlotProps';
import type { ScatterMarkerSlotProps, ScatterMarkerSlots } from './ScatterMarker.types';
import type {
  DefaultizedScatterSeriesType,
  ScatterItemIdentifier,
} from '../models/seriesType/scatter';
import { getInteractionItemProps } from '../hooks/useInteractionItemProps';
import { useStore } from '../internals/store/useStore';
import type { D3Scale } from '../models/axis';
import { useItemHighlightStateGetter } from '../hooks/useItemHighlightStateGetter';
import { selectorChartsIsVoronoiEnabled } from '../internals/plugins/featurePlugins/useChartClosestPoint';
import type { UseChartClosestPointSignature } from '../internals/plugins/featurePlugins/useChartClosestPoint';
import { ScatterMarker } from './ScatterMarker';
import type { ColorGetter } from '../internals/plugins/corePlugins/useChartSeriesConfig';
import type { ScatterSizeGetter } from './seriesConfig/getMarkerSize';
import { useUtilityClasses } from './scatterClasses';
import type { ScatterClasses } from './scatterClasses';
import { useRegisterItemActivation } from '../internals/useRegisterItemActivation';
import type { ChartsActivationEvent } from '../models/events';
import { useScatterPlotData } from './useScatterPlotData';
import { useChartsContext } from '../context/ChartsProvider';
import type { UseChartTooltipSignature } from '../internals/plugins/featurePlugins/useChartTooltip';
import type { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import type { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';

/**
 * @deprecated The `Scatter` component is an internal implementation detail of `ScatterPlot` and will be removed from the public API in v10. Use `ScatterPlot` instead.
 */
export interface ScatterProps {
  /**
   * The scatter series to render.
   */
  series: DefaultizedScatterSeriesType;
  /**
   * The scale of the x-axis.
   */
  xScale: D3Scale;
  /**
   * The scale of the y-axis.
   */
  yScale: D3Scale;
  /**
   * The color of the element.
   */
  color: string;
  /**
   * Function to get the color of a scatter item given its data index.
   * The data index argument is optional. If not provided, the color for the entire series is returned.
   * If provided, the color for the specific scatter item is returned.
   */
  colorGetter: ColorGetter<'scatter'>;
  /**
   * Function to get the marker size of a scatter item given its data index.
   */
  sizeGetter: ScatterSizeGetter;
  /**
   * Callback fired when clicking on a scatter item.
   * @param {ChartsActivationEvent<SVGElement>} event Event recorded on the `<svg/>` element.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  onItemClick?: (
    event: ChartsActivationEvent<SVGElement>,
    scatterItemIdentifier: ScatterItemIdentifier,
  ) => void;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ScatterClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ScatterSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ScatterSlotProps;
}

/**
 * @deprecated The `Scatter` component is an internal implementation detail of `ScatterPlot` and will be removed from the public API in v10. Use `ScatterPlot` instead.
 */
export interface ScatterSlots extends ScatterMarkerSlots {}

/**
 * @deprecated The `Scatter` component is an internal implementation detail of `ScatterPlot` and will be removed from the public API in v10. Use `ScatterPlot` instead.
 */
export interface ScatterSlotProps extends ScatterMarkerSlotProps {}

/**
 * @deprecated The `Scatter` component is an internal implementation detail of `ScatterPlot` and will be removed from the public API in v10. Use `ScatterPlot` instead.
 *
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
    colorGetter,
    sizeGetter,
    onItemClick,
    classes: inClasses,
    slots,
    slotProps,
  } = props;

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

  const scatterPlotData = useScatterPlotData(series, xScale, yScale, instance.isPointInside);

  const Marker = slots?.marker ?? ScatterMarker;
  const { ownerState, ...markerProps } = useSlotProps({
    elementType: Marker,
    externalSlotProps: slotProps?.marker,
    additionalProps: {
      seriesId: series.id,
    },
    ownerState: {},
  });

  const classes = useUtilityClasses({ classes: inClasses });

  useRegisterItemActivation(
    { type: 'scatter', seriesId: series.id },
    onItemClick &&
      ((event, item) =>
        onItemClick(event, {
          type: 'scatter',
          seriesId: series.id,
          dataIndex: item.dataIndex,
        })),
  );

  return (
    <g data-series={series.id} className={classes.series}>
      {scatterPlotData.map((dataPoint) => {
        const highlightState = getHighlightState(dataPoint);
        const isItemHighlighted = highlightState === 'highlighted';
        const isItemFaded = highlightState === 'faded';

        return (
          <Marker
            key={dataPoint.id ?? dataPoint.dataIndex}
            className={clsx(classes.marker, markerProps.className)}
            dataIndex={dataPoint.dataIndex}
            color={colorGetter(dataPoint.dataIndex)}
            size={sizeGetter(dataPoint.dataIndex)}
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
      })}
    </g>
  );
}

Scatter.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The color of the element.
   */
  color: PropTypes.string.isRequired,
  /**
   * Function to get the color of a scatter item given its data index.
   * The data index argument is optional. If not provided, the color for the entire series is returned.
   * If provided, the color for the specific scatter item is returned.
   */
  colorGetter: PropTypes.func.isRequired,
  /**
   * Callback fired when clicking on a scatter item.
   * @param {ChartsActivationEvent<SVGElement>} event Event recorded on the `<svg/>` element.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * The scatter series to render.
   */
  series: PropTypes.object.isRequired,
  /**
   * Function to get the marker size of a scatter item given its data index.
   */
  sizeGetter: PropTypes.func.isRequired,
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
  /**
   * The scale of the x-axis.
   */
  xScale: PropTypes.func.isRequired,
  /**
   * The scale of the y-axis.
   */
  yScale: PropTypes.func.isRequired,
} as any;

export { Scatter };
