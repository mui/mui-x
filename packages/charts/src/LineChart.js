import React from 'react';
import * as d3 from 'd3';
import useChartDimensions from './hooks/useChartDimensions';
import ChartContext from './ChartContext';
import useStackedArrays from './hooks/useStackedArrays';
import useTicks from './hooks/useTicks';
import useScale from './hooks/useScale';
import { getExtent, getMaxDataSetLength } from './utils';

const LineChart = (props) => {
  const {
    areaKeys,
    children,
    data: dataProp,
    fill = 'none',
    label,
    labelFontSize = 18,
    labelColor = '#777',
    margin: marginProp,
    markerShape = 'circle',
    markerSize = 30,
    invertMarkers = false,
    pixelsPerTick = 50,
    smoothed,
    stacked,
    xDomain: xDomainProp,
    xKey = 'x',
    xScaleType = 'linear',
    yDomain: yDomainProp,
    yKey = 'y',
    yScaleType = 'linear',
  } = props;

  let data = dataProp;
  if (stacked) {
    if (areaKeys) {
      const stackGen = d3.stack().keys(areaKeys);
      data = stackGen(data);
    } else {
      data = useStackedArrays(dataProp);
    }
  }

  const margin = { top: 40, bottom: 40, left: 50, right: 30, ...marginProp };
  const chartSettings = {
    marginTop: margin.top,
    marginRight: margin.right,
    marginBottom: margin.bottom,
    marginLeft: margin.left,
  };
  const [ref, dimensions] = useChartDimensions(chartSettings);
  const { width, height, boundedWidth, boundedHeight, marginLeft, marginTop } = dimensions;
  const xDomain = xDomainProp || getExtent(data, (d) => d[xKey]);
  const yDomain = yDomainProp || getExtent(data, (d) => d[yKey]);
  const xRange = [0, boundedWidth];
  const yRange = [0, boundedHeight];
  const maxXTicks = getMaxDataSetLength(data) - 1;
  const maxYTicks = 999; // TODO: get this from the data
  const xScale = useScale(xScaleType, xDomainProp || xDomain, xRange);
  const yScale = useScale(yScaleType, yDomainProp || yDomain, yRange);
  const xTicks = useTicks({
    domain: xDomain,
    range: xRange,
    scaleType: xScaleType,
    pixelsPerTick,
    maxTicks: maxXTicks,
  });
  const yTicks = useTicks({
    domain: yDomain,
    range: yRange,
    scaleType: yScaleType,
    pixelsPerTick,
    maxTicks: maxYTicks,
  });

  return (
    <ChartContext.Provider
      value={{
        areaKeys,
        data,
        dimensions,
        invertMarkers,
        markerShape,
        markerSize,
        stacked,
        maxXTicks,
        maxYTicks,
        smoothed,
        xDomain,
        xKey,
        xScale,
        xScaleType,
        xRange,
        xTicks,
        yDomain,
        yKey,
        yRange,
        yScale,
        yScaleType,
        yTicks,
      }}
    >
      <div ref={ref} style={{ height: '400px' }}>
        <svg viewBox={`0 0 ${width} ${height}`}>
          <rect width={width} height={height} fill={fill} rx="4" />
          <g transform={`translate(${[marginLeft, marginTop].join(',')})`}>
            <g>{children}</g>
          </g>
          {label && (
            <text
              fill={labelColor}
              transform={`translate(${width / 2}, ${50 - labelFontSize})`}
              fontSize={labelFontSize}
              textAnchor="middle"
            >
              {label}
            </text>
          )}
        </svg>
      </div>
    </ChartContext.Provider>
  );
};

export default LineChart;
