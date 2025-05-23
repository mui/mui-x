import { CartesianRangeGetter } from '@mui/x-charts/internals';

export const xRangeGetter: CartesianRangeGetter<'funnel'> = ({ drawingArea, axis }) => {
  const range: [number, number] = [drawingArea.left, drawingArea.left + drawingArea.width];
  const gap = (axis.gap ?? 0) / 2;
  return axis.reverse ? [range[1] + gap, range[0] - gap] : [range[0] - gap, range[1] + gap];
};

export const yRangeGetter: CartesianRangeGetter<'funnel'> = ({ drawingArea, axis }) => {
  const range: [number, number] = [drawingArea.top + drawingArea.height, drawingArea.top];
  const gap = (axis.gap ?? 0) / 2;
  return axis.reverse ? [range[1] - gap, range[0] + gap] : [range[0] + gap, range[1] - gap];
};
