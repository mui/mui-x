import { styled } from '@mui/material/styles';
import {
  AxisId,
  ComputedAxis,
  getSVGPoint,
  invertScale,
  selectorChartAxis,
  selectorChartAxisZoomOptionsLookup,
  useChartContext,
  useDrawingArea,
  useSelector,
  useStore,
  ZoomData,
} from '@mui/x-charts/internals';
import * as React from 'react';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { ChartDrawingArea } from '@mui/x-charts/hooks';
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

export interface ChartAxisZoomSliderActiveTrackProps {
  axisId: AxisId;
  axisDirection: 'x' | 'y';
  axisPosition: 'top' | 'bottom' | 'left' | 'right';
  zoomData: ZoomData;
  reverse?: boolean;
  showTooltip: boolean;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
}

export function ChartAxisZoomSliderActiveTrack({
  axisId,
  axisDirection,
  axisPosition,
  zoomData,
  reverse,
  showTooltip,
  onPointerEnter,
  onPointerLeave,
}: ChartAxisZoomSliderActiveTrackProps) {
  const { instance, svgRef } = useChartContext<[UseChartProZoomSignature]>();
  const store = useStore<[UseChartProZoomSignature]>();
  const axis = useSelector(store, selectorChartAxis, axisId);
  const drawingArea = useDrawingArea();
  const activePreviewRectRef = React.useRef<SVGRectElement>(null);
  const [startThumbEl, setStartThumbEl] = React.useState<SVGRectElement | null>(null);
  const [endThumbEl, setEndThumbEl] = React.useState<SVGRectElement | null>(null);
  const { tooltipStart, tooltipEnd } = getZoomSliderTooltipsText(axis, drawingArea);

  const previewThumbWidth =
    axisDirection === 'x' ? ZOOM_SLIDER_THUMB_WIDTH : ZOOM_SLIDER_THUMB_HEIGHT;
  const previewThumbHeight =
    axisDirection === 'x' ? ZOOM_SLIDER_THUMB_HEIGHT : ZOOM_SLIDER_THUMB_WIDTH;

  React.useEffect(() => {
    const activePreviewRect = activePreviewRectRef.current;

    if (!activePreviewRect) {
      return;
    }

    let prevPointerZoom = 0;

    const onPointerMove = rafThrottle((event: PointerEvent) => {
      const element = svgRef.current;

      if (!element) {
        return;
      }

      const point = getSVGPoint(element, event);
      const pointerZoom = calculateZoomFromPoint(store.getSnapshot(), axisId, point);

      if (pointerZoom === null) {
        return;
      }

      const deltaZoom = pointerZoom - prevPointerZoom;
      prevPointerZoom = pointerZoom;

      instance.moveZoomRange(axisId, deltaZoom);
    });

    const onPointerUp = () => {
      activePreviewRect.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
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
      const zoomOptions = selectorChartAxisZoomOptionsLookup(store.getSnapshot(), axisId);

      return prevZoomData.map((zoom) => {
        if (zoom.axisId === axisId) {
          const newEnd = calculateZoomFromPoint(store.getSnapshot(), axisId, point);

          if (newEnd === null) {
            return zoom;
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

  const { minStart, maxEnd } = selectorChartAxisZoomOptionsLookup(store.getSnapshot(), axisId);
  const range = maxEnd - minStart;

  if (axisDirection === 'x') {
    previewX = ((zoomData.start - minStart) / range) * drawingArea.width;
    previewY = 0;
    previewWidth = (drawingArea.width * (zoomData.end - zoomData.start)) / range;
    previewHeight = ZOOM_SLIDER_ACTIVE_TRACK_SIZE;

    startThumbX = ((zoomData.start - minStart) / range) * drawingArea.width;
    startThumbY = 0;
    endThumbX = ((zoomData.end - minStart) / range) * drawingArea.width;
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
    previewY = drawingArea.height - ((zoomData.end - minStart) / range) * drawingArea.height;
    previewWidth = ZOOM_SLIDER_ACTIVE_TRACK_SIZE;
    previewHeight = (drawingArea.height * (zoomData.end - zoomData.start)) / range;

    startThumbX = 0;
    startThumbY = drawingArea.height - ((zoomData.start - minStart) / range) * drawingArea.height;
    endThumbX = 0;
    endThumbY = drawingArea.height - ((zoomData.end - minStart) / range) * drawingArea.height;

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
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      />
      <ChartAxisZoomSliderThumb
        ref={setStartThumbEl}
        x={startThumbX}
        y={startThumbY}
        width={previewThumbWidth}
        height={previewThumbHeight}
        orientation={axisDirection === 'x' ? 'horizontal' : 'vertical'}
        onMove={onStartThumbMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
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
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        placement="end"
      />
      <ChartsTooltipZoomSliderValue
        anchorEl={startThumbEl}
        open={showTooltip && tooltipStart !== ''}
        placement={axisPosition}
      >
        {tooltipStart}
      </ChartsTooltipZoomSliderValue>
      <ChartsTooltipZoomSliderValue
        anchorEl={endThumbEl}
        open={showTooltip && tooltipEnd !== ''}
        placement={axisPosition}
      >
        {tooltipEnd}
      </ChartsTooltipZoomSliderValue>
    </React.Fragment>
  );
}

/**
 * Returns the text for the tooltips on the thumbs of the zoom slider.
 */
function getZoomSliderTooltipsText(axis: ComputedAxis, drawingArea: ChartDrawingArea) {
  const formatValue = (value: Date | number | null) => {
    if (axis.valueFormatter) {
      return axis.valueFormatter(value, { location: 'zoom-slider-tooltip', scale: axis.scale });
    }

    return `${value}`;
  };

  const axisDirection = axis.position === 'top' || axis.position === 'bottom' ? 'x' : 'y';

  let start = axisDirection === 'x' ? drawingArea.left : drawingArea.top;
  const size = axisDirection === 'x' ? drawingArea.width : drawingArea.height;
  let end = start + size;
  if (axisDirection === 'y') {
    [start, end] = [end, start]; // Invert for y-axis
  }

  if (axis.reverse) {
    [start, end] = [end, start]; // Reverse the start and end if the axis is reversed
  }

  const startValue = invertScale(axis.scale, axis.data ?? [], start) ?? axis.data?.at(0);
  const endValue = invertScale(axis.scale, axis.data ?? [], end) ?? axis.data?.at(-1);

  const tooltipStart = formatValue(startValue);
  const tooltipEnd = formatValue(endValue);

  return { tooltipStart, tooltipEnd };
}
