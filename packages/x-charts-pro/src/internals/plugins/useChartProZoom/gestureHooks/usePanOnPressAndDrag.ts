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
import { useDragOnPressGesture } from '../../zoomGestures/useDragOnPressGesture';

export const usePanOnPressAndDrag = (
  {
    store,
    instance,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance'>,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const drawingArea = store.use(selectorChartDrawingArea);
  const optionsLookup = store.use(selectorChartZoomOptionsLookup);
  const config = store.use(selectorPanInteractionConfig, 'pressAndDrag' as const);

  const isPanOnPressAndDragEnabled: boolean =
    Object.values(optionsLookup).some((v) => v.panning) && Boolean(config);

  useDragOnPressGesture(instance, {
    config: config ?? undefined,
    enabled: isPanOnPressAndDragEnabled,
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
