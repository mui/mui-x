import React, { useContext } from 'react';
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
    markerShape: markerShapeContext,
    smoothed: smoothedContext,
    stacked,
    xKey,
    xScale,
    yKey,
    yScale,
  } = useContext(ChartContext);

  const {
    fill,
    data: dataProp,
    markerShape = markerShapeContext,
    series,
    smoothed = smoothedContext,
    stroke = 'currentColor',
    strokeWidth = 1,
  } = props;

  const chartData = dataProp || data[series] || data;

  let linePath;
  let areaPath;
  let pointData = chartData;

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
        stroke={stroke}
        fill="none"
        strokeWidth={strokeWidth}
        transform={`translate(0, ${boundedHeight})`}
      />
      {markerShape !== 'none' && (
        <Scatter
          data={pointData}
          zDomain={[5, 5]}
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

export default Line;
