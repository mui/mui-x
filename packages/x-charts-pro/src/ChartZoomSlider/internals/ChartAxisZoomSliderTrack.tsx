import * as React from 'react';
import {
  AxisId,
  useChartContext,
  getSVGPoint,
  selectorChartAxisZoomOptionsLookup,
  useStore,
} from '@mui/x-charts/internals';
import { styled } from '@mui/material/styles';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { shouldForwardProp } from '@mui/system';
import { calculateZoomEnd, calculateZoomFromPoint, calculateZoomStart } from './zoom-utils';
import { UseChartProZoomSignature } from '../../internals/plugins/useChartProZoom';

const ZoomSliderTrack = styled('rect', {
  shouldForwardProp: (prop) =>
    shouldForwardProp(prop) && prop !== 'axisDirection' && prop !== 'isSelecting',
})<{ axisDirection: 'x' | 'y'; isSelecting: boolean }>(({ theme }) => ({
  fill:
    theme.palette.mode === 'dark'
      ? (theme.vars || theme).palette.grey[900]
      : (theme.vars || theme).palette.grey[200],
  cursor: 'pointer',
  variants: [
    {
      props: { axisDirection: 'x', isSelecting: true },
      style: {
        cursor: 'ew-resize',
      },
    },
    {
      props: { axisDirection: 'y', isSelecting: true },
      style: {
        cursor: 'ns-resize',
      },
    },
  ],
}));

interface ChartAxisZoomSliderTrackProps extends React.ComponentProps<'rect'> {
  axisId: AxisId;
  axisDirection: 'x' | 'y';
  reverse: boolean;
  onSelectStart?: () => void;
  onSelectEnd?: () => void;
}

export function ChartAxisZoomSliderTrack({
  axisId,
  axisDirection,
  reverse,
  onSelectStart,
  onSelectEnd,
  ...other
}: ChartAxisZoomSliderTrackProps) {
  const ref = React.useRef<SVGRectElement>(null);
  const { instance, svgRef } = useChartContext<[UseChartProZoomSignature]>();
  const store = useStore<[UseChartProZoomSignature]>();
  const [isSelecting, setIsSelecting] = React.useState(false);

  const onPointerDown = function onPointerDown(event: React.PointerEvent<SVGRectElement>) {
    const rect = ref.current;
    const element = svgRef.current;

    if (!rect || !element) {
      return;
    }

    const pointerDownPoint = getSVGPoint(element, event);
    let zoomFromPointerDown = calculateZoomFromPoint(store.getSnapshot(), axisId, pointerDownPoint);

    if (zoomFromPointerDown === null) {
      return;
    }

    const { minStart, maxEnd } = selectorChartAxisZoomOptionsLookup(store.getSnapshot(), axisId);

    // Ensure the zoomFromPointerDown is within the min and max range
    zoomFromPointerDown = Math.max(Math.min(zoomFromPointerDown, maxEnd), minStart);

    const onPointerMove = rafThrottle(function onPointerMove(pointerMoveEvent: PointerEvent) {
      const pointerMovePoint = getSVGPoint(element, pointerMoveEvent);
      const zoomFromPointerMove = calculateZoomFromPoint(
        store.getSnapshot(),
        axisId,
        pointerMovePoint,
      );

      if (zoomFromPointerMove === null) {
        return;
      }

      const zoomOptions = selectorChartAxisZoomOptionsLookup(store.getSnapshot(), axisId);

      instance.setAxisZoomData(axisId, (prevZoomData) => {
        if (zoomFromPointerMove > zoomFromPointerDown) {
          const end = calculateZoomEnd(
            zoomFromPointerMove,
            { ...prevZoomData, start: zoomFromPointerDown },
            zoomOptions,
          );

          /* If the starting point is too close to the end that minSpan wouldn't be respected, we need to update the
           * start point. */
          const start = calculateZoomStart(
            zoomFromPointerDown,
            { ...prevZoomData, start: zoomFromPointerDown, end },
            zoomOptions,
          );

          return { ...prevZoomData, start, end };
        }

        const start = calculateZoomStart(
          zoomFromPointerMove,
          { ...prevZoomData, end: zoomFromPointerDown },
          zoomOptions,
        );

        /* If the starting point is too close to the start that minSpan wouldn't be respected, we need to update the
         * start point. */
        const end = calculateZoomEnd(
          zoomFromPointerDown,
          { ...prevZoomData, start, end: zoomFromPointerDown },
          zoomOptions,
        );

        return { ...prevZoomData, start, end };
      });
    });

    const onPointerUp = function onPointerUp(pointerUpEvent: PointerEvent) {
      rect.releasePointerCapture(pointerUpEvent.pointerId);
      rect.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      setIsSelecting(false);
      onSelectEnd?.();
    };

    event.preventDefault();
    event.stopPropagation();

    rect.setPointerCapture(event.pointerId);
    document.addEventListener('pointerup', onPointerUp);
    rect.addEventListener('pointermove', onPointerMove);

    onSelectStart?.();
    setIsSelecting(true);
  };

  return (
    <ZoomSliderTrack
      ref={ref}
      onPointerDown={onPointerDown}
      axisDirection={axisDirection}
      isSelecting={isSelecting}
      {...other}
    />
  );
}
