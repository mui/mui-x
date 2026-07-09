'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import type { WithDataAttributes } from '@mui/x-internals/types';
import { Scatter } from './Scatter';
import type { ScatterProps, ScatterSlotProps, ScatterSlots } from './Scatter';
import { useScatterSeriesContext } from '../hooks/useScatterSeries';
import { useXAxes, useYAxes } from '../hooks';
import { useZAxes } from '../hooks/useZAxis';
import { scatterSeriesConfig } from './seriesConfig';
import getMarkerSize from './seriesConfig/getMarkerSize';
import { BatchScatter } from './BatchScatter';
import { ScatterAsync } from './async/ScatterAsync';
import { useUtilityClasses } from './scatterClasses';
import { useChartsContext } from '../context/ChartsProvider';
import { useStore } from '../internals/store/useStore';
import { selectorShouldUseProgressiveRenderer } from '../internals/plugins/featurePlugins/useProgressiveRendering';
import type { UseProgressiveRenderingSignature } from '../internals/plugins/featurePlugins/useProgressiveRendering';
import type { SeriesId } from '../models/seriesType/common';
import type { ScatterPropsOverrides } from '../models/chartsSlotsComponentsProps';

const EMPTY_SERIES_IDS: readonly SeriesId[] = [];

export interface ScatterPlotSlots extends ScatterSlots {
  scatter?: React.JSXElementConstructor<ScatterProps & ScatterPropsOverrides>;
}

export interface ScatterPlotSlotProps extends ScatterSlotProps {
  scatter?: WithDataAttributes<Partial<ScatterProps> & ScatterPropsOverrides>;
}

export type RendererType = 'svg-single' | 'svg-batch';

export interface ScatterPlotProps extends Pick<ScatterProps, 'classes'> {
  className?: string;
  /**
   * Callback fired when a marker is clicked directly.
   * For closest-point clicks (the `ScatterChart` default), pass `onItemClick` to the chart container instead.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  onItemClick?: ScatterProps['onItemClick'];
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ScatterPlotSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ScatterPlotSlotProps;
  /**
   * The type of renderer to use for the scatter plot.
   * - `svg-single`: Renders every scatter item in a `<circle />` element, synchronously.
   * - `svg-progressive`: Renders every scatter item in a `<circle />` element, in progressive batches that paint over several animation frames to keep the main thread responsive.
   * - `svg-batch`: Batch renders scatter items in `<path />` elements for better performance with large datasets, at the cost of some limitations.
   *                Read more: https://mui.com/x/react-charts/scatter/#performance
   *
   * When not set, defaults to `svg-single`. Enable the `progressiveRendering` experimental feature to auto-select `svg-progressive` above an internal point-count threshold; this will become the default in the next major version.
   * @default 'svg-single'
   */
  renderer?: RendererType | 'svg-progressive';
}

const ScatterPlotRoot = styled('g', {
  name: 'MuiScatterPlot',
  slot: 'Root',
})();

/**
 * Demos:
 *
 * - [Scatter](https://mui.com/x/react-charts/scatter/)
 * - [Scatter demonstration](https://mui.com/x/react-charts/scatter-demo/)
 *
 * API:
 *
 * - [ScatterPlot API](https://mui.com/x/api/charts/scatter-plot/)
 */
function ScatterPlot(props: ScatterPlotProps) {
  const { slots, slotProps, onItemClick, renderer, className, classes: inClasses } = props;
  const seriesData = useScatterSeriesContext();
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();
  const { zAxis, zAxisIds } = useZAxes();
  const classes = useUtilityClasses({ classes: inClasses });

  const { instance } = useChartsContext<[UseProgressiveRenderingSignature]>();
  const store = useStore<[UseProgressiveRenderingSignature]>();
  const plotId = React.useId();
  const seriesIds = seriesData?.seriesOrder ?? EMPTY_SERIES_IDS;
  const isProgressive = store.use(selectorShouldUseProgressiveRenderer, seriesIds, renderer);
  React.useEffect(
    () => instance.registerProgressivePlan(plotId, seriesIds, renderer),
    [instance, plotId, seriesIds, renderer],
  );

  if (seriesData === undefined) {
    return null;
  }

  const { series, seriesOrder } = seriesData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];
  const defaultZAxisId = zAxisIds[0];

  let DefaultScatterItems: React.JSXElementConstructor<ScatterProps>;
  if (renderer === 'svg-batch') {
    DefaultScatterItems = BatchScatter;
  } else if (isProgressive) {
    DefaultScatterItems = ScatterAsync;
  } else {
    DefaultScatterItems = Scatter;
  }
  const ScatterItems = slots?.scatter ?? DefaultScatterItems;

  return (
    <ScatterPlotRoot className={clsx(classes.root, className)}>
      {seriesOrder.map((seriesId) => {
        const { id, xAxisId, yAxisId, colorAxisId, zAxisId, sizeAxisId, color, hidden } =
          series[seriesId];

        if (hidden) {
          return null;
        }

        const colorGetter = scatterSeriesConfig.colorProcessor(
          series[seriesId],
          xAxis[xAxisId ?? defaultXAxisId],
          yAxis[yAxisId ?? defaultYAxisId],
          zAxis[colorAxisId ?? zAxisId ?? defaultZAxisId],
        );
        const sizeGetter = getMarkerSize(series[seriesId], zAxis[sizeAxisId ?? defaultZAxisId]);
        const xScale = xAxis[xAxisId ?? defaultXAxisId].scale;
        const yScale = yAxis[yAxisId ?? defaultYAxisId].scale;
        return (
          <ScatterItems
            key={id}
            xScale={xScale}
            yScale={yScale}
            color={color}
            colorGetter={colorGetter}
            sizeGetter={sizeGetter}
            series={series[seriesId]}
            onItemClick={onItemClick}
            slots={slots}
            slotProps={slotProps}
            {...slotProps?.scatter}
          />
        );
      })}
    </ScatterPlotRoot>
  );
}

ScatterPlot.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Callback fired when a marker is clicked directly.
   * For closest-point clicks (the `ScatterChart` default), pass `onItemClick` to the chart container instead.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * The type of renderer to use for the scatter plot.
   * - `svg-single`: Renders every scatter item in a `<circle />` element, synchronously.
   * - `svg-progressive`: Renders every scatter item in a `<circle />` element, in progressive batches that paint over several animation frames to keep the main thread responsive.
   * - `svg-batch`: Batch renders scatter items in `<path />` elements for better performance with large datasets, at the cost of some limitations.
   *                Read more: https://mui.com/x/react-charts/scatter/#performance
   *
   * When not set, defaults to `svg-single`. Enable the `progressiveRendering` experimental feature to auto-select `svg-progressive` above an internal point-count threshold; this will become the default in the next major version.
   * @default 'svg-single'
   */
  renderer: PropTypes.oneOf(['svg-batch', 'svg-progressive', 'svg-single']),
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

export { ScatterPlot };
