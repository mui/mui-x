import * as React from 'react';
import PropTypes from 'prop-types';
import { CartesianContext } from '../context/CartesianContextProvider';
import { DrawingContext } from '../context/DrawingProvider';
import useTicks from '../hooks/useTicks';
import { YAxisProps } from '../models/axis';

function YAxis(props: YAxisProps) {
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

YAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Id of the axis to render.
   */
  axisId: PropTypes.string.isRequired,
  /**
   * If true, the axis line is disabled.
   * @default false
   */
  disableLine: PropTypes.bool,
  /**
   * If true, the ticks are disabled.
   * @default false
   */
  disableTicks: PropTypes.bool,
  /**
   * The fill color of the axis text.
   * @default 'currentColor'
   */
  fill: PropTypes.string,
  /**
   * The font size of the axis text.
   * @default 12
   */
  fontSize: PropTypes.number,
  /**
   * The label of the axis.
   */
  label: PropTypes.string,
  /**
   * The font size of the axis label.
   * @default 14
   */
  labelFontSize: PropTypes.number,
  /**
   * Position of the axis.
   */
  position: PropTypes.oneOf(['left', 'right']),
  /**
   * The stroke color of the axis line.
   * @default 'currentColor'
   */
  stroke: PropTypes.string,
  /**
   * The size of the ticks.
   * @default 6
   */
  tickSize: PropTypes.number,
} as any;

export { YAxis };
