import { styled } from '@mui/material/styles';
import {
  AxisId,
  getSVGPoint,
  selectorChartAxisZoomOptionsLookup,
  selectorChartDrawingArea,
  useChartContext,
  useDrawingArea,
  useStore,
  ZoomData,
} from '@mui/x-charts/internals';
import * as React from 'react';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import {
  selectorChartAxisZoomData,
  UseChartProZoomSignature,
} from '../../internals/plugins/useChartProZoom';
import { ChartAxisZoomSliderThumb } from './ChartAxisZoomSliderThumb';
import { ChartsTooltipZoomSliderValue } from './ChartsTooltipZoomSliderValue';
import { calculateZoomEnd, calculateZoomFromPoint, calculateZoomStart } from './zoom-utils';
import {
  ZOOM_SLIDER_ACTIVE_TRACK_SIZE,
  ZOOM_SLIDER_THUMB_HEIGHT,
  ZOOM_SLIDER_THUMB_WIDTH,
} from './constants';

const ZoomSliderActiveTrackRect = styled('rect')(({ theme }) => ({
  '&': {
    fill:
      theme.palette.mode === 'dark'
        ? (theme.vars || theme).palette.grey[500]
        : (theme.vars || theme).palette.grey[600],
    cursor: 'grab',
  },
}));

const formatter = Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const zoomValueFormatter = (value: number) => formatter.format(value);

