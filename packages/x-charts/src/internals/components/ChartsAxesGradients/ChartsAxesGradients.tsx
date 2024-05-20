import * as React from 'react';
import { CartesianContext } from '../../../context/CartesianContextProvider';
import { DrawingContext } from '../../../context/DrawingProvider';
import { useDrawingArea } from '../../../hooks';
import ChartsPiecewiseGradient from './ChartsPiecewiseGradient';
import ChartsContinuousGradient from './ChartsContinuousGradient';

export function useChartGradient() {
  const { chartId } = React.useContext(DrawingContext);
  return React.useCallback(
    (axisId: string, direction: 'x' | 'y') => `${chartId}-gradient-${direction}-${axisId}`,
    [chartId],
  );
}

export function ChartsAxesGradients() {
  const { top, height, bottom, left, width, right } = useDrawingArea();

  const svgHeight = top + height + bottom;
  const svgWidth = left + width + right;
  const getGradientId = useChartGradient();
  const { xAxisIds, xAxis, yAxisIds, yAxis } = React.useContext(CartesianContext);

  return (
    <defs>
      {yAxisIds
        .filter((axisId) => yAxis[axisId].colorMap !== undefined)
        .map((axisId) => {
          const gradientId = getGradientId(axisId, 'y');
          const { colorMap, scale, colorScale, reverse } = yAxis[axisId];
          if (colorMap?.type === 'piecewise') {
            return (
              <ChartsPiecewiseGradient
                key={gradientId}
                isReversed={!reverse}
                scale={scale}
                colorMap={colorMap}
                size={svgHeight}
                gradientId={gradientId}
                direction="y"
              />
            );
          }
          if (colorMap?.type === 'continuous') {
            return (
              <ChartsContinuousGradient
                key={gradientId}
                isReversed={!reverse}
                scale={scale}
                colorScale={colorScale!}
                colorMap={colorMap}
                size={svgHeight}
                gradientId={gradientId}
                direction="y"
              />
            );
          }
          return null;
        })}
      {xAxisIds
        .filter((axisId) => xAxis[axisId].colorMap !== undefined)
        .map((axisId) => {
          const gradientId = getGradientId(axisId, 'x');
          const { colorMap, scale, reverse, colorScale } = xAxis[axisId];
          if (colorMap?.type === 'piecewise') {
            return (
              <ChartsPiecewiseGradient
                key={gradientId}
                isReversed={reverse}
                scale={scale}
                colorMap={colorMap}
                size={svgWidth}
                gradientId={gradientId}
                direction="x"
              />
            );
          }
          if (colorMap?.type === 'continuous') {
            return (
              <ChartsContinuousGradient
                key={gradientId}
                isReversed={reverse}
                scale={scale}
                colorScale={colorScale!}
                colorMap={colorMap}
                size={svgWidth}
                gradientId={gradientId}
                direction="x"
              />
            );
          }
          return null;
        })}
    </defs>
  );
}
