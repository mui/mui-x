import * as React from 'react';
import { useDrawingArea, useXAxes, useYAxes } from '../../../hooks';
import ChartsPiecewiseGradient from './ChartsPiecewiseGradient';
import ChartsContinuousGradient from './ChartsContinuousGradient';
import ChartsContinuousGradientObjectBound from './ChartsContinuousGradientObjectBound';
import { useZAxes } from '../../../hooks/useZAxis';
import {
  useChartGradientIdBuilder,
  useChartGradientIdObjectBoundBuilder,
} from '../../../hooks/useChartGradientId';

export function ChartsAxesGradients() {
  const { top, height, bottom, left, width, right } = useDrawingArea();

  const svgHeight = top + height + bottom;
  const svgWidth = left + width + right;

  const getGradientId = useChartGradientIdBuilder();
  const getObjectBoundGradientId = useChartGradientIdObjectBoundBuilder();

  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();
  const { zAxis, zAxisIds } = useZAxes();

  const filteredYAxisIds = yAxisIds.filter((axisId) => yAxis[axisId].colorMap !== undefined);
  const filteredXAxisIds = xAxisIds.filter((axisId) => xAxis[axisId].colorMap !== undefined);
  const filteredZAxisIds = zAxisIds.filter((axisId) => zAxis[axisId].colorMap !== undefined);

  if (
    filteredYAxisIds.length === 0 &&
    filteredXAxisIds.length === 0 &&
    filteredZAxisIds.length === 0
  ) {
    return null;
  }

  return (
    <defs>
      {filteredYAxisIds.map((axisId) => {
        const gradientId = getGradientId(axisId);
        const objectBoundGradientId = getObjectBoundGradientId(axisId);
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
            <React.Fragment key={gradientId}>
              <ChartsContinuousGradient
                isReversed={!reverse}
                scale={scale}
                colorScale={colorScale!}
                colorMap={colorMap}
                size={svgHeight}
                gradientId={gradientId}
                direction="y"
              />
              <ChartsContinuousGradientObjectBound
                isReversed={reverse}
                colorScale={colorScale!}
                colorMap={colorMap}
                gradientId={objectBoundGradientId}
              />
            </React.Fragment>
          );
        }
        return null;
      })}
      {filteredXAxisIds.map((axisId) => {
        const gradientId = getGradientId(axisId);
        const objectBoundGradientId = getObjectBoundGradientId(axisId);

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
            <React.Fragment key={gradientId}>
              <ChartsContinuousGradient
                isReversed={reverse}
                scale={scale}
                colorScale={colorScale!}
                colorMap={colorMap}
                size={svgWidth}
                gradientId={gradientId}
                direction="x"
              />
              <ChartsContinuousGradientObjectBound
                isReversed={reverse}
                colorScale={colorScale!}
                colorMap={colorMap}
                gradientId={objectBoundGradientId}
              />
            </React.Fragment>
          );
        }
        return null;
      })}
      {filteredZAxisIds.map((axisId) => {
        const objectBoundGradientId = getObjectBoundGradientId(axisId);
        const { colorMap, colorScale } = zAxis[axisId];
        if (colorMap?.type === 'continuous') {
          return (
            <ChartsContinuousGradientObjectBound
              key={objectBoundGradientId}
              colorScale={colorScale!}
              colorMap={colorMap}
              gradientId={objectBoundGradientId}
            />
          );
        }
        return null;
      })}
    </defs>
  );
}
