import * as React from 'react';
import {
  selectorChartMargin,
  selectorChartZoomMap,
  useSelector,
  useStore,
} from '@mui/x-charts/internals';
import { styled } from '@mui/material/styles';
import { ChartPreviewHandle } from './ChartPreviewHandle';
import {
  DEFAULT_X_AXIS_KEY,
  ScatterPlot,
  useDrawingArea,
  useScatterSeriesContext,
  useXAxes,
} from '..';

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
  const xAxis = xAxes.xAxis[axisId];
  const zoomMap = useSelector(store, selectorChartZoomMap);
  const zoomState = zoomMap?.get(axisId);

  if (!zoomState) {
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
      <g
        data-testid="ChartPreview"
        transform={`translate(0 ${drawingArea.height + bottomAxesHeight + margin.bottom}) scale(1 ${size / drawingArea.height})`}
      >
        <ScatterPlot />
      </g>
      <ChartPreviewHandle
        x={drawingArea.left + (zoomState.start / 100) * drawingArea.width}
        y={drawingArea.top + drawingArea.height + bottomAxesHeight}
        height={size}
      />
      <ActivePreviewRect
        x={drawingArea.left + (zoomState.start / 100) * drawingArea.width}
        y={drawingArea.top + drawingArea.height + bottomAxesHeight}
        width={(drawingArea.width * (zoomState.end - zoomState.start)) / 100}
        height={size}
      />
      <ChartPreviewHandle
        x={drawingArea.left + (zoomState.end / 100) * drawingArea.width}
        y={drawingArea.top + drawingArea.height + bottomAxesHeight}
        height={size}
      />
    </g>
  );
}
