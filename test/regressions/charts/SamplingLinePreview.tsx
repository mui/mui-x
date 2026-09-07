import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';

// Deterministic peaky signal so the preview's point density is visible.
const DATA_LENGTH = 1024;
const data = Array.from({ length: DATA_LENGTH }, (_, i) => {
  const wave = Math.sin(i / 11) + 0.5 * Math.sin(i / 2.3);
  const spike = i % 97 === 0 ? 4 : 0;
  return wave + spike;
});
const xData = Array.from({ length: DATA_LENGTH }, (_, i) => i);

// Main chart is zoomed in with sampling on; the slider preview must still show the full-range
// series at its own (constant) density, not sampled against the active zoom.
export default function SamplingLinePreview() {
  return (
    <LineChartPro
      series={[{ data, showMark: false }]}
      xAxis={[{ data: xData, id: 'x', zoom: { slider: { enabled: true, preview: true } } }]}
      yAxis={[{ position: 'none' }]}
      width={500}
      height={300}
      sampling="m4"
      zoomData={[{ axisId: 'x', start: 80, end: 100 }]}
    />
  );
}
