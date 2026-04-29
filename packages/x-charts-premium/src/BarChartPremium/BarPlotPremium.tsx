'use client';
import * as React from 'react';
import { BarPlot, type BarPlotProps } from '@mui/x-charts/BarChart';
import { BarWebGLPlot } from './webgl/BarWebGLPlot';

export type BarPlotPremiumRenderer = NonNullable<BarPlotProps['renderer']> | 'webgl';

export interface BarPlotPremiumProps extends Omit<BarPlotProps, 'renderer'> {
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

export function BarPlotPremium({
  renderer,
  borderRadius,
  ...other
}: BarPlotPremiumProps): React.JSX.Element {
  if (renderer === 'webgl') {
    return <BarWebGLPlot borderRadius={borderRadius} />;
  }

  return <BarPlot renderer={renderer} borderRadius={borderRadius} {...other} />;
}
