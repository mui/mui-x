import * as React from 'react';
import { ScatterPreview } from './previews/ScatterPreview';

export function ChartAxisZoomSliderChartPreview(props: {
  x: number;
  y: number;
  height: number;
  width: number;
}) {
  return <ScatterPreview {...props} />;
}
