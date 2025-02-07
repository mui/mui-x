'use client';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import { selectorChartDrawingArea } from '../internals/plugins/corePlugins/useChartDimensions/useChartDimensions.selectors';

export type ChartDrawingArea = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
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
  return useSelector(store, selectorChartDrawingArea);
}
