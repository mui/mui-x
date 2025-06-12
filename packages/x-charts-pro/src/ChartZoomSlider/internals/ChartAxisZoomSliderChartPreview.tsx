import * as React from 'react';
import { selectorChartSeriesProcessed, useSelector, useStore } from '@mui/x-charts/internals';
import { ScatterPreview } from './previews/ScatterPreview';
import { LinePreview } from './previews/LinePreview';

export function ChartAxisZoomSliderChartPreview(props: {
  x: number;
  y: number;
  height: number;
  width: number;
}) {
  const store = useStore();
  const processedSeries = useSelector(store, selectorChartSeriesProcessed);

  if ((processedSeries.line?.seriesOrder?.length ?? 0) > 0) {
    return <LinePreview {...props} />;
  }

  if ((processedSeries.scatter?.seriesOrder?.length ?? 0) > 0) {
    return <ScatterPreview {...props} />;
  }

  if ((processedSeries.bar?.seriesOrder?.length ?? 0) > 0) {
    return null; // TODO
  }

  return null;
}
