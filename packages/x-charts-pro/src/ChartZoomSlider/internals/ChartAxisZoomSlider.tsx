'use client';
import * as React from 'react';
import {
  AxisId,
  DefaultizedZoomOptions,
  getSVGPoint,
  selectorChartAxisZoomOptionsLookup,
  selectorChartDrawingArea,
  useChartContext,
  useDrawingArea,
  useSelector,
  useStore,
  ZoomData,
  ZOOM_SLIDER_MARGIN,
  selectorChartRawAxis,
  ChartState,
} from '@mui/x-charts/internals';
import { styled } from '@mui/material/styles';
import { useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { shouldForwardProp } from '@mui/system';
import { ChartsTooltipZoomSliderValue } from './ChartsTooltipZoomSliderValue';
import {
  selectorChartAxisZoomData,
  UseChartProZoomSignature,
} from '../../internals/plugins/useChartProZoom';
import { ChartAxisZoomSliderThumb } from './ChartAxisZoomSliderThumb';

const ZoomSliderTrack = styled('rect', {
  shouldForwardProp: (prop) =>
    shouldForwardProp(prop) && prop !== 'axisDirection' && prop !== 'isSelecting',
})<{ axisDirection: 'x' | 'y'; isSelecting: boolean }>(({ theme }) => ({
  fill:
    theme.palette.mode === 'dark'
      ? (theme.vars || theme).palette.grey[800]
      : (theme.vars || theme).palette.grey[300],
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

const ZoomSliderActiveTrackRect = styled('rect')(({ theme }) => ({
  '&': {
    fill:
      theme.palette.mode === 'dark'
        ? (theme.vars || theme).palette.grey[500]
        : (theme.vars || theme).palette.grey[600],
    cursor: 'grab',
  },
}));

interface ChartZoomSliderProps {
  /**
   * The ID of the axis this overview refers to.
   */
  axisId: AxisId;
  /**
   * The direction of the axis.
   */
  axisDirection: 'x' | 'y';
}

const ZOOM_SLIDER_TRACK_SIZE = 8;
const ZOOM_SLIDER_ACTIVE_TRACK_SIZE = 10;
const ZOOM_SLIDER_THUMB_HEIGHT = 20;
const ZOOM_SLIDER_THUMB_WIDTH = 10;
const ZOOM_SLIDER_SIZE = Math.max(
  ZOOM_SLIDER_TRACK_SIZE,
  ZOOM_SLIDER_ACTIVE_TRACK_SIZE,
  ZOOM_SLIDER_THUMB_HEIGHT,
  ZOOM_SLIDER_THUMB_WIDTH,
);

/**
 * Renders the zoom slider for a specific axis.
 * @internal
 */
export function ChartAxisZoomSlider({ axisDirection, axisId }: ChartZoomSliderProps) {
  const store = useStore();
  const drawingArea = useDrawingArea();
  const zoomData = useSelector(store, selectorChartAxisZoomData, axisId);
  const { xAxis } = useXAxes();
  const { yAxis } = useYAxes();

  if (!zoomData) {
    return null;
  }

  let x: number;
  let y: number;
  let reverse: boolean;
  let axisPosition: 'top' | 'bottom' | 'left' | 'right';

  if (axisDirection === 'x') {
    const axis = xAxis[axisId];

    if (!axis || axis.position === 'none') {
      return null;
    }

    const axisSize = axis.height;

    x = drawingArea.left;
    y =
      axis.position === 'bottom'
        ? drawingArea.top + drawingArea.height + axis.offset + axisSize + ZOOM_SLIDER_MARGIN
        : drawingArea.top - axis.offset - axisSize - ZOOM_SLIDER_SIZE - ZOOM_SLIDER_MARGIN;
    reverse = axis.reverse ?? false;
    axisPosition = axis.position ?? 'bottom';
  } else {
    const axis = yAxis[axisId];

    if (!axis || axis.position === 'none') {
      return null;
    }

    const axisSize = axis.width;

    x =
      axis.position === 'right'
        ? drawingArea.left + drawingArea.width + axis.offset + axisSize + ZOOM_SLIDER_MARGIN
        : drawingArea.left - axis.offset - axisSize - ZOOM_SLIDER_SIZE - ZOOM_SLIDER_MARGIN;
    y = drawingArea.top;
    reverse = axis.reverse ?? false;
    axisPosition = axis.position ?? 'left';
  }

  const backgroundRectOffset = (ZOOM_SLIDER_SIZE - ZOOM_SLIDER_TRACK_SIZE) / 2;

  return (
    <g transform={`translate(${x} ${y})`}>
      <ChartAxisZoomSliderTrack
        x={axisDirection === 'x' ? 0 : backgroundRectOffset}
        y={axisDirection === 'x' ? backgroundRectOffset : 0}
        height={axisDirection === 'x' ? ZOOM_SLIDER_TRACK_SIZE : drawingArea.height}
        width={axisDirection === 'x' ? drawingArea.width : ZOOM_SLIDER_TRACK_SIZE}
        rx={ZOOM_SLIDER_TRACK_SIZE / 2}
        ry={ZOOM_SLIDER_TRACK_SIZE / 2}
        axisId={axisId}
        axisDirection={axisDirection}
        reverse={reverse}
      />
      <ChartAxisZoomSliderActiveTrack
        zoomData={zoomData}
        axisId={axisId}
        axisPosition={axisPosition}
        axisDirection={axisDirection}
        reverse={reverse}
      />
    </g>
  );
}

interface ChartAxisZoomSliderTrackProps extends React.ComponentProps<'rect'> {
  axisId: AxisId;
  axisDirection: 'x' | 'y';
  reverse: boolean;
}

function ChartAxisZoomSliderTrack({
  axisId,
  axisDirection,
  reverse,
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

    let pointerMoved = false;

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

      pointerMoved = true;
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

      if (pointerMoved) {
        return;
      }

      // If the pointer didn't move, we still need to respect the zoom constraints (minSpan, etc.)
      // In that case, we assume the start to be the pointerZoom and calculate the end.
      const pointerUpPoint = getSVGPoint(element, pointerUpEvent);
      const zoomFromPointerUp = calculateZoomFromPoint(store.getSnapshot(), axisId, pointerUpPoint);

      if (zoomFromPointerUp === null) {
        return;
      }

      const zoomOptions = selectorChartAxisZoomOptionsLookup(store.getSnapshot(), axisId);

      instance.setAxisZoomData(axisId, (prev) => ({
        ...prev,
        start: zoomFromPointerUp,
        end: calculateZoomEnd(zoomFromPointerUp, prev, zoomOptions),
      }));
    };

    event.preventDefault();
    event.stopPropagation();

    rect.setPointerCapture(event.pointerId);
    document.addEventListener('pointerup', onPointerUp);
    rect.addEventListener('pointermove', onPointerMove);

    setIsSelecting(true);
    instance.setAxisZoomData(axisId, (prev) => ({
      ...prev,
      start: zoomFromPointerDown,
      end: zoomFromPointerDown,
    }));
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

const formatter = Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const zoomValueFormatter = (value: number) => formatter.format(value);

function ChartAxisZoomSliderActiveTrack({
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

export function calculateZoomFromPoint(state: ChartState<any>, axisId: AxisId, point: DOMPoint) {
  const { left, top, height, width } = selectorChartDrawingArea(state);
  const axis = selectorChartRawAxis(state, axisId);

  if (!axis) {
    return null;
  }

  const axisDirection = axis.position === 'right' || axis.position === 'left' ? 'y' : 'x';

  let pointerZoom: number;
  if (axisDirection === 'x') {
    pointerZoom = ((point.x - left) / width) * 100;
  } else {
    pointerZoom = ((top + height - point.y) / height) * 100;
  }

  if (axis.reverse) {
    pointerZoom = 100 - pointerZoom;
  }

  return pointerZoom;
}

export function calculateZoomStart(
  newStart: number,
  currentZoom: ZoomData,
  options: Pick<DefaultizedZoomOptions, 'minStart' | 'minSpan' | 'maxSpan'>,
) {
  const { minStart, minSpan, maxSpan } = options;

  return Math.max(
    minStart,
    currentZoom.end - maxSpan,
    Math.min(currentZoom.end - minSpan, newStart),
  );
}

export function calculateZoomEnd(
  newEnd: number,
  currentZoom: ZoomData,
  options: Pick<DefaultizedZoomOptions, 'maxEnd' | 'minSpan' | 'maxSpan'>,
) {
  const { maxEnd, minSpan, maxSpan } = options;

  return Math.min(
    maxEnd,
    currentZoom.start + maxSpan,
    Math.max(currentZoom.start + minSpan, newEnd),
  );
}
