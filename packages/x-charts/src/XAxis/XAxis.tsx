import * as React from 'react';
import PropTypes from 'prop-types';
import { CartesianContext } from '../context/CartesianContextProvider';
import { DrawingContext } from '../context/DrawingProvider';
import useTicks from '../hooks/useTicks';
import { XAxisProps } from '../models/axis';

function XAxis(props: XAxisProps) {
  const {
    xAxis: {
      [props.axisId]: { scale: xScale, ...settings },
    },
  } = React.useContext(CartesianContext);
  const {
    position = 'bottom',
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

  const xTicks = useTicks({ scale: xScale });

  const positionSigne = position === 'bottom' ? 1 : -1;

  return (
    <g transform={`translate(0, ${position === 'bottom' ? top + height : top})`}>
      {!disableLine && (
        <line
          x1={xScale.range()[0]}
          x2={xScale.range()[1]}
          stroke={stroke}
          shapeRendering="crispEdges"
        />
      )}

      {xTicks.map(({ value, offset }, index) => (
        <g key={index} transform={`translate(${offset}, 0)`}>
          {!disableTicks && (
            <line y2={positionSigne * tickSize} stroke={stroke} shapeRendering="crispEdges" />
          )}

          <text
            fill={fill}
            transform={`translate(0, ${positionSigne * (fontSize + tickSize + 2)})`}
            textAnchor="middle"
            fontSize={fontSize}
          >
            {value.toLocaleString()}
          </text>
        </g>
      ))}

      {label && (
        <text
          fill={fill}
          transform={`translate(${left + width / 2}, ${
            positionSigne * (fontSize + tickSize + 20)
          })`}
          fontSize={labelFontSize}
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
}

XAxis.propTypes = {
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
  position: PropTypes.oneOf(['bottom', 'top']),
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

export { XAxis };
