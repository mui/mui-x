import * as React from 'react';
import { type ScaleBand } from '@mui/x-charts-vendor/d3-scale';
import { type DefaultizedHeatmapSeriesType } from '@mui/x-charts-pro/models';
import { type ChartDrawingArea, useZColorScale } from '@mui/x-charts/hooks';
import {
  selectorChartsIsFadedCallback,
  selectorChartsIsHighlightedCallback,
  useStore,
} from '@mui/x-charts/internals';
import { parseColor } from '../../utils/webgl/parseColor';

export function useHeatmapPlotData(
  drawingArea: ChartDrawingArea,
  series: DefaultizedHeatmapSeriesType,
  xScale: ScaleBand<{ toString(): string }>,
  yScale: ScaleBand<{ toString(): string }>,
) {
  const width = xScale.bandwidth();
  const height = yScale.bandwidth();
  const colorScale = useZColorScale()!;
  const store = useStore();
  const isHighlighted = store.use(selectorChartsIsHighlightedCallback);
  const isFaded = store.use(selectorChartsIsFadedCallback);

  return React.useMemo(() => {
    const centers = new Float32Array(series.data.length * 2);
    const colors = new Float32Array(series.data.length * 4);
    const saturations = new Float32Array(series.data.length);

    const xDomain = xScale.domain();
    const yDomain = yScale.domain();

    for (let dataIndex = 0; dataIndex < series.data.length; dataIndex += 1) {
      const [xIndex, yIndex, value] = series.data[dataIndex];

      const x = xScale(xDomain[xIndex]);
      const y = yScale(yDomain[yIndex]);
      const color = colorScale?.(value);

      if (x === undefined || y === undefined || !color) {
        continue;
      }

      centers[dataIndex * 2] = x + width / 2 - drawingArea.left;
      centers[dataIndex * 2 + 1] = y + height / 2 - drawingArea.top;

      const rgbColor = parseColor(color);

      colors[dataIndex * 4] = rgbColor[0];
      colors[dataIndex * 4 + 1] = rgbColor[1];
      colors[dataIndex * 4 + 2] = rgbColor[2];
      colors[dataIndex * 4 + 3] = 1.0;

      if (isHighlighted({ type: 'heatmap', seriesId: series.id, dataIndex, xIndex, yIndex })) {
        saturations[dataIndex] = 0.2;
      } else if (isFaded({ type: 'heatmap', seriesId: series.id, dataIndex, xIndex, yIndex })) {
        saturations[dataIndex] = -0.2;
      }
    }

    return { centers, colors, saturations };
  }, [
    colorScale,
    drawingArea.left,
    drawingArea.top,
    height,
    isFaded,
    isHighlighted,
    series.data,
    series.id,
    width,
    xScale,
    yScale,
  ]);
}
