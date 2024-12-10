import { AxisId } from '@mui/x-charts/internals';
import { ZoomData } from './useChartProCartesianAxis.types';

export const createZoomMap = (zoom: ZoomData[]) => {
  const selectedItemsMap = new Map<AxisId, ZoomData>();
  zoom.forEach((zoomItem) => {
    selectedItemsMap.set(zoomItem.axisId, zoomItem);
  });
  return selectedItemsMap;
};
