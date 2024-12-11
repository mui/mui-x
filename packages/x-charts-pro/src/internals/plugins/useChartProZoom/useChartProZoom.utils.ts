import { AxisId, ZoomData } from '@mui/x-charts/internals';

export const createZoomMap = (zoom: ZoomData[]) => {
  const selectedItemsMap = new Map<AxisId, ZoomData>();
  zoom.forEach((zoomItem) => {
    selectedItemsMap.set(zoomItem.axisId, zoomItem);
  });
  return selectedItemsMap;
};
