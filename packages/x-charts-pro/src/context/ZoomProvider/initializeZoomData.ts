import { AxisId, DefaultizedZoomOption } from '@mui/x-charts/internals';

// It is helpful to avoid the need to provide the possibly auto-generated id for each axis.
export const initializeZoomData = (options: Record<AxisId, DefaultizedZoomOption>) => {
  return Object.values(options).map(({ axisId, minStart: start, maxEnd: end }) => ({
    axisId,
    start,
    end,
  }));
};
