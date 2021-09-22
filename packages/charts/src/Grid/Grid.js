import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ChartContext from '../ChartContext';

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
    stroke = 'rgba(200, 200, 200, 0.5',
    strokeDasharray = '0',
    strokeWidth = 1,
    zeroStroke: zeroStrokeProp,
    zeroStrokeDasharray: zeroStrokeDasharrayProp,
    zeroStrokeWidth: zeroStrokeWidthProp,
  } = props;

  const getStroke = (value) => (zeroStrokeProp && value === '0' ? zeroStrokeProp : stroke);
  const getStrokeWidth = (value) =>
    zeroStrokeWidthProp && value === '0' ? zeroStrokeWidthProp : strokeWidth;
  const getStrokeDasharray = (value) =>
    zeroStrokeDasharrayProp && value === '0' ? zeroStrokeDasharrayProp : strokeDasharray;

  return (
    <g>
      <rect width={boundedWidth} height={boundedHeight} fill={fill} />
      <g transform={`translate(0, ${boundedHeight})`}>
        {!disableX &&
          xTicks.map(({ offset, value }, index) => (
            <line
              key={index}
              x1={offset}
              x2={offset}
              y2={-boundedHeight}
              stroke={getStroke(value)}
              strokeWidth={getStrokeWidth(value)}
              strokeDasharray={getStrokeDasharray(value)}
              shapeRendering="crispEdges"
            />
          ))}
        {!disableY &&
          yTicks.map(({ offset, value }, index) => (
            <line
              key={index}
              x2={boundedWidth}
              y1={-offset}
              y2={-offset}
              stroke={getStroke(value)}
              strokeWidth={getStrokeWidth(value)}
              strokeDasharray={getStrokeDasharray(value)}
              shapeRendering="crispEdges"
            />
          ))}
      </g>
    </g>
  );
};

Grid.propTypes = {
  /**
   * Disable the x axis grid lines.
   */
  disableX: PropTypes.bool,
  /**
   * Disable the y axis grid lines
   */
  disableY: PropTypes.bool,
  /**
   * The fill color of the grid.
   */
  fill: PropTypes.string,
  /**
   * The stroke color of the grid.
   */
  stroke: PropTypes.string,
  /**
   * The stroke dash array of the grid.
   */
  strokeDasharray: PropTypes.string,
  /**
   * The stroke width of the grid.
   */
  strokeWidth: PropTypes.number,
  /**
   * The stroke color of the zero grid line.
   */
  zeroStroke: PropTypes.string,
  /**
   * The stroke dash array of the zero grid line.
   */
  zeroStrokeDasharray: PropTypes.string,
  /**
   * The stroke width of the zero grid line.
   */
  zeroStrokeWidth: PropTypes.number,
};

export default Grid;
