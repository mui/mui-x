import * as React from 'react';
import { type AxisId, selectorChartSeriesProcessed, useStore } from '@mui/x-charts/internals';
import { seriesPreviewPlotMap } from './seriesPreviewPlotMap';

export interface ChartAxisZoomSliderPreviewContentProps {
  axisId: AxisId;
  x: number;
  y: number;
  height: number;
  width: number;
}

export function ChartAxisZoomSliderPreviewContent(props: ChartAxisZoomSliderPreviewContentProps) {
  const { axisId, x, y, width, height } = props;

  const store = useStore();
  const processedSeries = store.use(selectorChartSeriesProcessed);

  const children: React.JSX.Element[] = [];
  const clipId = `zoom-preview-mask-${axisId}`;

  for (const [seriesType, Component] of seriesPreviewPlotMap) {
    const hasSeries = (processedSeries[seriesType]?.seriesOrder?.length ?? 0) > 0;

    if (hasSeries) {
      children.push(<Component key={seriesType} {...props} />);
    }
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
