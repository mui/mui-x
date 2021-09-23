import * as d3 from 'd3';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import ChartContext from '../ChartContext';
import { getSymbol } from '../utils';

function Legend(props) {
  const {
    dimensions: { boundedHeight, boundedWidth },
    invertMarkers,
    seriesMeta,
  } = useContext(ChartContext);

  const { labelColor = '#777', labelFontSize = 12, spacing = 50, position = 'top' } = props;

  return (
    <g
      transform={`translate(${
        boundedWidth / 2 - ((Object.keys(seriesMeta).length - 1) * spacing) / 2
      }, ${position === 'top' ? 0 : boundedHeight + 68})`}
      style={{ pointerEvents: 'none' }}
    >
      {seriesMeta &&
        Object.keys(seriesMeta).map((series) => {
          const {
            fill = 'currentColor',
            label,
            markerShape,
            stroke = 'currentColor',
          } = seriesMeta[series];
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
  position: PropTypes.oneOf(['top', 'bottom']),
  /**
   * The spacing between the legend items.
   * @default 50
   *
   */
  spacing: PropTypes.number,
};

export default Legend;
