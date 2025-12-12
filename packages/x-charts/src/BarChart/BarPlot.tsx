'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { barElementClasses } from './barElementClasses';
import { type BarElementSlotProps, type BarElementSlots } from './BarElement';
import { type BarItemIdentifier } from '../models';
import { useDrawingArea, useXAxes, useYAxes } from '../hooks';
import { type BarLabelSlotProps, type BarLabelSlots } from './BarLabel/BarLabelItem';
import { BarLabelPlot } from './BarLabel/BarLabelPlot';
import { useSkipAnimation } from '../hooks/useSkipAnimation';
import { useInternalIsZoomInteracting } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting';
import { useBarPlotData } from './useBarPlotData';
import { useUtilityClasses } from './barClasses';
import type { BarItem, BarLabelContext } from './BarLabel';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from '../internals/animation/animation';
import { IndividualBarPlot } from './IndividualBarPlot';
import { BatchBarPlot } from './BatchBarPlot';
import { type RendererType } from '../ScatterChart';

export interface BarPlotSlots extends BarElementSlots, BarLabelSlots {}

export interface BarPlotSlotProps extends BarElementSlotProps, BarLabelSlotProps {}

export interface BarPlotProps {
  /**
   * If `true`, animations are skipped.
   * @default undefined
   */
  skipAnimation?: boolean;
  /**
   * Callback fired when a bar item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {BarItemIdentifier} barItemIdentifier The bar item identifier.
   */
  onItemClick?(
    event: React.MouseEvent<SVGElement, MouseEvent>,
    barItemIdentifier: BarItemIdentifier,
  ): void;
  /**
   * Defines the border radius of the bar element.
   */
  borderRadius?: number;
  /**
   * @deprecated Use `barLabel` in the chart series instead.
   * If provided, the function will be used to format the label of the bar.
   * It can be set to 'value' to display the current value.
   * @param {BarItem} item The item to format.
   * @param {BarLabelContext} context data about the bar.
   * @returns {string} The formatted label.
   */
  barLabel?: 'value' | ((item: BarItem, context: BarLabelContext) => string | null | undefined);
  /**
   * The type of renderer to use for the bar plot.
   * - `svg-single`: Renders every bar in a `<rect />` element.
   * - `svg-batch`: Batch renders bars in `<path />` elements for better performance with large datasets, at the cost of some limitations.
   *                Read more: https://mui.com/x/react-charts/bars/#performance
   *
   * @default 'svg-single'
   */
  renderer?: RendererType;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BarPlotSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BarPlotSlots;
}

const BarPlotRoot = styled('g', {
  name: 'MuiBarPlot',
  slot: 'Root',
})({
  [`& .${barElementClasses.root}`]: {
    transitionProperty: 'opacity, fill',
    transitionDuration: `${ANIMATION_DURATION_MS}ms`,
    transitionTimingFunction: ANIMATION_TIMING_FUNCTION,
  },
});

/**
 * Demos:
 *
 * - [Bars](https://mui.com/x/react-charts/bars/)
 * - [Bar demonstration](https://mui.com/x/react-charts/bar-demo/)
 * - [Stacking](https://mui.com/x/react-charts/stacking/)
 *
 * API:
 *
 * - [BarPlot API](https://mui.com/x/api/charts/bar-plot/)
 */
function BarPlot(props: BarPlotProps): React.JSX.Element {
  const {
    skipAnimation: inSkipAnimation,
    onItemClick,
    borderRadius,
    barLabel,
    renderer,
    ...other
  } = props;
  const isZoomInteracting = useInternalIsZoomInteracting();
  const skipAnimation = useSkipAnimation(isZoomInteracting || inSkipAnimation);
  const batchSkipAnimation = useSkipAnimation(inSkipAnimation);
  const { xAxis: xAxes } = useXAxes();
  const { yAxis: yAxes } = useYAxes();
  const { completedData, masksData } = useBarPlotData(useDrawingArea(), xAxes, yAxes);

  const classes = useUtilityClasses();

  const BarElementPlot = renderer === 'svg-batch' ? BatchBarPlot : IndividualBarPlot;

  return (
    <BarPlotRoot className={classes.root}>
      <BarElementPlot
        completedData={completedData}
        masksData={masksData}
        /* The batch renderer doesn't animate bars after the initial mount. Providing skipAnimation was causing an issue
         * where bars would animate again after a zoom interaction because skipAnimation would change from true to false. */
        skipAnimation={renderer === 'svg-batch' ? batchSkipAnimation : skipAnimation}
        onItemClick={
          /* `onItemClick` accepts a `MouseEvent` when the renderer is "svg-batch" and a `React.MouseEvent` otherwise,
           * so we need this cast to prevent TypeScript from complaining. */
          onItemClick as (
            event: MouseEvent | React.MouseEvent<SVGElement, MouseEvent>,
            barItemIdentifier: BarItemIdentifier,
          ) => void
        }
        borderRadius={borderRadius}
        {...other}
      />
      {completedData.map((processedSeries) => (
        <BarLabelPlot
          key={processedSeries.seriesId}
          className={classes.seriesLabels}
          processedSeries={processedSeries}
          skipAnimation={skipAnimation}
          barLabel={barLabel}
          {...other}
        />
      ))}
    </BarPlotRoot>
  );
}

BarPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * @deprecated Use `barLabel` in the chart series instead.
   * If provided, the function will be used to format the label of the bar.
   * It can be set to 'value' to display the current value.
   * @param {BarItem} item The item to format.
   * @param {BarLabelContext} context data about the bar.
   * @returns {string} The formatted label.
   */
  barLabel: PropTypes.oneOfType([PropTypes.oneOf(['value']), PropTypes.func]),
  /**
   * Defines the border radius of the bar element.
   */
  borderRadius: PropTypes.number,
  /**
   * Callback fired when a bar item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {BarItemIdentifier} barItemIdentifier The bar item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * The type of renderer to use for the bar plot.
   * - `svg-single`: Renders every bar in a `<rect />` element.
   * - `svg-batch`: Batch renders bars in `<path />` elements for better performance with large datasets, at the cost of some limitations.
   *                Read more: https://mui.com/x/react-charts/bars/#performance
   *
   * @default 'svg-single'
   */
  renderer: PropTypes.oneOf(['svg-batch', 'svg-single']),
  /**
   * If `true`, animations are skipped.
   * @default undefined
   */
  skipAnimation: PropTypes.bool,
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

export { BarPlot };
