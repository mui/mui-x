import * as React from 'react';
import { CartesianContext } from '../context/CartesianContextProvider';
import { DrawingContext } from '../context/DrawingProvider';
import useTicks from '../hooks/useTicks';
import { YAxisProps } from '../models/axis';

export function YAxis(props: YAxisProps) {
  const {
    yAxis: {
      [props.axisId]: { scale: yScale, ...settings },
    },
  } = React.useContext(CartesianContext);
  const {
    position = 'left',
    disableLine = false,
    disableTicks = false,
    fill = 'currentColor',
    fontSize = 10,
    label,
    labelFontSize = 14,
    stroke = 'currentColor',
    tickSize: tickSizeProp = 6,
  } = { ...settings, ...props };

  const { left, top, width, height } = React.useContext(DrawingContext);

  const tickSize = disableTicks ? 4 : tickSizeProp;

  const yTicks = useTicks({ scale: yScale });

  const positionSigne = position === 'right' ? 1 : -1;
  return (
    <g transform={`translate(${position === 'right' ? left + width : left}, 0)`}>
      {!disableLine && (
        <line
          y1={yScale.range()[0]}
          y2={yScale.range()[1]}
          stroke={stroke}
          shapeRendering="crispEdges"
        />
      )}
      {yTicks.map(({ value, offset }, index) => (
        <g key={index} transform={`translate(0, ${offset})`}>
          {!disableTicks && (
            <line x2={positionSigne * tickSize} stroke={stroke} shapeRendering="crispEdges" />
          )}
          <text
            fill={fill}
            transform={`translate(${positionSigne * (fontSize + tickSize + 2)}, 0)`}
            textAnchor="middle"
            fontSize={fontSize}
          >
            {value}
          </text>
        </g>
      ))}
      {label && (
        <text
          fill={fill}
          style={{}}
          transform={`translate(${positionSigne * (fontSize + tickSize + 20)}, ${
            top + height / 2
          }) rotate(${positionSigne * 90})`}
          fontSize={labelFontSize}
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
}
