import * as React from 'react';
import { useCartesianContext } from '../../../context/CartesianProvider';
import { DrawingAreaContext } from '../../../context/DrawingAreaProvider';
import { useDrawingArea } from '../../../hooks';
import ChartsPiecewiseGradient from './ChartsPiecewiseGradient';
import ChartsContinuousGradient from './ChartsContinuousGradient';
import { AxisId } from '../../../models/axis';

export function useChartGradient() {
  const { chartId } = React.useContext(DrawingAreaContext);
  return React.useCallback(
    (axisId: AxisId, direction: 'x' | 'y') => `${chartId}-gradient-${direction}-${axisId}`,
    [chartId],
  );
}

export function ChartsAxesGradients() {
  const { top, height, bottom, left, width, right } = useDrawingArea();

  const svgHeight = top + height + bottom;
  const svgWidth = left + width + right;
  const getGradientId = useChartGradient();
  const { xAxisIds, xAxis, yAxisIds, yAxis } = useCartesianContext();

  const filteredYAxisIds = yAxisIds.filter((axisId) => yAxis[axisId].colorMap !== undefined);
  const filteredXAxisIds = xAxisIds.filter((axisId) => xAxis[axisId].colorMap !== undefined);

  if (filteredYAxisIds.length === 0 && filteredXAxisIds.length === 0) {
    return null;
  }

  return (
    <defs>
      {filteredYAxisIds.map((axisId) => {
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
      {filteredXAxisIds.map((axisId) => {
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
