import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import ChartContext from '../ChartContext';
import { getSymbol } from '../utils';

function Legend(props) {
  const {
    dimensions: { boundedHeight, boundedWidth },
    invertMarkers,
    lines,
  } = useContext(ChartContext);

  const { labelColor = '#777', labelFontSize = 12, spacing = 50 } = props;

  return (
    <g
      transform={`translate(${
        boundedWidth / 2 - ((Object.keys(lines).length - 1) * spacing) / 2
      }, ${boundedHeight + 68})`}
      style={{ pointerEvents: 'none' }}
    >
      {lines &&
        Object.keys(lines).map((series) => {
          const { fill = 'currentColor', label, markerShape, stroke = 'currentColor' } = lines[
            series
          ];
          return (
            <React.Fragment key={series}>
              <path
                d={d3.symbol(d3.symbols[getSymbol(markerShape, series)], 50)()}
                fill={invertMarkers ? stroke : fill}
                stroke={invertMarkers ? fill : stroke}
                transform={`translate(${series * spacing - spacing / 2}, -4)`}
              />
              <text
                fill={labelColor}
                transform={`translate(${series * spacing}, 0)`}
                fontSize={labelFontSize}
                textAnchor="middle"
              >
                {label}
              </text>
            </React.Fragment>
          );
        })}
    </g>
  );
}

Legend.propTypes /* remove-proptypes */ = {
  /**
   * The color of the label.
   */
  labelColor: PropTypes.string,
  /**
   * The font size of the label.
   */
  labelFontSize: PropTypes.number,
  /**
   * The spacing between the legend items.
   * @default 50
   *
   */
  spacing: PropTypes.number,
};

export default Legend;
