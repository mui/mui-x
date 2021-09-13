import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ChartContext from '../ChartContext';

const XAxis = (props) => {
  const {
    dimensions: { boundedHeight, boundedWidth },
    xTicks,
  } = useContext(ChartContext);
  const {
    disableLine = false,
    disableTicks = false,
    fill = 'currentColor',
    fontSize = 10,
    label,
    labelFontSize = 14,
    stroke = 'currentColor',
    tickSize: tickSizeProp = 6,
  } = props;

  const tickSize = disableTicks ? 4 : tickSizeProp;

  return (
    <g transform={`translate(0, ${boundedHeight})`}>
      {!disableLine && <line x2={boundedWidth} stroke={stroke} shapeRendering="crispEdges" />}
      {xTicks.map(({ value, offset }, index) => (
        <g key={index} transform={`translate(${offset}, 0)`}>
          {!disableTicks && <line y2={tickSize} stroke={stroke} shapeRendering="crispEdges" />}
          <text
            fill={fill}
            transform={`translate(0, ${fontSize + tickSize + 2})`}
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
          transform={`translate(${boundedWidth / 2}, ${fontSize + tickSize + 20})`}
          fontSize={labelFontSize}
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
};

XAxis.propTypes /* remove-proptypes */ = {
  /**
   * If true, the axia line is disabled.
   */
  disableLine: PropTypes.bool,
  /**
   * If true, the ticks are disabled.
   */
  disableTicks: PropTypes.bool,
  /**
   * The fill color of the axis text.
   */
  fill: PropTypes.string,
  /**
   * The font size of the axis text.
   */
  fontSize: PropTypes.number,
  /**
   * The label of the axis.
   */
  label: PropTypes.string,
  /**
   * The font size of the axis label.
   */
  labelFontSize: PropTypes.number,
  /**
   * The stroke color of the axis line.
   */
  stroke: PropTypes.string,
  /**
   * The size of the ticks.
   */
  tickSize: PropTypes.number,
};

export default XAxis;
