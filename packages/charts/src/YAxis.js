import React, { useContext } from 'react';
import ChartContext from './ChartContext';

const YAxis = (props) => {
  const { dimensions, yTicks } = useContext(ChartContext);
  const {
    disableLine = false,
    disableTicks = false,
    fill = 'currentColor',
    fontSize = 10,
    label,
    labelFontSize = 14,
    // labels = [],
    // pixelsPerTick = 50,
    // scaleType,
    stroke = 'currentColor',
    tickSize: tickSizeProp = 6,
  } = props;

  const tickSize = disableTicks ? 4 : tickSizeProp;

  return (
    <g transform={`translate(0, ${dimensions.boundedHeight})`}>
      {!disableLine && (
        <line y2={-dimensions.boundedHeight} stroke={stroke} shapeRendering="crispEdges" />
      )}
      {yTicks.map(({ value, offset }, index) => (
        <g key={index} transform={`translate(0, ${-offset})`}>
          {!disableTicks && <line x2={-tickSize} stroke={stroke} shapeRendering="crispEdges" />}
          <text
            fill={fill}
            transform={`translate(-${tickSize + 4}, ${fontSize / 2 - 2})`}
            textAnchor="end"
            fontSize={fontSize}
          >
            {value}
          </text>
        </g>
      ))}
      {label && (
        <text
          fill={fill}
          transform={`translate(0, -${dimensions.boundedHeight + 14})`}
          fontSize={labelFontSize}
          textAnchor="end"
        >
          {label}
        </text>
      )}
    </g>
  );
};

export default YAxis;
