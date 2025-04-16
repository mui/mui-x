'use client';
import * as React from 'react';
import {
  AxisId,
  DefaultizedZoomOptions,
  selectorChartAxisZoomOptionsLookup,
  selectorChartDrawingArea,
  useDrawingArea,
  useSelector,
  useStore,
  ZoomData,
} from '@mui/x-charts/internals';
import { styled } from '@mui/material/styles';
import { useXAxes, useYAxes } from '@mui/x-charts/hooks';
import {
  selectorChartAxisZoomData,
  UseChartProZoomSignature,
} from '../internals/plugins/useChartProZoom';
import { ChartZoomBrushHandle } from './ChartZoomBrushHandle';

const BackgroundRect = styled('rect')(({ theme }) => ({
  '&': {
    fill: (theme.vars || theme).palette.grey[300],
    opacity: 0.8,
  },
}));

const ZoomRangePreviewRect = styled('rect')(({ theme }) => ({
  '&': {
    fill: (theme.vars || theme).palette.grey[500],
    opacity: 0.4,
    cursor: 'grab',
  },
}));

const PREVIEW_HANDLE_WIDTH = 4;

interface ChartZoomBrushProps {
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

export function ChartZoomBrush({ size, axisDirection, axisId }: ChartZoomBrushProps) {
  const store = useStore();
  const drawingArea = useDrawingArea();
  const zoomData = useSelector(store, selectorChartAxisZoomData, axisId);
  const { xAxis } = useXAxes();
  const { yAxis } = useYAxes();
  const axis = axisDirection === 'x' ? xAxis[axisId] : yAxis[axisId];

  if (!zoomData || !axis) {
    return null;
  }

  const axisSize = axisDirection === 'x' ? axis.height : axis.width;

  return (
    <g
      transform={`translate(${drawingArea.left} ${drawingArea.top + drawingArea.height + axis.offset + axisSize})`}
    >
      <BackgroundRect height={size} width={drawingArea.width} />
      <ChartZoomBrushRange size={size} zoomData={zoomData} axisId={axisId} />
    </g>
  );
}

function ChartZoomBrushRange({
  size,
  axisId,
  zoomData,
}: {
  size: number;
  axisId: AxisId;
  zoomData: ZoomData;
}) {
  const store = useStore<[UseChartProZoomSignature]>();
  const drawingArea = useDrawingArea();
  const activePreviewRectRef = React.useRef<SVGRectElement>(null);
  const previewHandleHeight = 0.6 * size;

  React.useEffect(() => {
    const activePreviewRect = activePreviewRectRef.current;

    if (!activePreviewRect) {
      return;
    }

    let previewPrevX = 0;

    // TODO: Do we want to raf this?
    const onPointerMove = (event: PointerEvent) => {
      store.update((state) => {
        const { width } = selectorChartDrawingArea(state);

        const zoom = selectorChartAxisZoomData(state, axisId);

        if (!zoom) {
          return state;
        }

        const zoomSpan = zoom.end - zoom.start;

        const deltaX = event.clientX - previewPrevX;
        previewPrevX = event.clientX;

        const deltaZoom = deltaX / width;

        const newState = {
          ...state,
          zoom: {
            ...state.zoom,
            zoomData: state.zoom.zoomData.map((data) => {
              if (data.axisId === axisId) {
                return {
                  ...data,
                  start: Math.max(0, Math.min(100 - zoomSpan, zoom.start + deltaZoom * 100)),
                  end: Math.min(100, Math.max(zoomSpan, zoom.end + deltaZoom * 100)),
                };
              }

              return data;
            }),
          },
        };

        return newState;
      });
    };

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      previewPrevX = 0;
    };

    const onPointerDown = (event: PointerEvent) => {
      // Prevent text selection when dragging the handle
      event.preventDefault();
      previewPrevX = event.clientX;
      document.addEventListener('pointerup', onPointerUp);
      document.addEventListener('pointermove', onPointerMove);
    };

    activePreviewRect.addEventListener('pointerdown', onPointerDown);

    // eslint-disable-next-line consistent-return
    return () => {
      activePreviewRect.removeEventListener('pointerdown', onPointerDown);
    };
  }, [axisId, store]);

  const onResizeLeft = (delta: number) => {
    store.update((state) => {
      const { width } = selectorChartDrawingArea(state);

      const zoomOptions = selectorChartAxisZoomOptionsLookup(state, axisId);

      const newState = {
        ...state,
        zoom: {
          ...state.zoom,
          zoomData: state.zoom.zoomData.map((zoom) => {
            if (zoom.axisId === axisId) {
              const deltaZoom = (delta / width) * 100;

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

  const onResizeRight = (delta: number) => {
    store.update((state) => {
      const { width } = selectorChartDrawingArea(state);

      // TODO: What about non-cartesian axes? Are these the only ones that can be zoomed?
      const zoomOptions = selectorChartAxisZoomOptionsLookup(state, axisId);

      const newState = {
        ...state,
        zoom: {
          ...state.zoom,
          zoomData: state.zoom.zoomData.map((zoom) => {
            if (zoom.axisId === axisId) {
              const deltaZoom = (delta / width) * 100;

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
        x={(zoomData.start / 100) * drawingArea.width}
        width={(drawingArea.width * (zoomData.end - zoomData.start)) / 100}
        height={size}
      />
      {
        // TODO: In RTL languages, should we start from the right?
      }
      <ChartZoomBrushHandle
        x={(zoomData.start / 100) * drawingArea.width - PREVIEW_HANDLE_WIDTH / 2}
        y={(size - previewHandleHeight) / 2}
        width={PREVIEW_HANDLE_WIDTH}
        height={previewHandleHeight}
        onResize={onResizeLeft}
      />
      <ChartZoomBrushHandle
        x={(zoomData.end / 100) * drawingArea.width - PREVIEW_HANDLE_WIDTH / 2}
        y={(size - previewHandleHeight) / 2}
        width={PREVIEW_HANDLE_WIDTH}
        height={previewHandleHeight}
        onResize={onResizeRight}
      />
    </React.Fragment>
  );
}

// TODO: Test
function calculateZoomStart(
  newStart: number,
  currentZoom: ZoomData,
  options: DefaultizedZoomOptions,
) {
  const { minStart, minSpan, maxSpan } = options;

  return Math.max(
    minStart,
    currentZoom.end - maxSpan,
    Math.min(currentZoom.end - minSpan, newStart),
  );
}

function calculateZoomEnd(newEnd: number, currentZoom: ZoomData, options: DefaultizedZoomOptions) {
  const { maxEnd, minSpan, maxSpan } = options;

  return Math.min(
    maxEnd,
    currentZoom.start + maxSpan,
    Math.max(currentZoom.start + minSpan, newEnd),
  );
}
