import * as d3 from 'd3';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import ChartContext from '../ChartContext';
import { getSymbol, isInRange } from '../utils';

const plot = (value, domain, size) => {
  return ((value - domain[0]) / (domain[1] - domain[0])) * size;
};

const Scatter = (props) => {
  const {
    data,
    dimensions: { boundedHeight },
    highlightMarkers,
    invertMarkers: invertMarkersContext,
    markerShape: markerShapeContext,
    markerSize,
    mousePosition,
    xKey: xKeyContext,
    xScale,
    yKey: yKeyContext,
    yScale,
    zDomain: zDomainContext,
    zKey: zKeyContext,
  } = useContext(ChartContext);

  const {
    data: dataProp,
    fill = 'currentColor',
    invertMarkers = invertMarkersContext,
    markerShape = markerShapeContext,
    maxSize = 500,
    minSize = markerSize || 30,
    series,
    stroke,
    strokeDasharray,
    strokeWidth,
    xKey = xKeyContext,
    yKey = yKeyContext,
    zDomain = zDomainContext,
    zKey = zKeyContext,
  } = props;

  const chartData = dataProp || data[series] || data;

  const highlightMarker = (x) => {
    return (
      highlightMarkers &&
      isInRange(
        mousePosition.x,
        xScale(x),
        (xScale(chartData[1][xKey]) - xScale(chartData[0][xKey])) / 2,
      )
    );
  };

  return (
    <g>
      {chartData.map(
        ({ [xKey]: x, [yKey]: y, [zKey]: z }, i) =>
          (markerShape !== 'none' || highlightMarker(x)) && (
            <path
              d={d3.symbol(
                d3.symbols[getSymbol(markerShape, series)],
                z ? plot(z, zDomain, maxSize - minSize) + minSize : minSize,
              )()}
              transform={`translate(${xScale(x)}, 
          ${boundedHeight - yScale(y)})`}
              fill={
                (invertMarkers && !highlightMarker(x)) || (!invertMarkers && highlightMarker(x))
                  ? stroke
                  : fill
              }
              stroke={
                (invertMarkers && !highlightMarker(x)) || (!invertMarkers && highlightMarker(x))
                  ? fill
                  : stroke
              }
              strokeDasharray={strokeDasharray}
              strokeWidth={strokeWidth}
              key={i}
            />
          ),
      )}
    </g>
  );
};

Scatter.propTypes /* remove-proptypes */ = {
  /**
   * The data to be plotted. Either an array of objects, or nested arrays of objects.
   */
  data: PropTypes.array,
  /**
   * The fill color of the markers.
   */
  fill: PropTypes.string,
  /**
   * If `true`, the marker fill and stroke will be inverted.
   */

  invertMarkers: PropTypes.bool,
  /**
   * The shape of the markers.
   */
  markerShape: PropTypes.oneOf([
    'auto',
    'circle',
    'cross',
    'diamond',
    'square',
    'star',
    'triangle',
    'wye',
    'none',
  ]),
  /**
   * The maximum size of the markers.
   */
  maxSize: PropTypes.number,
  /**
   * The minimum size of the markers.
   */
  minSize: PropTypes.number,
  /**
   * For nested arrays, the series to be plotted.
   */
  series: PropTypes.number,
  /**
   * The stroke color of the marker line.
   */
  stroke: PropTypes.string,
  /**
   * The stroke pattern of the marker.
   */
  strokeDasharray: PropTypes.string,
  /**
   * The stroke width of the marker.
   */
  strokeWidth: PropTypes.number,
  xKey: PropTypes.string,
  yKey: PropTypes.string,
  zDomain: PropTypes.arrayOf(PropTypes.number),
  zKey: PropTypes.string,
};

export default Scatter;