export function ChartAxisZoomSliderActiveTrack({
  axisId,
  axisDirection,
  axisPosition,
  zoomData,
  reverse,
  valueFormatter = zoomValueFormatter,
}: {
  axisId: AxisId;
  axisDirection: 'x' | 'y';
  axisPosition: 'top' | 'bottom' | 'left' | 'right';
  zoomData: ZoomData;
  reverse: boolean;
  valueFormatter?: (value: number) => string;
}) {
  const { instance, svgRef } = useChartContext<[UseChartProZoomSignature]>();
  const store = useStore<[UseChartProZoomSignature]>();
  const drawingArea = useDrawingArea();
  const activePreviewRectRef = React.useRef<SVGRectElement>(null);
  const [startThumbEl, setStartThumbEl] = React.useState<SVGRectElement | null>(null);
  const [endThumbEl, setEndThumbEl] = React.useState<SVGRectElement | null>(null);
  const [showTooltip, setShowTooltip] = React.useState<null | 'start' | 'end' | 'both'>(null);

  const previewThumbWidth =
    axisDirection === 'x' ? ZOOM_SLIDER_THUMB_WIDTH : ZOOM_SLIDER_THUMB_HEIGHT;
  const previewThumbHeight =
    axisDirection === 'x' ? ZOOM_SLIDER_THUMB_HEIGHT : ZOOM_SLIDER_THUMB_WIDTH;

  React.useEffect(() => {
    const activePreviewRect = activePreviewRectRef.current;

    if (!activePreviewRect) {
      return;
    }

    /* min and max values of zoom to ensure the pointer anchor in the slider is maintained  */
    let pointerZoomMin: number;
    let pointerZoomMax: number;
    let prevPointerZoom = 0;

    const onPointerMove = rafThrottle((event: PointerEvent) => {
      const element = svgRef.current;

      if (!element) {
        return;
      }

      const point = getSVGPoint(element, event);
      let pointerZoom = calculateZoomFromPoint(store.getSnapshot(), axisId, point);

      if (pointerZoom === null) {
        return;
      }

      pointerZoom = Math.max(pointerZoomMin, Math.min(pointerZoomMax, pointerZoom));

      const deltaZoom = pointerZoom - prevPointerZoom;
      prevPointerZoom = pointerZoom;

      instance.moveZoomRange(axisId, deltaZoom);
    });

    const onPointerUp = () => {
      activePreviewRect.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      setShowTooltip(null);
    };

    const onPointerDown = (event: PointerEvent) => {
      // Prevent text selection when dragging
      event.preventDefault();
      activePreviewRect.setPointerCapture(event.pointerId);

      const axisZoomData = selectorChartAxisZoomData(store.getSnapshot(), axisId);
      const element = svgRef.current;

      if (!axisZoomData || !element) {
        return;
      }

      const point = getSVGPoint(element, event);
      const pointerDownZoom = calculateZoomFromPoint(store.getSnapshot(), axisId, point);

      if (pointerDownZoom === null) {
        return;
      }

      prevPointerZoom = pointerDownZoom;
      pointerZoomMin = pointerDownZoom - axisZoomData.start;
      pointerZoomMax = 100 - (axisZoomData.end - pointerDownZoom);

      setShowTooltip('both');
      document.addEventListener('pointerup', onPointerUp);
      activePreviewRect.addEventListener('pointermove', onPointerMove);
    };

    activePreviewRect.addEventListener('pointerdown', onPointerDown);

    // eslint-disable-next-line consistent-return
    return () => {
      activePreviewRect.removeEventListener('pointerdown', onPointerDown);
      onPointerMove.clear();
    };
  }, [axisDirection, axisId, instance, reverse, store, svgRef]);

  const onStartThumbMove = (event: PointerEvent) => {
    const element = svgRef.current;

    if (!element) {
      return;
    }

    const point = getSVGPoint(element, event);

    instance.setZoomData((prevZoomData) => {
      const zoomOptions = selectorChartAxisZoomOptionsLookup(store.getSnapshot(), axisId);

      return prevZoomData.map((zoom) => {
        if (zoom.axisId === axisId) {
          const newStart = calculateZoomFromPoint(store.getSnapshot(), axisId, point);

          if (newStart === null) {
            return zoom;
          }

          return {
            ...zoom,
            start: calculateZoomStart(newStart, zoom, zoomOptions),
          };
        }

        return zoom;
      });
    });
  };

  const onEndThumbMove = (event: PointerEvent) => {
    const element = svgRef.current;

    if (!element) {
      return;
    }

    const point = getSVGPoint(element, event);

    instance.setZoomData((prevZoomData) => {
      const { left, top, width, height } = selectorChartDrawingArea(store.getSnapshot());
      const zoomOptions = selectorChartAxisZoomOptionsLookup(store.getSnapshot(), axisId);

      return prevZoomData.map((zoom) => {
        if (zoom.axisId === axisId) {
          let newEnd: number;

          if (axisDirection === 'x') {
            newEnd = ((point.x - left) / width) * 100;
          } else {
            newEnd = ((top + height - point.y) / height) * 100;
          }

          if (reverse) {
            newEnd = 100 - newEnd;
          }

          return {
            ...zoom,
            end: calculateZoomEnd(newEnd, zoom, zoomOptions),
          };
        }

        return zoom;
      });
    });
  };

  let previewX: number;
  let previewY: number;
  let previewWidth: number;
  let previewHeight: number;
  let startThumbX: number;
  let startThumbY: number;
  let endThumbX: number;
  let endThumbY: number;

  if (axisDirection === 'x') {
    previewX = (zoomData.start / 100) * drawingArea.width;
    previewY = 0;
    previewWidth = (drawingArea.width * (zoomData.end - zoomData.start)) / 100;
    previewHeight = ZOOM_SLIDER_ACTIVE_TRACK_SIZE;

    startThumbX = (zoomData.start / 100) * drawingArea.width;
    startThumbY = 0;
    endThumbX = (zoomData.end / 100) * drawingArea.width;
    endThumbY = 0;

    if (reverse) {
      previewX = drawingArea.width - previewX - previewWidth;

      startThumbX = drawingArea.width - startThumbX;
      endThumbX = drawingArea.width - endThumbX;
    }

    startThumbX -= previewThumbWidth / 2;
    endThumbX -= previewThumbWidth / 2;
  } else {
    previewX = 0;
    previewY = drawingArea.height - (zoomData.end / 100) * drawingArea.height;
    previewWidth = ZOOM_SLIDER_ACTIVE_TRACK_SIZE;
    previewHeight = (drawingArea.height * (zoomData.end - zoomData.start)) / 100;

    startThumbX = 0;
    startThumbY = drawingArea.height - (zoomData.start / 100) * drawingArea.height;
    endThumbX = 0;
    endThumbY = drawingArea.height - (zoomData.end / 100) * drawingArea.height;

    if (reverse) {
      previewY = drawingArea.height - previewY - previewHeight;

      startThumbY = drawingArea.height - startThumbY;
      endThumbY = drawingArea.height - endThumbY;
    }

    startThumbY -= previewThumbHeight / 2;
    endThumbY -= previewThumbHeight / 2;
  }

  const previewOffset = (ZOOM_SLIDER_THUMB_HEIGHT - ZOOM_SLIDER_ACTIVE_TRACK_SIZE) / 2;

  return (
    <React.Fragment>
      <ZoomSliderActiveTrackRect
        ref={activePreviewRectRef}
        x={previewX + (axisDirection === 'x' ? 0 : previewOffset)}
        y={previewY + (axisDirection === 'x' ? previewOffset : 0)}
        width={previewWidth}
        height={previewHeight}
        onPointerEnter={() => setShowTooltip('both')}
        onPointerLeave={() => setShowTooltip(null)}
      />
      <ChartAxisZoomSliderThumb
        ref={setStartThumbEl}
        x={startThumbX}
        y={startThumbY}
        width={previewThumbWidth}
        height={previewThumbHeight}
        orientation={axisDirection === 'x' ? 'horizontal' : 'vertical'}
        onMove={onStartThumbMove}
        onPointerEnter={() => setShowTooltip('start')}
        onPointerLeave={() => setShowTooltip(null)}
        placement="start"
      />
      <ChartAxisZoomSliderThumb
        ref={setEndThumbEl}
        x={endThumbX}
        y={endThumbY}
        width={previewThumbWidth}
        height={previewThumbHeight}
        orientation={axisDirection === 'x' ? 'horizontal' : 'vertical'}
        onMove={onEndThumbMove}
        onPointerEnter={() => setShowTooltip('end')}
        onPointerLeave={() => setShowTooltip(null)}
        placement="end"
      />
      <ChartsTooltipZoomSliderValue
        anchorEl={startThumbEl}
        open={showTooltip === 'start' || showTooltip === 'both'}
        placement={axisPosition}
      >
        {valueFormatter(zoomData.start)}
      </ChartsTooltipZoomSliderValue>
      <ChartsTooltipZoomSliderValue
        anchorEl={endThumbEl}
        open={showTooltip === 'end' || showTooltip === 'both'}
        placement={axisPosition}
      >
        {valueFormatter(zoomData.end)}
      </ChartsTooltipZoomSliderValue>
    </React.Fragment>
  );
}
