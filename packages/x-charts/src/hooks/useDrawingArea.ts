'use client';
import { useStore } from '../internals/store/useStore';
import { selectorChartDrawingArea } from '../internals/plugins/corePlugins/useChartDimensions/useChartDimensions.selectors';

export type ChartDrawingArea = {
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

/**
 * Get the drawing area dimensions and coordinates. The drawing area is the area where the chart is rendered.
 *
 * It includes the left, top, width, height, bottom, and right dimensions.
 *
 * @returns The drawing area dimensions.
 */
export function useDrawingArea(): ChartDrawingArea {
  const store = useStore();
  return store.use(selectorChartDrawingArea);
}
