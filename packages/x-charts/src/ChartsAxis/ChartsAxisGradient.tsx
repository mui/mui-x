import * as React from 'react';
import { CartesianContext } from '../context/CartesianContextProvider';
import { DrawingContext } from '../context/DrawingProvider';
import { useDrawingArea } from '../hooks';

export function useChartGradient() {
  const { chartId } = React.useContext(DrawingContext);
  return React.useCallback(
    (axisId: string, direction: 'x' | 'y') => `${chartId}-graient-${direction}-${axisId}`,
    [chartId],
  );
}
export function ChartsAxisGradients() {
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
          const { colorMap, scale, reverse } = yAxis[axisId];
          if (colorMap?.type === 'piecewise') {
            return (
              <linearGradient
                key={gradientId}
                id={gradientId}
                x1="0"
                x2="0"
                {...(reverse
                  ? {
                      y1: 0,
                      y2: `${svgHeight}px`,
                    }
                  : { y2: 0, y1: `${svgHeight}px` })}
                gradientUnits="userSpaceOnUse" // Use the SVG coordinate instead of the component ones.
              >
                {colorMap.thresholds.map((threshold, index) => {
                  const y = scale(threshold);
                  const offset =
                    y !== undefined ? (reverse && y / svgHeight) || 1 - y / svgHeight : 0;

                  return (
                    <React.Fragment>
                      <stop offset={offset} stopColor={colorMap.colors[index]} stopOpacity={1} />
                      <stop
                        offset={offset}
                        stopColor={colorMap.colors[index + 1]}
                        stopOpacity={1}
                      />
                    </React.Fragment>
                  );
                })}
              </linearGradient>
            );
          }
          return null;
        })}
      {xAxisIds
        .filter((axisId) => xAxis[axisId].colorMap !== undefined)
        .map((axisId) => {
          const gradientId = getGradientId(axisId, 'x');
          const { colorMap, scale, reverse } = xAxis[axisId];
          if (colorMap?.type === 'piecewise') {
            return (
              <linearGradient
                key={gradientId}
                id={gradientId}
                {...(reverse
                  ? { x2: 0, x1: `${svgWidth}px` }
                  : {
                      x1: 0,
                      x2: `${svgWidth}px`,
                    })}
                y1="0"
                y2="0"
                gradientUnits="userSpaceOnUse" // Use the SVG coordinate instead of the component ones.
              >
                {colorMap.thresholds.map((threshold, index) => {
                  const x = scale(threshold); // The coordinate of of the origine
                  const off = x !== undefined ? (reverse && 1 - x / svgWidth) || x / svgWidth : 0;
                  return (
                    <React.Fragment>
                      <stop offset={off} stopColor={colorMap.colors[index]} stopOpacity={1} />
                      <stop offset={off} stopColor={colorMap.colors[index + 1]} stopOpacity={1} />
                    </React.Fragment>
                  );
                })}
              </linearGradient>
            );
          }
          return null;
        })}
    </defs>
  );
}
