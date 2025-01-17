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
export function useDrawingArea() {
  const store = useStore();
  return useSelector(store, selectorChartDrawingArea);
}
