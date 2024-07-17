import { ZoomState } from './Zoom.types';

// This function is used to initialize the zoom data when it is not provided by the user.
// It is helpful to avoid the need to provide the possibly auto-generated id for each axis.
export const initializeZoomData = (
  zoomData: ZoomState['zoomData'],
  options: ZoomState['options'],
) => {
  return zoomData.length > 0
    ? zoomData
    : Object.values(options).map(({ axisId, minStart: start, maxEnd: end }) => ({
        axisId,
        start,
        end,
      }));
};
