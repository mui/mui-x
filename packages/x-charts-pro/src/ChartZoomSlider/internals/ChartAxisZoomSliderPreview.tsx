import * as React from 'react';
import { styled } from '@mui/material/styles';
import { type AxisId, selectorChartAxisZoomOptionsLookup, useStore } from '@mui/x-charts/internals';
import { alpha } from '@mui/system';
import useId from '@mui/utils/useId';
import { selectorChartAxisZoomData } from '../../internals/plugins/useChartProZoom';
import { ChartAxisZoomSliderPreviewContent } from './ChartAxisZoomSliderPreviewContent';

const PreviewBackgroundRect = styled('rect', {
  slot: 'internal',
  shouldForwardProp: undefined,
})(({ theme }) => ({
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
      <PreviewRectangles {...props} axisId={axisId} axisDirection={axisDirection} />
      <rect {...props} fill="transparent" rx={4} ry={4} />
      <ChartAxisZoomSliderPreviewContent axisId={axisId} {...props} />
    </g>
  );
}

function PreviewRectangles(props: {
  axisId: AxisId;
  axisDirection: 'x' | 'y';
  x: number;
  y: number;
  height: number;
  width: number;
}) {
  const { axisId, axisDirection } = props;
  const store = useStore();

  const zoomData = store.use(selectorChartAxisZoomData, axisId);
  const zoomOptions = store.use(selectorChartAxisZoomOptionsLookup, axisId);
  const id = useId();

  if (!zoomData) {
    return null;
  }

  const maskId = `zoom-preview-mask-${axisId}-${id}`;

  let x;
  let y;
  let width;
  let height;

  const range = zoomOptions.maxEnd - zoomOptions.minStart;
  if (axisDirection === 'x') {
    x = props.x + ((zoomData.start - zoomOptions.minStart) / range) * props.width;
    y = props.y;
    width = ((zoomData.end - zoomData.start) / range) * props.width;
    height = props.height;
  } else {
    x = props.x;
    y = props.y + (1 - zoomData.end / range) * props.height;
    width = props.width;
    height = ((zoomData.end - zoomData.start) / range) * props.height;
  }

  return (
    <React.Fragment>
      <mask id={maskId}>
        <rect x={props.x} y={props.y} width={props.width} height={props.height} fill="white" />
        <rect x={x} y={y} width={width} height={height} fill="black" rx={4} ry={4} />
      </mask>
      <PreviewBackgroundRect
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
        mask={`url(#${maskId})`}
      />
    </React.Fragment>
  );
}
