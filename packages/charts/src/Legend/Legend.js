import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import ChartContext from '../ChartContext';
import { findObjects, isInRange } from '../utils';
import useTicks from '../hooks/useTicks';

function Legend(props) {
  const {
    data,
    dimensions: { boundedHeight, boundedWidth },
    mousePosition,
    markers,
    xKey,
    xScale,
    yKey,
  } = useContext(ChartContext);

  const {
    label,
    labelColor = '#777',
    labelFontSize = 18,
    stroke = 'rgba(200, 200, 200, 0.8)',
    strokeDasharray = '0',
    strokeWidth = 1,
  } = props;

  return (
    <g transform={`translate(0, ${boundedHeight})`} style={{ pointerEvents: 'none' }}>
      {offset !== undefined && (
        <g transform={`translate(${offset}, 0)`}>
          <text
            fill={labelColor}
            transform={`translate(${boundedWidth / 2}, ${50 - labelFontSize})`}
            fontSize={labelFontSize}
            textAnchor="middle"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
}

Legend.propTypes /* remove-proptypes */ = {
  /**
   * The label to display above the chart.
   */
  label: PropTypes.string,
  /**
   * The color of the label.
   */
  labelColor: PropTypes.string,
  /**
   * The font size of the label.
   */
  labelFontSize: PropTypes.number,
  // /**
  //  * The stroke color of the marker line.
  //  */
  // stroke: PropTypes.string,
  // /**
  //  * The stroke pattern of the marker line.
  //  */
  // strokeDasharray: PropTypes.string,
  // /**
  //  * The stroke width of the marker line.
  //  */
  // strokeWidth: PropTypes.number,
};

export default Legend;
