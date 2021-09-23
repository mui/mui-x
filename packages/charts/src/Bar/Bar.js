import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChartContext from '../ChartContext';

const Bar = (props) => {
  const {
    data,
    dimensions: { width, boundedHeight },
    xKey,
    xScale,
    yKey,
    yScale,
    stacked,
    areaKeys,
    padding,
  } = useContext(ChartContext);

  const {
    data: dataProp,
    fill,
    series,
  } = props;

  const chartData = dataProp || data[series] || data;

  let spacingBetweenTicks = 999;
  const ticks = xScale.ticks();
  for(let i = 1; i < ticks.length; i++) {
    spacingBetweenTicks = Math.min(spacingBetweenTicks, xScale(ticks[i]) - xScale(ticks[i - 1]));
  }

  let barWidth = spacingBetweenTicks - (stacked ? -padding : padding);

  if(series !== undefined && !stacked) {
    const numOfSeries = data.length;
    barWidth = barWidth/numOfSeries;
  }

  const getX = (d) => {
    let result = xScale(d[xKey]) - barWidth/2;
    if(series !== undefined && !stacked) {
      result = xScale(d[xKey]);
      const numOfSeries = data.length;
      if(numOfSeries%2 == 0) { // even num
        const center = numOfSeries/2;
        if(series > center) {
          return result + (series-center)*barWidth;
        } else {
          return result - (center-series)*barWidth;
        }
      } {
        const center = parseInt(numOfSeries/2);
        if(series === center) {
          return result - barWidth/2;
        } else if (series > center) {
          return result + (series-center)*barWidth - barWidth/2;
        } else {
          return result - (center-series)*barWidth - barWidth/2;
        }
      }
    } else if(stacked && areaKeys) {
      return xScale(d.data[xKey]) - barWidth/2;
    }

    return result;
  }

  const getY = (d) => {
    if (stacked && areaKeys) {
      const height = yScale(d[1]) - yScale(d[0]);
      return boundedHeight - yScale(d[0]) - height;
    } else {
      return boundedHeight - yScale(d[yKey]);
    }
  }

  const getHeight = (d) => {
    if (stacked && areaKeys) {
      return yScale(d[1]) - yScale(d[0]);
    } else {
      return yScale(d[yKey]);
    }
  }

  const getKey = (d) => {
    return `${d[xKey] || d.data[xKey]},${d[yKey] || d.data[yKey]}`;
  }
  return (
    <g>
      {chartData.map(d => <rect key={getKey(d)} fill={fill} x={getX(d)} y={getY(d)} height={getHeight(d)} width={barWidth}  />
)}
    </g>
  );
};

Bar.propTypes /* remove-proptypes */ = {
  /**
   * The data to be plotted. Either an array of objects, or nested arrays of objects.
   */
  data: PropTypes.array,
  /**
   * The color of the area under the bar.
   */
  fill: PropTypes.string,
};

export default Bar;
