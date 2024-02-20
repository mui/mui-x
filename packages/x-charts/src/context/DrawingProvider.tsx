import * as React from 'react';
import useId from '@mui/utils/useId';
import useChartDimensions from '../hooks/useChartDimensions';
import { LayoutConfig } from '../models/layout';

export interface DrawingProviderProps extends LayoutConfig {
  children: React.ReactNode;
  svgRef: React.RefObject<SVGSVGElement>;
}

/**
 * Defines the area in which it is possible to draw the charts.
 */
export type DrawingArea = {
  /**
   * The gap between the left border of the SVG and the drawing area.
   */
  left: number;
  /**
   * The gap between the top border of the SVG and the drawing area.
   */
  top: number;
  /**
   * The gap between the bottom border of the SVG and the drawing area.
   */
  bottom: number;
  /**
   * The gap between the right border of the SVG and the drawing area.
   */
  right: number;
  /**
   * The width of the drawing area.
   */
  width: number;
  /**
   * The height of the drawing area.
   */
  height: number;
};

export const DrawingContext = React.createContext<
  DrawingArea & {
    /**
     * A random id used to distinguish each chart on the same page.
     */
    chartId: string;
  }
>({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  height: 300,
  width: 400,
  chartId: '',
});
export const SVGContext = React.createContext<React.RefObject<SVGSVGElement>>({ current: null });

function DrawingProvider(props: DrawingProviderProps) {
  const { width, height, margin, svgRef, children } = props;
  const drawingArea = useChartDimensions(width, height, margin);
  const chartId = useId();

  const value = React.useMemo(
    () => ({ chartId: chartId ?? '', ...drawingArea }),
    [chartId, drawingArea],
  );

  return (
    <SVGContext.Provider value={svgRef}>
      <DrawingContext.Provider value={value}>{children}</DrawingContext.Provider>
    </SVGContext.Provider>
  );
}

export { DrawingProvider };
