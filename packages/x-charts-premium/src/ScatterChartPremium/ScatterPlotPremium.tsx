'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { ScatterPlot } from '@mui/x-charts/ScatterChart';
import type {
  RendererType,
  ScatterPlotProps,
  ScatterPlotSlots,
  ScatterPlotSlotProps,
} from '@mui/x-charts/ScatterChart';
import { ScatterWebGLPlot } from './webgl/ScatterWebGLPlot';

export interface ScatterPlotPremiumSlots extends ScatterPlotSlots {}

export interface ScatterPlotPremiumSlotProps extends ScatterPlotSlotProps {}

export interface ScatterPlotPremiumProps extends Omit<ScatterPlotProps, 'renderer'> {
  /**
   * The type of renderer to use for the scatter plot.
   * - `svg-single`: Renders every scatter item in its own `<circle />` element.
   * - `svg-batch`: Renders all scatter items in a single batched SVG path.
   * - `webgl`: Renders scatter items using WebGL for better performance, at the cost of some limitations.
   */
  renderer: RendererType | 'webgl';
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ScatterPlotPremiumSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ScatterPlotPremiumSlotProps;
}

function ScatterPlotPremium({ renderer, ...props }: ScatterPlotPremiumProps) {
  if (renderer === 'webgl') {
    return <ScatterWebGLPlot />;
  }

  return <ScatterPlot renderer={renderer} {...props} />;
}

ScatterPlotPremium.propTypes /* remove-proptypes */ = {
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
   * - `svg-single`: Renders every scatter item in its own `<circle />` element.
   * - `svg-batch`: Renders all scatter items in a single batched SVG path.
   * - `webgl`: Renders scatter items using WebGL for better performance, at the cost of some limitations.
   */
  renderer: PropTypes.oneOf(['svg-batch', 'svg-single', 'webgl']).isRequired,
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

export { ScatterPlotPremium };
