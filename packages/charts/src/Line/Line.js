import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import ChartContext from '../ChartContext';
import Scatter from '../Scatter/Scatter';

function points(data, xKey) {
  return data.map((d) => ({ [xKey]: d.data[xKey], y: d[1] }));
}

const Line = (props) => {
  const {
    areaKeys,
    data,
    dimensions: { boundedHeight },
    highlightMarkers,
    lines,
    setLines,
    markerShape: markerShapeContext,
    smoothed: smoothedContext,
    stacked,
    xKey,
    xScale,
    yKey,
    yScale,
  } = useContext(ChartContext);

  const {
    data: dataProp,
    fill,
    markerShape = markerShapeContext,
    series,
    smoothed = smoothedContext,
    stroke = 'currentColor',
    strokeDasharray,
    strokeWidth = 1,
  } = props;

  const chartData = dataProp || data[series] || data;

  let linePath;
  let areaPath;
  let pointData = chartData;

  useEffect(() => {
    const id = series || 0;
    setLines({ ...lines, [id]: { markerShape, stroke } });
  }, [lines, markerShape, series, setLines, stroke]);

  if (stacked && areaKeys) {
    linePath = d3
      .line()
      .x((d) => xScale(d.data[xKey]))
      .y((d) => -yScale(d[1]));

    areaPath = d3
      .area()
      .x((d) => xScale(d.data[xKey]))
      .y0((d) => -yScale(d[0]))
      .y1((d) => -yScale(d[1]));

    pointData = points(chartData, xKey);
  } else {
    linePath = d3
      .line()
      .x((d) => xScale(d[xKey]))
      .y((d) => -yScale(d[yKey]));

    areaPath = d3
      .area()
      .x((d) => xScale(d[xKey]))
      .y1((d) => -yScale(d[yKey]))
      .y0(-yScale(yScale.domain()[0]));
  }

  if (smoothed) {
    const curve = d3.curveCatmullRom.alpha(0.5);
    linePath = linePath.curve(curve);
    areaPath = areaPath.curve(curve);
  }

  return (
    <g>
      {fill && (
        <path
          d={areaPath(chartData)}
          stroke="none"
          fill={fill}
          strokeWidth={strokeWidth}
          transform={`translate(0, ${boundedHeight})`}
        />
      )}
      <path
        d={linePath(chartData)}
        fill="none"
        stroke={stroke}
        strokeDasharray={strokeDasharray}
        strokeWidth={strokeWidth}
        transform={`translate(0, ${boundedHeight})`}
      />
      {(markerShape !== 'none' || highlightMarkers) && (
        <Scatter
          data={pointData}
          zDomain={[5, 5]}
          markerShape={markerShape}
          series={series}
          shape={markerShape}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="white"
        />
      )}
    </g>
  );
};

Line.propTypes /* remove-proptypes */ = {
  /**
   * The data to be plotted. Either an array of objects, or nested arrays of objects.
   */
  data: PropTypes.array,
  /**
   * The color of the area under the line.
   */
  fill: PropTypes.string,
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
   * The index of the series to be plotted.
   */
  series: PropTypes.number,
  /**
   * If true, the line will be smoothed.
   */
  smoothed: PropTypes.bool,
  /**
   * The stroke color of the marker line.
   */
  stroke: PropTypes.string,
  /**
   * The stroke pattern of the marker line.
   */
  strokeDasharray: PropTypes.string,
  /**
   * The stroke width of the marker line.
   */
  strokeWidth: PropTypes.number,
};

export default Line;
