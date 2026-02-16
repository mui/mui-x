'use client';
import { styled } from '@mui/material/styles';
import {
  type AxisId,
  type ComputedAxis,
  getLayerRelativePoint,
  invertScale,
  selectorChartAxis,
  selectorChartAxisZoomOptionsLookup,
  useChartContext,
  useDrawingArea,
  useStore,
  type ZoomData,
} from '@mui/x-charts/internals';
import * as React from 'react';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { type ChartDrawingArea } from '@mui/x-charts/hooks';
import { shouldForwardProp } from '@mui/system';
import {
  selectorChartAxisZoomData,
  type UseChartProZoomSignature,
} from '../../internals/plugins/useChartProZoom';
import { ChartAxisZoomSliderThumb } from './ChartAxisZoomSliderThumb';
import { ChartsTooltipZoomSliderValue } from './ChartsTooltipZoomSliderValue';
import { calculateZoomEnd, calculateZoomFromPoint, calculateZoomStart } from './zoom-utils';
import { ZOOM_SLIDER_THUMB_HEIGHT, ZOOM_SLIDER_THUMB_WIDTH } from './constants';
import { useUtilityClasses } from './chartAxisZoomSliderTrackClasses';

const ZoomSliderActiveTrackRect = styled('rect', {
  slot: 'internal',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'preview',
})<{ preview: boolean }>(({ theme }) => ({
  fill: (theme.vars || theme).palette.grey[600],
  ...theme.applyStyles('dark', {
    fill: (theme.vars || theme).palette.grey[500],
  }),
  cursor: 'grab',
  variants: [
    {
      props: { preview: true },
      style: {
        fill: 'transparent',
        // Increases the specificity to override the default fill
        ...theme.applyStyles('dark', {
          fill: 'transparent',
        }),
        rx: 4,
        ry: 4,
        stroke: theme.palette.grey[500],
      },
    },
  ],
}));

export interface ChartAxisZoomSliderActiveTrackProps {
  axisId: AxisId;
  axisDirection: 'x' | 'y';
  axisPosition: 'top' | 'bottom' | 'left' | 'right';
  size: number;
  preview: boolean;
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
  size,
  preview,
  zoomData,
  reverse,
  showTooltip,
  onPointerEnter,
  onPointerLeave,
}: ChartAxisZoomSliderActiveTrackProps) {
  const { instance } = useChartContext<[UseChartProZoomSignature]>();
  const { svgRef } = instance;
  const store = useStore<[UseChartProZoomSignature]>();
  const axis = store.use(selectorChartAxis, axisId);
  const drawingArea = useDrawingArea();
  const activePreviewRectRef = React.useRef<SVGRectElement>(null);
  const [startThumbEl, setStartThumbEl] = React.useState<SVGRectElement | null>(null);
  const [endThumbEl, setEndThumbEl] = React.useState<SVGRectElement | null>(null);
  const { tooltipStart, tooltipEnd } = getZoomSliderTooltipsText(axis, drawingArea);
  const classes = useUtilityClasses({ axisDirection });

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

      const point = getLayerRelativePoint(element, event);
      const pointerZoom = calculateZoomFromPoint(store.state, axisId, point);

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

      const axisZoomData = selectorChartAxisZoomData(store.state, axisId);
      const element = svgRef.current;

      if (!axisZoomData || !element) {
        return;
      }

      const point = getLayerRelativePoint(element, event);
      const pointerDownZoom = calculateZoomFromPoint(store.state, axisId, point);

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

    const point = getLayerRelativePoint(element, event);

    instance.setZoomData((prevZoomData) => {
      const zoomOptions = selectorChartAxisZoomOptionsLookup(store.state, axisId);

      return prevZoomData.map((zoom) => {
        if (zoom.axisId === axisId) {
          const newStart = calculateZoomFromPoint(store.state, axisId, point);

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

    const point = getLayerRelativePoint(element, event);

    instance.setZoomData((prevZoomData) => {
      const zoomOptions = selectorChartAxisZoomOptionsLookup(store.state, axisId);

      return prevZoomData.map((zoom) => {
        if (zoom.axisId === axisId) {
          const newEnd = calculateZoomFromPoint(store.state, axisId, point);

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

  const { minStart, maxEnd } = selectorChartAxisZoomOptionsLookup(store.state, axisId);
  const range = maxEnd - minStart;
  const zoomStart = Math.max(minStart, zoomData.start);
  const zoomEnd = Math.min(zoomData.end, maxEnd);

  if (axisDirection === 'x') {
    previewX = ((zoomStart - minStart) / range) * drawingArea.width;
    previewY = 0;
    previewWidth = (drawingArea.width * (zoomEnd - zoomStart)) / range;
    previewHeight = size;

    startThumbX = ((zoomStart - minStart) / range) * drawingArea.width;
    startThumbY = ZOOM_SLIDER_THUMB_HEIGHT < size ? (size - ZOOM_SLIDER_THUMB_HEIGHT) / 2 : 0;
    endThumbX = ((zoomEnd - minStart) / range) * drawingArea.width;
    endThumbY = ZOOM_SLIDER_THUMB_HEIGHT < size ? (size - ZOOM_SLIDER_THUMB_HEIGHT) / 2 : 0;

    if (reverse) {
      previewX = drawingArea.width - previewX - previewWidth;

      startThumbX = drawingArea.width - startThumbX;
      endThumbX = drawingArea.width - endThumbX;
    }

    startThumbX -= previewThumbWidth / 2;
    endThumbX -= previewThumbWidth / 2;
  } else {
    previewX = 0;
    previewY = drawingArea.height - ((zoomEnd - minStart) / range) * drawingArea.height;
    previewWidth = size;
    previewHeight = (drawingArea.height * (zoomEnd - zoomStart)) / range;

    startThumbX = ZOOM_SLIDER_THUMB_HEIGHT < size ? (size - ZOOM_SLIDER_THUMB_HEIGHT) / 2 : 0;
    startThumbY = drawingArea.height - ((zoomStart - minStart) / range) * drawingArea.height;
    endThumbX = ZOOM_SLIDER_THUMB_HEIGHT < size ? (size - ZOOM_SLIDER_THUMB_HEIGHT) / 2 : 0;
    endThumbY = drawingArea.height - ((zoomEnd - minStart) / range) * drawingArea.height;

    if (reverse) {
      previewY = drawingArea.height - previewY - previewHeight;

      startThumbY = drawingArea.height - startThumbY;
      endThumbY = drawingArea.height - endThumbY;
    }

    startThumbY -= previewThumbHeight / 2;
    endThumbY -= previewThumbHeight / 2;
  }

  const previewOffset = ZOOM_SLIDER_THUMB_HEIGHT > size ? (ZOOM_SLIDER_THUMB_HEIGHT - size) / 2 : 0;

  return (
    <React.Fragment>
      <ZoomSliderActiveTrackRect
        ref={activePreviewRectRef}
        x={previewX + (axisDirection === 'x' ? 0 : previewOffset)}
        y={previewY + (axisDirection === 'x' ? previewOffset : 0)}
        preview={preview}
        width={previewWidth}
        height={previewHeight}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        className={classes.active}
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
