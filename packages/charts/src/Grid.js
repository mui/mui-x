import React, { useContext } from 'react';
import ChartContext from './ChartContext';

const Grid = (props) => {
  const {
    dimensions: { boundedWidth, boundedHeight },
    xTicks,
    yTicks,
  } = useContext(ChartContext);
  const {
    disableX = false,
    disableY = false,
    fill = 'none',
    stroke = '#dddddd',
    strokeWidth = 1,
    strokeDasharray = '0',
    zeroStroke: zeroStrokeProp,
    zeroStrokeWidth: zeroStrokeWidthProp,
    zeroStrokeDasharray: zeroStrokeDasharrayProp,
  } = props;

  const getStroke = (value) => (value === '0' && zeroStrokeProp ? zeroStrokeProp : stroke);
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
                stroke={getStroke(value)}
                strokeWidth={getStrokeWidth(value)}
                strokeDasharray={getStrokeDasharray(value)}
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
