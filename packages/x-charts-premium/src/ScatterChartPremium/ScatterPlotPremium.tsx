'use client';
import * as React from 'react';
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

export function ScatterPlotPremium({ renderer, ...props }: ScatterPlotPremiumProps) {
  if (renderer === 'webgl') {
    return <ScatterWebGLPlot />;
  }

  return <ScatterPlot renderer={renderer} {...props} />;
}
