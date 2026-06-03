'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { ScatterPlot, type ScatterPlotProps } from '@mui/x-charts/ScatterChart';
import { ScatterWebGLPlot } from './webgl/ScatterWebGLPlot';

export interface ScatterPlotPremiumProps extends Omit<ScatterPlotProps, 'renderer'> {
  /**
   * The type of renderer to use for the scatter plot.
   * - `svg-single`: Renders every scatter item in its own `<circle />` element.
   * - `svg-batch`: Renders all scatter items in a single batched SVG path.
   * - `webgl`: Renders scatter items using WebGL for better performance, at the cost of some limitations.
   */
  renderer: 'svg-single' | 'svg-batch' | 'webgl';
}

function ScatterPlotPremium({ renderer, ...props }: ScatterPlotPremiumProps) {
  if (renderer === 'webgl') {
    return <ScatterWebGLPlot />;
  }

  return <ScatterPlot renderer={renderer} {...props} />;
}

ScatterPlotPremium.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Callback fired when clicking on a scatter item.
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
