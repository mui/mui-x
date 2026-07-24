'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { BarPlot } from '@mui/x-charts/BarChart';
import type { BarPlotProps, BarPlotSlotProps, BarPlotSlots } from '@mui/x-charts/BarChart';
import type { RendererType } from '@mui/x-charts/ScatterChart';
import { BarWebGLPlot } from './webgl/BarWebGLPlot';

export type BarPlotPremiumRenderer = RendererType | 'webgl';

export interface BarPlotPremiumSlots extends BarPlotSlots {}

export interface BarPlotPremiumSlotProps extends BarPlotSlotProps {}

export interface BarPlotPremiumProps extends Omit<
  BarPlotProps,
  'renderer' | 'slots' | 'slotProps'
> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BarPlotPremiumSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BarPlotPremiumSlotProps;
  /**
   * The type of renderer to use for the bar plot.
   * - `svg-single`: Renders every bar in a `<rect />` element.
   * - `svg-batch`: Batch renders bars in `<path />` elements for better performance with large datasets, at the cost of some limitations.
   * - `webgl`: Renders bars using WebGL for better performance with very large datasets, at the cost of some limitations.
   *                Read more: https://mui.com/x/react-charts/bars/#performance
   *
   * @default 'svg-single'
   */
  renderer?: BarPlotPremiumRenderer;
}

function BarPlotPremium({
  renderer,
  borderRadius,
  ...other
}: BarPlotPremiumProps): React.JSX.Element {
  if (renderer === 'webgl') {
    return <BarWebGLPlot borderRadius={borderRadius} />;
  }

  return <BarPlot renderer={renderer} borderRadius={borderRadius} {...other} />;
}

BarPlotPremium.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Defines the border radius of the bar element.
   */
  borderRadius: PropTypes.number,
  /**
   * A CSS class name applied to the root element.
   */
  className: PropTypes.string,
  /**
   * Callback fired when a bar item is clicked.
   * @param {MouseEvent} event The event source of the callback.
   * @param {BarItemIdentifier} barItemIdentifier The bar item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * The type of renderer to use for the bar plot.
   * - `svg-single`: Renders every bar in a `<rect />` element.
   * - `svg-batch`: Batch renders bars in `<path />` elements for better performance with large datasets, at the cost of some limitations.
   * - `webgl`: Renders bars using WebGL for better performance with very large datasets, at the cost of some limitations.
   *                Read more: https://mui.com/x/react-charts/bars/#performance
   *
   * @default 'svg-single'
   */
  renderer: PropTypes.oneOf(['svg-batch', 'svg-single', 'webgl']),
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

export { BarPlotPremium };
