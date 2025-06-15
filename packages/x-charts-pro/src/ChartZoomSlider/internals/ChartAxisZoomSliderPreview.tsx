import * as React from 'react';
import { styled } from '@mui/material/styles';
import { AxisId, useSelector, useStore } from '@mui/x-charts/internals';
import { alpha } from '@mui/system';
import useId from '@mui/utils/useId';
import { selectorChartAxisZoomData } from '../../internals/plugins/useChartProZoom';
import { ChartAxisZoomSliderChartPreview } from './ChartAxisZoomSliderChartPreview';

const PreviewBackgroundRect = styled('rect')(({ theme }) => ({
  rx: 4,
  ry: 4,
  stroke: theme.palette.grey[700],
  fill: alpha(theme.palette.grey[700], 0.4),
}));

interface ChartAxisZoomSliderPreviewProps {
  axisId: AxisId;
  axisDirection: 'x' | 'y';
  reverse: boolean;
  x: number;
  y: number;
  height: number;
  width: number;
}

export function ChartAxisZoomSliderPreview({
  axisId,
  axisDirection,
  reverse,
  ...props
}: ChartAxisZoomSliderPreviewProps) {
  return (
    <g {...props}>
      <PreviewRectangles {...props} axisId={axisId} />
      <rect {...props} fill="transparent" rx={4} ry={4} />
      <ChartAxisZoomSliderChartPreview axisId={axisId} {...props} />
    </g>
  );
}

function PreviewRectangles({
  axisId,
  x,
  y,
  height,
  width,
}: {
  axisId: AxisId;
  x: number;
  y: number;
  height: number;
  width: number;
}) {
  const store = useStore();
  const zoomData = useSelector(store, selectorChartAxisZoomData, axisId);
  const id = useId();

  if (!zoomData) {
    return null;
  }

  const maskId = `zoom-preview-mask-${axisId}-${id}`;

  return (
    <React.Fragment>
      <mask id={maskId}>
        <rect x={x} y={y} width={width} height={height} fill="white" />
        <rect
          x={x + (zoomData.start / 100) * width}
          y={y}
          width={((zoomData.end - zoomData.start) / 100) * width}
          height={height}
          fill="black"
          rx={4}
          ry={4}
        />
      </mask>
      <PreviewBackgroundRect x={x} y={y} width={width} height={height} mask={`url(#${maskId})`} />
    </React.Fragment>
  );
}
