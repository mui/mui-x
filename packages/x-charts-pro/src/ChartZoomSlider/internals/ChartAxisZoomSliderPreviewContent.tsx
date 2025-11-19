import * as React from 'react';
import {
  AxisId,
  selectorChartSeriesProcessed,
  useSelector,
  useStore,
} from '@mui/x-charts/internals';
import { LinePreviewPlot } from './previews/LinePreviewPlot';
import { AreaPreviewPlot } from './previews/AreaPreviewPlot';
import { BarPreviewPlot } from './previews/BarPreviewPlot';
import { ScatterPreviewPlot } from './previews/ScatterPreviewPlot';

interface ChartAxisZoomSliderPreviewContentProps {
  axisId: AxisId;
  x: number;
  y: number;
  height: number;
  width: number;
}

export function ChartAxisZoomSliderPreviewContent(props: ChartAxisZoomSliderPreviewContentProps) {
  const { axisId, x, y, width, height } = props;

  const store = useStore();
  const processedSeries = useSelector(store, selectorChartSeriesProcessed);

  const children: React.JSX.Element[] = [];
  const clipId = `zoom-preview-mask-${axisId}`;

  const hasLineSeries = (processedSeries.line?.seriesOrder?.length ?? 0) > 0;
  const hasBarSeries = (processedSeries.bar?.seriesOrder?.length ?? 0) > 0;
  const hasScatterSeries = (processedSeries.scatter?.seriesOrder?.length ?? 0) > 0;

  if (hasLineSeries) {
    children.push(<AreaPreviewPlot key="area" axisId={axisId} />);
  }

  if (hasBarSeries) {
    children.push(<BarPreviewPlot key="bar" {...props} />);
  }

  if (hasLineSeries) {
    children.push(<LinePreviewPlot key="line" axisId={axisId} />);
  }

  if (hasScatterSeries) {
    children.push(<ScatterPreviewPlot key="scatter" {...props} />);
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
