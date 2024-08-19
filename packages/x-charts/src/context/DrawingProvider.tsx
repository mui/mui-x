import * as React from 'react';
import useId from '@mui/utils/useId';
import useChartDimensions from '../hooks/useChartDimensions';
import { LayoutConfig } from '../models/layout';
import { Initializable } from './context.types';

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
  /**
   * Checks if a point is inside the drawing area.
   * @param {Object} point The point to check.
   * @param {number} point.x The x coordinate of the point.
   * @param {number} point.y The y coordinate of the point.
   * @param {Object} options The options of the check.
   * @param {Element} [options.targetElement] The element to check if it is allowed to overflow the drawing area.
   * @param {'x' | 'y'} [options.direction] The direction to check.
   * @returns {boolean} `true` if the point is inside the drawing area, `false` otherwise.
   */
  isPointInside: (
    point: { x: number; y: number },
    options?: {
      targetElement?: Element;
      direction?: 'x' | 'y';
    },
  ) => boolean;
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
  isPointInside: () => false,
});

if (process.env.NODE_ENV !== 'production') {
  DrawingContext.displayName = 'DrawingContext';
}

export type SvgContextState = React.RefObject<SVGSVGElement>;

export const SvgContext = React.createContext<Initializable<SvgContextState>>({
  isInitialized: false,
  data: { current: null },
});

if (process.env.NODE_ENV !== 'production') {
  SvgContext.displayName = 'SvgContext';
}

export function DrawingProvider(props: DrawingProviderProps) {
  const { width, height, margin, svgRef, children } = props;
  const drawingArea = useChartDimensions(width, height, margin);
  const chartId = useId();

  const isPointInside = React.useCallback<DrawingArea['isPointInside']>(
    ({ x, y }, options) => {
      // For element allowed to overflow, wrapping them in <g data-drawing-container /> make them fully part of the drawing area.
      if (options?.targetElement && options?.targetElement.closest('[data-drawing-container]')) {
        return true;
      }

      const isInsideX = x >= drawingArea.left - 1 && x <= drawingArea.left + drawingArea.width;
      const isInsideY = y >= drawingArea.top - 1 && y <= drawingArea.top + drawingArea.height;

      if (options?.direction === 'x') {
        return isInsideX;
      }

      if (options?.direction === 'y') {
        return isInsideY;
      }

      return isInsideX && isInsideY;
    },
    [drawingArea],
  );

  const value = React.useMemo(
    () => ({ chartId: chartId ?? '', ...drawingArea, isPointInside }),
    [chartId, drawingArea, isPointInside],
  );

  const refValue = React.useMemo(() => ({ isInitialized: true, data: svgRef }), [svgRef]);

  return (
    <SvgContext.Provider value={refValue}>
      <DrawingContext.Provider value={value}>{children}</DrawingContext.Provider>
    </SvgContext.Provider>
  );
}
