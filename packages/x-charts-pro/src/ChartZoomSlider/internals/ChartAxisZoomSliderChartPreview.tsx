import * as React from 'react';
import {
  AxisId,
  selectorChartAxisZoomOptionsLookup,
  selectorChartSeriesProcessed,
  useSelector,
  useStore,
  ZoomData,
} from '@mui/x-charts/internals';
import { LinePreviewPlot } from './previews/LinePreviewPlot';
import { AreaPreviewPlot } from './previews/AreaPreviewPlot';
import { BarPreviewPlot } from './previews/BarPreviewPlot';
import { ScatterPreviewPlot } from './previews/ScatterPreviewPlot';

interface ChartAxisZoomSliderChartPreviewProps {
  axisId: AxisId;
  x: number;
  y: number;
  height: number;
  width: number;
}

export function ChartAxisZoomSliderChartPreview(props: ChartAxisZoomSliderChartPreviewProps) {
  const { axisId, x, y, width, height } = props;

  const store = useStore();
  const processedSeries = useSelector(store, selectorChartSeriesProcessed);
  const zoomOptions = useSelector(store, selectorChartAxisZoomOptionsLookup, [axisId]);

  const zoomMap = new Map<AxisId, ZoomData>([
    [axisId, { axisId, start: zoomOptions.minStart, end: zoomOptions.maxEnd }],
  ]);

  const children: React.JSX.Element[] = [];
  const clipId = `zoom-preview-mask-${axisId}`;

  if ((processedSeries.line?.seriesOrder?.length ?? 0) > 0) {
    children.push(<AreaPreviewPlot key="area" {...props} zoomMap={zoomMap} />);
    children.push(<LinePreviewPlot key="line" {...props} zoomMap={zoomMap} />);
  }

  if ((processedSeries.bar?.seriesOrder?.length ?? 0) > 0) {
    children.push(<BarPreviewPlot key="bar" {...props} zoomMap={zoomMap} />);
  }

  if ((processedSeries.scatter?.seriesOrder?.length ?? 0) > 0) {
    children.push(<ScatterPreviewPlot key="scatter" {...props} zoomMap={zoomMap} />);
  }

  return (
    <React.Fragment>
      <clipPath id={clipId}>
        <rect x={x} y={y} width={width} height={height} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>{children}</g>
    </React.Fragment>
  );
}
