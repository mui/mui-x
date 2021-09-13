import React from 'react';
import PropTypes from 'prop-types';
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
    label,
    labelColor = '#777',
    labelFontSize = 18,
    margin: marginProp,
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

  const margin = { top: 40, bottom: 40, left: 50, right: 30, ...marginProp };
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
  const xScale = useScale(xScaleType, xDomain, xRange);
  const yScale = useScale(yScaleType, yDomain, yRange);
  const xTicks = useTicks({
    maxTicks: maxXTicks,
    pixelsPerTick,
    scale: xScale,
  });
  const yTicks = useTicks({
    scale: yScale,
    pixelsPerTick,
    maxTicks: 999,
  });

  return (
    <ChartContext.Provider
      value={{
        data,
        dimensions,
        invertMarkers,
        markerShape,
        xScale,
        yScale,
        zDomain,
        xKey,
        xTicks,
        yKey,
        yTicks,
        zKey,
      }}
    >
      <svg viewBox={`0 0 ${width} ${height}`} ref={ref} {...other}>
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
    </ChartContext.Provider>
  );
};

ScatterChart.propTypes /* remove-proptypes */ = {
  /**
   * The content of the component.
   */
  children: PropTypes.node.isRequired,
  /**
   * The data to use for the chart.
   */
  data: PropTypes.array,
  /**
   * The fill color to use for the area.
   */
  fill: PropTypes.string,
  /**
   * The height of the chart.
   */
  height: PropTypes.number,
  /**
   * If true, the markers will be highlighted when the mouse is over them.
   */
  highlightMarkers: PropTypes.bool,
  /**
   * Invert the line and fill colors of the point markers.
   */
  invertMarkers: PropTypes.bool,
  /**
   * The label to display above the chart.
   */
  label: PropTypes.string,
  /**
   * The color of the label.
   */
  labelColor: PropTypes.string,
  /**
   * The font size of the label.
   */
  labelFontSize: PropTypes.number,
  /**
   * The margin to use.
   * Labels and axes fall within these margins.
   */
  margin: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
  /**
   * The shape of the markers.
   * If auto, the shape will be based on the data series.
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
   * The size of the markers.
   */
  markerSize: PropTypes.number,
  /**
   * The maximum number of pixels per tick.
   */
  pixelsPerTick: PropTypes.number,
  /**
   * Override the calculated domain of the x axis.
   */
  xDomain: PropTypes.array,
  /**
   * The key to use for the x axis.
   */

  xKey: PropTypes.string,
  /**
   * The scale type to use for the x axis.
   */
  xScaleType: PropTypes.oneOf(['linear', 'time', 'log', 'point', 'pow', 'sqrt', 'utc']),
  /**
   * Override the calculated domain of the y axis.
   */
  yDomain: PropTypes.array,
  /**
   * The key to use for the y axis.
   */

  yKey: PropTypes.string,
  /**
   * The scale type to use for the y axis.
   */
  yScaleType: PropTypes.oneOf(['linear', 'time', 'log', 'point', 'pow', 'sqrt', 'utc']),
  /**
   * Override the calculated domain of the z axis.
   */
  zDomain: PropTypes.array,
  /**
   * The key to use for the z axis.
   * If `null`, the z axis will not be displayed.
   */

  zKey: PropTypes.string,
};

export default ScatterChart;
