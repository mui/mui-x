import React from 'react';
import useChartDimensions from '../hooks/useChartDimensions';
import ChartContext from '../ChartContext';
import useTicks from '../hooks/useTicks';
import useScale from '../hooks/useScale';
import { getExtent, getMaxDataSetLength } from '../utils';

const ScatterChart = (props) => {
  const {
    children,
    data,
    fill = 'none',
    invertMarkers = false,
    margin = { top: 40, bottom: 40, left: 50, right: 30 },
    markerShape = 'circle',
    pixelsPerTick = 50,
    xDomain: xDomainProp,
    xKey = 'x',
    xScaleType = 'linear',
    yDomain: yDomainProp,
    yKey = 'y',
    yScaleType = 'linear',
    zDomain: zDomainProp,
    zKey = 'z',
    ...other
  } = props;

  const chartSettings = {
    marginTop: margin.top,
    marginBottom: margin.bottom,
    marginLeft: margin.left,
    marginRight: margin.right,
  };

  const [ref, dimensions] = useChartDimensions(chartSettings);
  const { width, height, boundedWidth, boundedHeight, marginLeft, marginTop } = dimensions;
  const xDomain = xDomainProp || getExtent(data, (d) => d[xKey]);
  const yDomain = yDomainProp || getExtent(data, (d) => d[yKey]);
  const zDomain = zDomainProp || getExtent(data, (d) => d[zKey]);
  const xRange = [0, boundedWidth];
  const yRange = [0, boundedHeight];
  const maxXTicks = getMaxDataSetLength(data) - 1;
  const maxYTicks = 999; // TODO: get this from the data
  const xScale = useScale(xScaleType, xDomain, xRange);
  const yScale = useScale(yScaleType, yDomain, yRange);
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
        data,
        dimensions,
        invertMarkers,
        markerShape,
        xScale,
        xDomain,
        yScale,
        yDomain,
        zDomain,
        xKey,
        xRange: [0, boundedWidth],
        xTicks,
        yKey,
        yRange: [0, boundedHeight],
        yTicks,
        zKey,
      }}
    >
      <svg viewBox={`0 0 ${width} ${height}`} ref={ref} {...other}>
        <rect width={width} height={height} fill={fill} rx="4" />
        <g transform={`translate(${[marginLeft, marginTop].join(',')})`}>
          <g>{children}</g>
        </g>
      </svg>
    </ChartContext.Provider>
  );
};

export default ScatterChart;
