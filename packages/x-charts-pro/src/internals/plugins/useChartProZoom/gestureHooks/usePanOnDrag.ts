'use client';
import {
  type ChartPlugin,
  selectorChartDrawingArea,
  type ZoomData,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { type UseChartProZoomSignature } from '../useChartProZoom.types';
import { translateZoom } from './useZoom.utils';
import { selectorPanInteractionConfig } from '../ZoomInteractionConfig.selectors';
import { usePanGesture } from '../../zoomGestures/usePanGesture';

export const usePanOnDrag = (
  {
    store,
    instance,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance'>,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const drawingArea = store.use(selectorChartDrawingArea);
  const optionsLookup = store.use(selectorChartZoomOptionsLookup);
  const config = store.use(selectorPanInteractionConfig, 'drag' as const);

  const isPanOnDragEnabled: boolean =
    Object.values(optionsLookup).some((v) => v.panning) && Boolean(config);

  usePanGesture(instance, {
    enabled: isPanOnDragEnabled,
    onPan: (delta) => {
      setZoomDataCallback((prev) =>
        translateZoom(
          prev,
          { x: delta.x, y: -delta.y },
          {
            width: drawingArea.width,
            height: drawingArea.height,
          },
          optionsLookup,
        ),
      );
    },
  });
};
