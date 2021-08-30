import React, { useContext } from 'react';
import ChartContext from '../ChartContext';

const isInRange = (num, target, range) => {
  const result = num >= Math.max(0, target - range) && num <= target + range;
  return result;
};
const Grid = (props) => {
  const {
    dimensions: { boundedWidth, boundedHeight },
    highlightMarkers,
    mousePosition,
    xScale,
    xTicks,
    yScale,
    yTicks,
  } = useContext(ChartContext);
  const {
    disableX = false,
    disableY = false,
    fill = 'none',
    highlightMarkerStroke = '#e0e0e0',
    stroke = 'rgba(200, 200, 200, 0.5)',
    strokeWidth = 1,
    strokeDasharray = '0',
    zeroStroke: zeroStrokeProp,
    zeroStrokeWidth: zeroStrokeWidthProp,
    zeroStrokeDasharray: zeroStrokeDasharrayProp,
  } = props;

  const getStroke = (value, scale = yScale) => {
    if (value === '0' && zeroStrokeProp) {
      return zeroStrokeProp;
    } else if (
      highlightMarkers &&
      isInRange(
        mousePosition.x,
        scale(value),
        (scale(xTicks[1].value) - scale(xTicks[0].value)) / 2,
      )
    ) {
      return highlightMarkerStroke;
    }
    return stroke;
  };
  const getStrokeWidth = (value) =>
    value === '0' && zeroStrokeWidthProp ? zeroStrokeWidthProp : strokeWidth;
  const getStrokeDasharray = (value) =>
    value === '0' && zeroStrokeDasharrayProp ? zeroStrokeDasharrayProp : strokeDasharray;

  return (
    <g>
      <rect width={boundedWidth} height={boundedHeight} fill={fill} />
      <g transform={`translate(0, ${boundedHeight})`}>
        {!disableX &&
          xTicks.map(({ offset, value }, index) => (
            <g key={index} transform={`translate(${offset}, 0)`}>
              <line
                y2={-boundedHeight}
                stroke={getStroke(value, xScale)}
                strokeWidth={getStrokeWidth(value, xScale)}
                strokeDasharray={getStrokeDasharray(value, xScale)}
                shapeRendering="crispEdges"
              />
            </g>
          ))}
        {!disableY &&
          yTicks.map(({ offset, value }, index) => (
            <g key={index} transform={`translate(0, ${-offset})`}>
              <line
                x2={boundedWidth}
                stroke={getStroke(value)}
                strokeWidth={getStrokeWidth(value)}
                strokeDasharray={getStrokeDasharray(value)}
                shapeRendering="crispEdges"
              />
            </g>
          ))}
      </g>
    </g>
  );
};

export default Grid;
