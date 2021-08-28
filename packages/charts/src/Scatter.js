import React, { useContext } from 'react';
import * as d3 from 'd3';
import ChartContext from './ChartContext';

const plot = (value, domain, size) => {
  return ((value - domain[0]) / (domain[1] - domain[0])) * size;
};

const symbolNames = 'circle cross diamond square star triangle wye'.split(/ /);

const Scatter = (props) => {
  const {
    data,
    dimensions,
    invertMarkers: invertMarkersContext,
    markerSize,
    xKey: xKeyContext,
    xScale,
    yKey: yKeyContext,
    yScale,
    zKey: zKeyContext,
    zDomain: zDomainContext,
  } = useContext(ChartContext);

  const {
    data: dataProp,
    series,
    minSize = markerSize || 30,
    maxSize = 500,
    fill = 'inherit',
    invertMarkers = invertMarkersContext,
    shape = 'circle',
    stroke,
    strokeWidth,
    xKey = xKeyContext,
    yKey = yKeyContext,
    zKey = zKeyContext,
    zDomain = zDomainContext,
  } = props;

  const chartData = dataProp || data[series] || data;

  return (
    <g>
      {chartData.map(({ [xKey]: x, [yKey]: y, [zKey]: z }, i) => (
        <path
          d={d3.symbol(
            d3.symbols[symbolNames.indexOf(shape)],
            z ? plot(z, zDomain, maxSize - minSize) + minSize : minSize,
          )()}
          transform={`translate(${xScale(x)}, 
          ${dimensions.boundedHeight - yScale(y)})`}
          fill={invertMarkers ? stroke : fill}
          stroke={invertMarkers ? fill : stroke}
          strokeWidth={strokeWidth}
          key={i}
        />
      ))}
    </g>
  );
};

export default Scatter;
