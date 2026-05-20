'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { Scatter, type ScatterProps, type ScatterSlotProps, type ScatterSlots } from './Scatter';
import { useScatterSeriesContext } from '../hooks/useScatterSeries';
import { useXAxes, useYAxes } from '../hooks';
import { useZAxes } from '../hooks/useZAxis';
import { scatterSeriesConfig as scatterSeriesConfig } from './seriesConfig';
import { BatchScatter } from './BatchScatter';
import { ScatterAsync } from './async/ScatterAsync';
import { SCATTER_ASYNC_THRESHOLD } from './async/scatterRendererConstants';
import { useUtilityClasses } from './scatterClasses';
import { useChartsContext } from '../context/ChartsProvider';
import {
  type ProgressivePlanEntry,
  type UseProgressiveRenderingSignature,
} from '../internals/plugins/featurePlugins/useProgressiveRendering';

export interface ScatterPlotSlots extends ScatterSlots {
  scatter?: React.JSXElementConstructor<ScatterProps>;
}

export interface ScatterPlotSlotProps extends ScatterSlotProps {
  scatter?: Partial<ScatterProps>;
}

export type RendererType = 'svg-single' | 'svg-batch';

export interface ScatterPlotProps extends Pick<ScatterProps, 'onItemClick' | 'classes'> {
  className?: string;
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
   * When not set, the renderer is chosen automatically: `svg-progressive` above an internal point-count threshold, `svg-single` otherwise.
   * @default undefined (auto)
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

  // Register this plot's progressive rendering plan with the chart-wide
  // `useProgressiveRendering` plugin so the scheduler is shared across every
  // plot composed into the same chart.
  const { instance } = useChartsContext<[UseProgressiveRenderingSignature]>();
  const plotId = React.useId();

  const slotScatter = slots?.scatter;
  const progressivePlan = React.useMemo<ProgressivePlanEntry[]>(() => {
    if (seriesData === undefined) {
      return [];
    }
    const { series: s, seriesOrder: order } = seriesData;
    let total = 0;
    order.forEach((id) => {
      if (!s[id].hidden) {
        total += s[id].data.length;
      }
    });
    const usesAsync =
      slotScatter === undefined &&
      (renderer === 'svg-progressive' ||
        (renderer === undefined && total > SCATTER_ASYNC_THRESHOLD));
    if (!usesAsync) {
      return [];
    }
    const plan: ProgressivePlanEntry[] = [];
    order.forEach((id) => {
      if (!s[id].hidden) {
        plan.push({
          seriesId: id,
          nPoints: s[id].data.length,
          dataRef: s[id].data,
        });
      }
    });
    return plan;
  }, [seriesData, renderer, slotScatter]);

  React.useEffect(() => {
    if (progressivePlan.length === 0) {
      instance.clearProgressivePlan(plotId);
      return undefined;
    }
    instance.setProgressivePlan(plotId, progressivePlan);
    return () => instance.clearProgressivePlan(plotId);
  }, [instance, plotId, progressivePlan]);

  if (seriesData === undefined) {
    return null;
  }

  const { series, seriesOrder } = seriesData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];
  const defaultZAxisId = zAxisIds[0];

  // Renderer selection:
  // - `svg-batch`        → path-based batch renderer.
  // - `svg-single`       → force the original synchronous per-item renderer.
  // - `svg-progressive`  → force the progressive batched per-item renderer.
  // - undefined ("auto") → progressive above `SCATTER_ASYNC_THRESHOLD` total
  //                        points, original otherwise.
  const totalPointCount = seriesOrder.reduce(
    (sum, seriesId) => (series[seriesId].hidden ? sum : sum + series[seriesId].data.length),
    0,
  );

  let DefaultScatterItems: React.JSXElementConstructor<ScatterProps>;
  if (renderer === 'svg-batch') {
    DefaultScatterItems = BatchScatter;
  } else if (renderer === 'svg-single') {
    DefaultScatterItems = Scatter;
  } else if (renderer === 'svg-progressive') {
    DefaultScatterItems = ScatterAsync;
  } else {
    DefaultScatterItems = totalPointCount > SCATTER_ASYNC_THRESHOLD ? ScatterAsync : Scatter;
  }
  const ScatterItems = slots?.scatter ?? DefaultScatterItems;

  const items = seriesOrder.map((seriesId) => {
    const { id, xAxisId, yAxisId, zAxisId, color, hidden } = series[seriesId];

    if (hidden) {
      return null;
    }

    const colorGetter = scatterSeriesConfig.colorProcessor(
      series[seriesId],
      xAxis[xAxisId ?? defaultXAxisId],
      yAxis[yAxisId ?? defaultYAxisId],
      zAxis[zAxisId ?? defaultZAxisId],
    );
    const xScale = xAxis[xAxisId ?? defaultXAxisId].scale;
    const yScale = yAxis[yAxisId ?? defaultYAxisId].scale;
    return (
      <ScatterItems
        key={id}
        xScale={xScale}
        yScale={yScale}
        color={color}
        colorGetter={colorGetter}
        series={series[seriesId]}
        onItemClick={onItemClick}
        slots={slots}
        slotProps={slotProps}
        {...slotProps?.scatter}
      />
    );
  });

  return <ScatterPlotRoot className={clsx(classes.root, className)}>{items}</ScatterPlotRoot>;
}

ScatterPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when clicking on a scatter item.
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
   * When not set, the renderer is chosen automatically: `svg-progressive` above an internal point-count threshold, `svg-single` otherwise.
   * @default undefined (auto)
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
