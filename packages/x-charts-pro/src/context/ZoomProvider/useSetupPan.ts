'use client';
// import * as React from 'react';
// import { useDrawingArea, useSvgRef } from '@mui/x-charts/hooks';

// import {
//   AxisId,
//   getSVGPoint,
//   useChartContext,
//   useSelector,
//   useStore,
// } from '@mui/x-charts/internals';

// import { ZoomData } from './Zoom.types';
// import { useZoomIsInteracting } from './useZoom';
// import { selectorChartZoomOptions } from '../../internals/plugins/useChartProCartesianAxis/useChartProCartesianAxis.selectors';
// import { UseChartProCartesianAxisSignature } from '../../internals/plugins/useChartProCartesianAxis/useChartProCartesianAxis.types';

export const useSetupPan = () => {
  // const store = useStore<[UseChartProCartesianAxisSignature]>();
  // const options = useSelector(store, selectorChartZoomOptions);
  // const isPanEnabled = options.fo;
  // const setZoomMap = React.useCallback(
  //   (updateFunction: (zoomMap: Map<AxisId, ZoomData>) => Map<AxisId, ZoomData>) =>
  //     store.update((prev) => ({
  //       ...prev,
  //       zoom: {
  //         ...prev.zoom,
  //         zoomMap: updateFunction(prev.zoom.zoomMap),
  //       },
  //     })),
  //   [store],
  // );
  // const setIsInteracting = React.useCallback(
  //   (newValue: boolean) =>
  //     store.update((prev) => ({
  //       ...prev,
  //       zoom: {
  //         ...prev.zoom,
  //         isInteracting: newValue,
  //       },
  //     })),
  //   [store],
  // );
  // const drawingArea = useDrawingArea();
  // const { instance } = useChartContext();
  // const svgRef = useSvgRef();
  // const isDraggingRef = React.useRef(false);
  // const touchStartRef = React.useRef<{ x: number; y: number; zoomData: ZoomData[] } | null>(null);
  // const eventCacheRef = React.useRef<PointerEvent[]>([]);
  // React.useEffect(() => {
  //   const element = svgRef.current;
  //   if (element === null || !isPanEnabled) {
  //     return () => {};
  //   }
  //   const handlePan = (event: PointerEvent) => {
  //     if (element === null || !isDraggingRef.current || eventCacheRef.current.length > 1) {
  //       return;
  //     }
  //     if (touchStartRef.current == null) {
  //       return;
  //     }
  //     const point = getSVGPoint(element, event);
  //     const movementX = point.x - touchStartRef.current.x;
  //     const movementY = (point.y - touchStartRef.current.y) * -1;
  //     const newZoomData = touchStartRef.current.zoomData.map((zoom) => {
  //       const option = options[zoom.axisId];
  //       if (!option || !option.panning) {
  //         return zoom;
  //       }
  //       const min = zoom.start;
  //       const max = zoom.end;
  //       const span = max - min;
  //       const MIN_PERCENT = option.minStart;
  //       const MAX_PERCENT = option.maxEnd;
  //       const movement = option.axisDirection === 'x' ? movementX : movementY;
  //       const dimension = option.axisDirection === 'x' ? drawingArea.width : drawingArea.height;
  //       let newMinPercent = min - (movement / dimension) * span;
  //       let newMaxPercent = max - (movement / dimension) * span;
  //       if (newMinPercent < MIN_PERCENT) {
  //         newMinPercent = MIN_PERCENT;
  //         newMaxPercent = newMinPercent + span;
  //       }
  //       if (newMaxPercent > MAX_PERCENT) {
  //         newMaxPercent = MAX_PERCENT;
  //         newMinPercent = newMaxPercent - span;
  //       }
  //       if (
  //         newMinPercent < MIN_PERCENT ||
  //         newMaxPercent > MAX_PERCENT ||
  //         span < option.minSpan ||
  //         span > option.maxSpan
  //       ) {
  //         return zoom;
  //       }
  //       return {
  //         ...zoom,
  //         start: newMinPercent,
  //         end: newMaxPercent,
  //       };
  //     });
  //     setZoomData(newZoomData);
  //   };
  //   const handleDown = (event: PointerEvent) => {
  //     eventCacheRef.current.push(event);
  //     const point = getSVGPoint(element, event);
  //     if (!instance.isPointInside(point)) {
  //       return;
  //     }
  //     // If there is only one pointer, prevent selecting text
  //     if (eventCacheRef.current.length === 1) {
  //       event.preventDefault();
  //     }
  //     isDraggingRef.current = true;
  //     setIsInteracting(true);
  //     touchStartRef.current = {
  //       x: point.x,
  //       y: point.y,
  //       zoomData,
  //     };
  //   };
  //   const handleUp = (event: PointerEvent) => {
  //     eventCacheRef.current.splice(
  //       eventCacheRef.current.findIndex((cachedEvent) => cachedEvent.pointerId === event.pointerId),
  //       1,
  //     );
  //     setIsInteracting(false);
  //     isDraggingRef.current = false;
  //     touchStartRef.current = null;
  //   };
  //   element.addEventListener('pointerdown', handleDown);
  //   document.addEventListener('pointermove', handlePan);
  //   document.addEventListener('pointerup', handleUp);
  //   document.addEventListener('pointercancel', handleUp);
  //   document.addEventListener('pointerleave', handleUp);
  //   return () => {
  //     element.removeEventListener('pointerdown', handleDown);
  //     document.removeEventListener('pointermove', handlePan);
  //     document.removeEventListener('pointerup', handleUp);
  //     document.removeEventListener('pointercancel', handleUp);
  //     document.removeEventListener('pointerleave', handleUp);
  //   };
  // }, [
  //   instance,
  //   svgRef,
  //   isDraggingRef,
  //   setIsInteracting,
  //   zoomData,
  //   setZoomData,
  //   isPanEnabled,
  //   options,
  //   drawingArea.width,
  //   drawingArea.height,
  // ]);
};
