import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';
import ChartContext from '../ChartContext';

const Bar = (props) => {
  const {
    areaKeys,
    data,
    dimensions: { boundedWidth, boundedHeight },
    padding,
    setSeriesMeta,
    stacked,
    xKey,
    xScale,
    yKey,
    yScale,
  } = useContext(ChartContext);

  const { data: dataProp, fill, series, label } = props;

  const chartData = dataProp || data[series] || data;

  let spacingBetweenTicks = 999;
  const ticks = xScale.ticks();
  for (let i = 1; i < ticks.length; i += 1) {
    spacingBetweenTicks = Math.min(spacingBetweenTicks, xScale(ticks[i]) - xScale(ticks[i - 1]));
  }

  let barWidth = boundedWidth/spacingBetweenTicks;

  useEffect(() => {
    const id = series || 0;
    setSeriesMeta((previousSeriesMeta) => ({
      ...previousSeriesMeta,
      [id]: { fill, label },
    }));
  }, [fill, label, series, setSeriesMeta]);

  if (series !== undefined && !stacked) {
    const numOfSeries = data.length;
    barWidth /= numOfSeries;
  }

  const getX = (d) => {
    let result = xScale(d[xKey]) - barWidth / 2;
    if (series !== undefined && !stacked) {
      result = xScale(d[xKey]);
      const numOfSeries = data.length;
      if (numOfSeries % 2 === 0) {
        // even num
        const center = numOfSeries / 2;
        if (series > center) {
          return result + (series - center) * barWidth;
        }
        return result - (center - series) * barWidth;
      }
      {
        const center = parseInt(numOfSeries / 2, 10);
        if (series === center) {
          return result - barWidth / 2;
        }
        if (series > center) {
          return result + (series - center) * barWidth - barWidth / 2;
        }
        return result - (center - series) * barWidth - barWidth / 2;
      }
    } else if (stacked && areaKeys) {
      return xScale(d.data[xKey]) - barWidth / 2;
    }

    return result;
  };

  const getY = (d) => {
    if (stacked && areaKeys) {
      const height = yScale(d[1]) - yScale(d[0]);
      return boundedHeight - yScale(d[0]) - height;
    }
    return boundedHeight - yScale(d[yKey]);
  };

  const getHeight = (d) => {
    if (stacked && areaKeys) {
      return yScale(d[1]) - yScale(d[0]);
    }
    return yScale(d[yKey]);
  };

  const getKey = (d) => {
    return `${d[xKey] || d.data[xKey]},${d[yKey] || d.data[yKey]}`;
  };
  return (
    <g>
      {chartData.map((d) => (
        <rect
          key={getKey(d)}
          fill={fill}
          x={getX(d)}
          y={getY(d)}
          height={getHeight(d)}
          width={barWidth}
        />
      ))}
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
  /**
   * The label for the bar to be used in the tooltip and legend.
   */
  label: PropTypes.string,
  /**
   * The data series to be plotted.
   */
  series: PropTypes.number,
};

export default Bar;
