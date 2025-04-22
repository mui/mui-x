'use client';
import * as React from 'react';
import {
  AxisId,
  DefaultizedZoomOptions,
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
} from '../internals/plugins/useChartProZoom';
import { ChartAxisZoomOverviewHandle } from './ChartAxisZoomOverviewHandle';

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

interface ChartZoomOverviewProps {
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
 * Renders the zoom overview for a specific axis.
 * @internal
 */
export function ChartAxisZoomOverview({ size, axisDirection, axisId }: ChartZoomOverviewProps) {
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
  }

  return (
    <g transform={`translate(${x} ${y})`}>
      <BackgroundRect
        height={axisDirection === 'x' ? size : drawingArea.height}
        width={axisDirection === 'x' ? drawingArea.width : size}
      />
      <ChartAxisZoomOverviewSpan
        size={size}
        zoomData={zoomData}
        axisId={axisId}
        axisDirection={axisDirection}
      />
    </g>
  );
}

function ChartAxisZoomOverviewSpan({
  size,
  axisId,
  axisDirection,
  zoomData,
}: {
  size: number;
  axisId: AxisId;
  axisDirection: 'x' | 'y';
  zoomData: ZoomData;
}) {
  const { instance } = useChartContext<[UseChartProZoomSignature]>();
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

    let prev = 0;

    const onPointerMove = rafThrottle((event: PointerEvent) => {
      const { height, width } = selectorChartDrawingArea(store.getSnapshot());
      const drawingAreaSize = axisDirection === 'x' ? width : height;

      const current = axisDirection === 'x' ? event.clientX : event.clientY;
      const delta = current - prev;
      prev = current;

      const deltaZoom = delta / drawingAreaSize;

      instance.moveZoomRange(axisId, deltaZoom * 100);
    });

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      prev = 0;
    };

    const onPointerDown = (event: PointerEvent) => {
      // Prevent text selection when dragging the handle
      event.preventDefault();
      prev = axisDirection === 'x' ? event.clientX : event.clientY;
      document.addEventListener('pointerup', onPointerUp);
      document.addEventListener('pointermove', onPointerMove);
    };

    activePreviewRect.addEventListener('pointerdown', onPointerDown);

    // eslint-disable-next-line consistent-return
    return () => {
      activePreviewRect.removeEventListener('pointerdown', onPointerDown);
      onPointerMove.clear();
    };
  }, [axisDirection, axisId, instance, store]);

  const onResizeStart = (delta: number) => {
    store.update((state) => {
      const { width, height } = selectorChartDrawingArea(state);
      const drawingAreaSize = axisDirection === 'x' ? width : height;

      const zoomOptions = selectorChartAxisZoomOptionsLookup(state, axisId);

      const newState = {
        ...state,
        zoom: {
          ...state.zoom,
          zoomData: state.zoom.zoomData.map((zoom) => {
            if (zoom.axisId === axisId) {
              const deltaZoom = (delta / drawingAreaSize) * 100;

              return {
                ...zoom,
                start: calculateZoomStart(zoom.start + deltaZoom, zoom, zoomOptions),
              };
            }

            return zoom;
          }),
        },
      };

      return newState;
    });
  };

  const onResizeEnd = (delta: number) => {
    store.update((state) => {
      const { width, height } = selectorChartDrawingArea(state);
      const drawingAreaSize = axisDirection === 'x' ? width : height;

      // TODO: What about non-cartesian axes? Are these the only ones that can be zoomed?
      const zoomOptions = selectorChartAxisZoomOptionsLookup(state, axisId);

      const newState = {
        ...state,
        zoom: {
          ...state.zoom,
          zoomData: state.zoom.zoomData.map((zoom) => {
            if (zoom.axisId === axisId) {
              const deltaZoom = (delta / drawingAreaSize) * 100;

              return {
                ...zoom,
                end: calculateZoomEnd(zoom.end + deltaZoom, zoom, zoomOptions),
              };
            }

            return zoom;
          }),
        },
      };

      return newState;
    });
  };

  return (
    <React.Fragment>
      <ZoomRangePreviewRect
        ref={activePreviewRectRef}
        x={axisDirection === 'x' ? (zoomData.start / 100) * drawingArea.width : 0}
        y={axisDirection === 'x' ? 0 : (zoomData.start / 100) * drawingArea.height}
        width={
          axisDirection === 'x' ? (drawingArea.width * (zoomData.end - zoomData.start)) / 100 : size
        }
        height={
          axisDirection === 'x'
            ? size
            : (drawingArea.height * (zoomData.end - zoomData.start)) / 100
        }
      />
      {
        // TODO: In RTL languages, should we start from the right?
      }
      <ChartAxisZoomOverviewHandle
        x={
          axisDirection === 'x'
            ? (zoomData.start / 100) * drawingArea.width - previewHandleWidth / 2
            : (size - previewHandleWidth) / 2
        }
        y={
          axisDirection === 'x'
            ? (size - previewHandleHeight) / 2
            : (zoomData.start / 100) * drawingArea.height - previewHandleHeight / 2
        }
        width={previewHandleWidth}
        height={previewHandleHeight}
        orientation={axisDirection === 'x' ? 'horizontal' : 'vertical'}
        onResize={onResizeStart}
      />
      <ChartAxisZoomOverviewHandle
        x={
          axisDirection === 'x'
            ? (zoomData.end / 100) * drawingArea.width - previewHandleWidth / 2
            : (size - previewHandleWidth) / 2
        }
        y={
          axisDirection === 'x'
            ? (size - previewHandleHeight) / 2
            : (zoomData.end / 100) * drawingArea.height - previewHandleHeight / 2
        }
        width={previewHandleWidth}
        height={previewHandleHeight}
        orientation={axisDirection === 'x' ? 'horizontal' : 'vertical'}
        onResize={onResizeEnd}
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
