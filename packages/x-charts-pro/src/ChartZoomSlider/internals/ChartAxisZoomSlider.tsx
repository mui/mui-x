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
} from '@mui/x-charts/internals';
import { styled } from '@mui/material/styles';
import { useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import {
  selectorChartAxisZoomData,
  UseChartProZoomSignature,
} from '../../internals/plugins/useChartProZoom';
import { ChartAxisZoomSliderHandle } from './ChartAxisZoomSliderHandle';

const BackgroundRect = styled('rect')(({ theme }) => ({
  '&': {
    fill:
      theme.palette.mode === 'dark'
        ? (theme.vars || theme).palette.grey[900]
        : (theme.vars || theme).palette.grey[300],
    opacity: 0.8,
  },
}));

const ZoomRangePreviewRect = styled('rect')(({ theme }) => ({
  '&': {
    fill:
      theme.palette.mode === 'dark'
        ? (theme.vars || theme).palette.grey[800]
        : (theme.vars || theme).palette.grey[500],
    opacity: 0.4,
    cursor: 'grab',
  },
}));

const PREVIEW_HANDLE_WIDTH = 4;

interface ChartZoomSliderProps {
  /**
   * The ID of the axis this overview refers to.
   */
  axisId: AxisId;
  /**
   * The direction of the axis.
   */
  axisDirection: 'x' | 'y';
  /**
   * The size of the overview.
   * This represents the height if the axis is an x-axis, or the width if the axis is a y-axis.
   */
  size: number;
}

/**
 * Renders the zoom slider for a specific axis.
 * @internal
 */
export function ChartAxisZoomSlider({ size, axisDirection, axisId }: ChartZoomSliderProps) {
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

  if (axisDirection === 'x') {
    const axis = xAxis[axisId];

    if (!axis) {
      return null;
    }

    const axisSize = axis.height;

    x = drawingArea.left;
    y =
      axis.position === 'bottom'
        ? drawingArea.top + drawingArea.height + axis.offset + axisSize
        : drawingArea.top - axis.offset - axisSize - size;
    reverse = axis.reverse ?? false;
  } else {
    const axis = yAxis[axisId];

    if (!axis) {
      return null;
    }

    const axisSize = axis.width;

    x =
      axis.position === 'right'
        ? drawingArea.left + drawingArea.width + axis.offset + axisSize
        : drawingArea.left - axis.offset - axisSize - size;
    y = drawingArea.top;
    reverse = axis.reverse ?? false;
  }

  return (
    <g transform={`translate(${x} ${y})`}>
      <BackgroundRect
        height={axisDirection === 'x' ? size : drawingArea.height}
        width={axisDirection === 'x' ? drawingArea.width : size}
      />
      <ChartAxisZoomSliderSpan
        size={size}
        zoomData={zoomData}
        axisId={axisId}
        axisDirection={axisDirection}
        reverse={reverse}
      />
    </g>
  );
}

function ChartAxisZoomSliderSpan({
  size,
  axisId,
  axisDirection,
  zoomData,
  reverse,
}: {
  size: number;
  axisId: AxisId;
  axisDirection: 'x' | 'y';
  zoomData: ZoomData;
  reverse: boolean;
}) {
  const { instance, svgRef } = useChartContext<[UseChartProZoomSignature]>();
  const store = useStore<[UseChartProZoomSignature]>();
  const drawingArea = useDrawingArea();
  const activePreviewRectRef = React.useRef<SVGRectElement>(null);
  const previewHandleWidth = axisDirection === 'x' ? PREVIEW_HANDLE_WIDTH : 0.6 * size;
  const previewHandleHeight = axisDirection === 'x' ? 0.6 * size : PREVIEW_HANDLE_WIDTH;

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
      const { left, bottom, height, width } = selectorChartDrawingArea(store.getSnapshot());
      const axisZoomData = selectorChartAxisZoomData(store.getSnapshot(), axisId);
      const element = svgRef.current;

      if (!axisZoomData || !element) {
        return;
      }

      const point = getSVGPoint(element, event);

      let pointerZoom: number;
      if (axisDirection === 'x') {
        pointerZoom = ((point.x - left) / width) * 100;
      } else {
        pointerZoom = ((point.y - bottom) / height) * 100;
      }

      if (reverse) {
        pointerZoom = 100 - pointerZoom;
      }

      pointerZoom = Math.max(pointerZoomMin, Math.min(pointerZoomMax, pointerZoom));

      const deltaZoom = pointerZoom - prevPointerZoom;
      prevPointerZoom = pointerZoom;

      instance.moveZoomRange(axisId, deltaZoom);
    });

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    const onPointerDown = (event: PointerEvent) => {
      // Prevent text selection when dragging
      event.preventDefault();

      const { top, left, bottom, height, width } = selectorChartDrawingArea(store.getSnapshot());
      const axisZoomData = selectorChartAxisZoomData(store.getSnapshot(), axisId);
      const element = svgRef.current;

      if (!axisZoomData || !element) {
        return;
      }

      const point = getSVGPoint(element, event);

      if (
        !instance.isPointInside({
          x: axisDirection === 'x' ? point.x : left,
          y: axisDirection === 'x' ? top : point.y,
        })
      ) {
        return;
      }

      // The corresponding value of zoom where the pointer was pressed
      let pointerDownZoom: number;
      if (axisDirection === 'x') {
        pointerDownZoom = ((point.x - left) / width) * 100;
      } else {
        pointerDownZoom = ((point.y - bottom) / height) * 100;
      }

      if (reverse) {
        pointerDownZoom = 100 - pointerDownZoom;
      }

      prevPointerZoom = pointerDownZoom;
      pointerZoomMin = pointerDownZoom - axisZoomData.start;
      pointerZoomMax = 100 - (axisZoomData.end - pointerDownZoom);

      document.addEventListener('pointerup', onPointerUp);
      document.addEventListener('pointermove', onPointerMove);
    };

    activePreviewRect.addEventListener('pointerdown', onPointerDown);

    // eslint-disable-next-line consistent-return
    return () => {
      activePreviewRect.removeEventListener('pointerdown', onPointerDown);
      onPointerMove.clear();
    };
  }, [axisDirection, axisId, instance, reverse, store, svgRef]);

  const onResizeStart = (event: PointerEvent) => {
    const element = svgRef.current;

    if (!element) {
      return;
    }

    const point = getSVGPoint(element, event);

    store.update((state) => {
      const { left, top, width, height } = selectorChartDrawingArea(state);

      const zoomOptions = selectorChartAxisZoomOptionsLookup(state, axisId);

      const newState = {
        ...state,
        zoom: {
          ...state.zoom,
          zoomData: state.zoom.zoomData.map((zoom) => {
            if (zoom.axisId === axisId) {
              let newStart: number;

              if (axisDirection === 'x') {
                newStart = ((point.x - left) / width) * 100;
              } else {
                newStart = ((top + height - point.y) / height) * 100;
              }

              if (reverse) {
                newStart = 100 - newStart;
              }

              return {
                ...zoom,
                start: calculateZoomStart(newStart, zoom, zoomOptions),
              };
            }

            return zoom;
          }),
        },
      };

      return newState;
    });
  };

  const onResizeEnd = (event: PointerEvent) => {
    const element = svgRef.current;

    if (!element) {
      return;
    }

    const point = getSVGPoint(element, event);

    store.update((state) => {
      const { left, top, width, height } = selectorChartDrawingArea(state);

      const zoomOptions = selectorChartAxisZoomOptionsLookup(state, axisId);

      const newState = {
        ...state,
        zoom: {
          ...state.zoom,
          zoomData: state.zoom.zoomData.map((zoom) => {
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
          }),
        },
      };

      return newState;
    });
  };

  let previewX: number;
  let previewY: number;
  let previewWidth: number;
  let previewHeight: number;
  let startHandleX: number;
  let startHandleY: number;
  let endHandleX: number;
  let endHandleY: number;

  if (axisDirection === 'x') {
    previewX = (zoomData.start / 100) * drawingArea.width;
    previewY = 0;
    previewWidth = (drawingArea.width * (zoomData.end - zoomData.start)) / 100;
    previewHeight = size;

    startHandleX = (zoomData.start / 100) * drawingArea.width;
    startHandleY = (size - previewHandleHeight) / 2;
    endHandleX = (zoomData.end / 100) * drawingArea.width;
    endHandleY = (size - previewHandleHeight) / 2;

    if (reverse) {
      previewX = drawingArea.width - previewX - previewWidth;

      startHandleX = drawingArea.width - startHandleX;
      endHandleX = drawingArea.width - endHandleX;
    }

    startHandleX -= previewHandleWidth / 2;
    endHandleX -= previewHandleWidth / 2;
  } else {
    previewX = 0;
    previewY = drawingArea.height - (zoomData.end / 100) * drawingArea.height;
    previewWidth = size;
    previewHeight = (drawingArea.height * (zoomData.end - zoomData.start)) / 100;

    startHandleX = (size - previewHandleWidth) / 2;
    startHandleY = drawingArea.height - (zoomData.start / 100) * drawingArea.height;
    endHandleX = (size - previewHandleWidth) / 2;
    endHandleY = drawingArea.height - (zoomData.end / 100) * drawingArea.height;

    if (reverse) {
      previewY = drawingArea.height - previewY - previewHeight;

      startHandleY = drawingArea.height - startHandleY;
      endHandleY = drawingArea.height - endHandleY;
    }

    startHandleY -= previewHandleHeight / 2;
    endHandleY -= previewHandleHeight / 2;
  }

  return (
    <React.Fragment>
      <ZoomRangePreviewRect
        ref={activePreviewRectRef}
        x={previewX}
        y={previewY}
        width={previewWidth}
        height={previewHeight}
      />
      {
        // TODO: In RTL languages, should we start from the right?
      }
      <ChartAxisZoomSliderHandle
        x={startHandleX}
        y={startHandleY}
        width={previewHandleWidth}
        height={previewHandleHeight}
        orientation={axisDirection === 'x' ? 'horizontal' : 'vertical'}
        onResize={onResizeStart}
        placement="start"
      />
      <ChartAxisZoomSliderHandle
        x={endHandleX}
        y={endHandleY}
        width={previewHandleWidth}
        height={previewHandleHeight}
        orientation={axisDirection === 'x' ? 'horizontal' : 'vertical'}
        onResize={onResizeEnd}
        placement="end"
      />
    </React.Fragment>
  );
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
