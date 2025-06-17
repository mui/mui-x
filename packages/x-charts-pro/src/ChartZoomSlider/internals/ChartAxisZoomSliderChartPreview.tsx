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

export function ChartAxisZoomSliderChartPreview(props: {
  axisId: AxisId;
  x: number;
  y: number;
  height: number;
  width: number;
}) {
  const store = useStore();
  const processedSeries = useSelector(store, selectorChartSeriesProcessed);

  if ((processedSeries.line?.seriesOrder?.length ?? 0) > 0) {
    return (
      <React.Fragment>
        <AreaPreviewPlot {...props} />
        <LinePreviewPlot {...props} />
      </React.Fragment>
    );
  }

  if ((processedSeries.bar?.seriesOrder?.length ?? 0) > 0) {
    return <BarPreviewPlot {...props} />;
  }

  return null;
}
