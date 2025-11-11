'use client';
import type { AxisId, DefaultizedZoomOptions, ZoomData } from '@mui/x-charts/internals';

// This is helpful to avoid the need to provide the possibly auto-generated id for each axis.
export function initializeZoomData(
  options: Record<AxisId, Pick<DefaultizedZoomOptions, 'axisId' | 'minStart' | 'maxEnd'>>,
  zoomData?: readonly ZoomData[],
) {
  const zoomDataMap = new Map<AxisId, ZoomData>();

  zoomData?.forEach((zoom) => {
    const option = options[zoom.axisId];
    if (option) {
      zoomDataMap.set(zoom.axisId, zoom);
    }
  });

  return Object.values(options).map(({ axisId, minStart: start, maxEnd: end }) => {
    if (zoomDataMap.has(axisId)) {
      return zoomDataMap.get(axisId)!;
    }

    return {
      axisId,
      start,
      end,
    };
  });
}
