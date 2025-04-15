'use client';
import * as React from 'react';
import {
  selectorChartDrawingArea,
  selectorChartMargin,
  useDrawingArea,
  useSelector,
  useStore,
  ZoomData,
} from '@mui/x-charts/internals';
import { styled } from '@mui/material/styles';
import { useXAxes } from '@mui/x-charts/hooks';
import { DEFAULT_X_AXIS_KEY } from '@mui/x-charts/constants';
import {
  selectorChartAxisZoomData,
  UseChartProZoomSignature,
} from '../internals/plugins/useChartProZoom';
import { ChartPreviewHandle } from './ChartPreviewHandle';

const PreviewBackgroundRect = styled('rect')(({ theme }) => ({
  '&': {
    fill: (theme.vars || theme).palette.grey[300],
    opacity: 0.8,
  },
}));

const ActivePreviewRect = styled('rect')(({ theme }) => ({
  '&': {
    fill: (theme.vars || theme).palette.grey[500],
    opacity: 0.4,
    cursor: 'grab',
  },
}));

export function ChartPreview({
  size = 30,
  axisId = DEFAULT_X_AXIS_KEY,
}: {
  size: number;
  axisId: string;
}) {
  const store = useStore();
  const xAxes = useXAxes();
  const drawingArea = useDrawingArea();
  const margin = useSelector(store, selectorChartMargin);
  const bottomAxes = Object.values(xAxes.xAxis).filter((axis) => axis.position === 'bottom');
  const bottomAxesHeight = bottomAxes.reduce((acc, axis) => acc + axis.height, 0);
  const zoomData = useSelector(store, selectorChartAxisZoomData, axisId);

  if (!zoomData) {
    return null;
  }

  return (
    <g
      x={drawingArea.left}
      y={drawingArea.top + drawingArea.height + bottomAxesHeight}
      width={drawingArea.width}
      height={margin.bottom}
    >
      <PreviewBackgroundRect
        x={drawingArea.left}
        y={drawingArea.top + drawingArea.height + bottomAxesHeight}
        height={margin.bottom}
        width={drawingArea.width}
      />
      <Preview size={size} zoomData={zoomData} axisId={axisId} />
    </g>
  );
}

function Preview({
  size = 30,
  axisId,
  zoomData,
}: {
  size: number;
  axisId: string;
  zoomData: ZoomData;
}) {
  const store = useStore<[UseChartProZoomSignature]>();
  const xAxes = useXAxes();
  const drawingArea = useDrawingArea();
  const bottomAxes = Object.values(xAxes.xAxis).filter((axis) => axis.position === 'bottom');
  const bottomAxesHeight = bottomAxes.reduce((acc, axis) => acc + axis.height, 0);
  const activePreviewRectRef = React.useRef<SVGRectElement>(null);
  const leftPreviewHandleRef = React.useRef<SVGRectElement>(null);
  const rightPreviewHandleRef = React.useRef<SVGRectElement>(null);

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

  React.useEffect(() => {
    const leftPreviewHandle = leftPreviewHandleRef.current;

    if (!leftPreviewHandle) {
      return;
    }

    let prevX = 0;

    const onPointerMove = (event: PointerEvent) => {
      store.update((state) => {
        const { width } = selectorChartDrawingArea(state);

        const zoom = selectorChartAxisZoomData(state, axisId);

        if (!zoom) {
          return state;
        }

        const deltaX = event.clientX - prevX;
        prevX = event.clientX;

        const deltaZoom = deltaX / width;

        const newState = {
          ...state,
          zoom: {
            ...state.zoom,
            zoomData: state.zoom.zoomData.map((data) => {
              if (data.axisId === axisId) {
                return {
                  ...data,
                  start: Math.max(0, Math.min(zoom.end, zoom.start + deltaZoom * 100)),
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
      prevX = 0;
    };

    const onPointerDown = (event: PointerEvent) => {
      event.stopPropagation();
      prevX = event.clientX;
      document.addEventListener('pointerup', onPointerUp);
      document.addEventListener('pointermove', onPointerMove);
    };

    leftPreviewHandle.addEventListener('pointerdown', onPointerDown);

    // eslint-disable-next-line consistent-return
    return () => {
      leftPreviewHandle.removeEventListener('pointerdown', onPointerDown);
    };
  }, [axisId, store]);

  React.useEffect(() => {
    const rightHandle = rightPreviewHandleRef.current;

    if (!rightHandle) {
      return;
    }

    let prevX = 0;

    const onPointerMove = (event: PointerEvent) => {
      store.update((state) => {
        const { width } = selectorChartDrawingArea(state);

        const zoom = selectorChartAxisZoomData(state, axisId);

        if (!zoom) {
          return state;
        }

        const deltaX = event.clientX - prevX;
        prevX = event.clientX;

        const deltaZoom = deltaX / width;

        const newState = {
          ...state,
          zoom: {
            ...state.zoom,
            zoomData: state.zoom.zoomData.map((data) => {
              if (data.axisId === axisId) {
                return {
                  ...data,
                  end: Math.min(100, Math.max(zoom.start, zoom.end + deltaZoom * 100)),
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
      prevX = 0;
    };

    const onPointerDown = (event: PointerEvent) => {
      event.stopPropagation();
      prevX = event.clientX;
      document.addEventListener('pointerup', onPointerUp);
      document.addEventListener('pointermove', onPointerMove);
    };

    rightHandle.addEventListener('pointerdown', onPointerDown);

    // eslint-disable-next-line consistent-return
    return () => {
      rightHandle.removeEventListener('pointerdown', onPointerDown);
    };
  }, [axisId, store]);

  return (
    <React.Fragment>
      <ChartPreviewHandle
        ref={leftPreviewHandleRef}
        x={drawingArea.left + (zoomData.start / 100) * drawingArea.width}
        y={drawingArea.top + drawingArea.height + bottomAxesHeight}
        height={size}
      />
      <ActivePreviewRect
        ref={activePreviewRectRef}
        x={drawingArea.left + (zoomData.start / 100) * drawingArea.width}
        y={drawingArea.top + drawingArea.height + bottomAxesHeight}
        width={(drawingArea.width * (zoomData.end - zoomData.start)) / 100}
        height={size}
      />
      <ChartPreviewHandle
        ref={rightPreviewHandleRef}
        x={drawingArea.left + (zoomData.end / 100) * drawingArea.width}
        y={drawingArea.top + drawingArea.height + bottomAxesHeight}
        height={size}
      />
    </React.Fragment>
  );
}
