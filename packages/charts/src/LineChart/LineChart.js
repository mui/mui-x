import * as React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { useForkRef } from '@material-ui/core/utils';
import ChartContext from '../ChartContext';
import useChartDimensions from '../hooks/useChartDimensions';
import useStackedArrays from '../hooks/useStackedArrays';
import useTicks from '../hooks/useTicks';
import useScale from '../hooks/useScale';
import useThrottle from '../hooks/useThrottle';
import { getExtent, getMaxDataSetLength } from '../utils';

const LineChart = React.forwardRef(function LineChart(props, ref) {
  const {
    areaKeys,
    children,
    data: dataProp,
    fill = 'none',
    highlightMarkers = false,
    invertMarkers = false,
    label,
    labelColor = '#777',
    labelFontSize = 18,
    margin: marginProp,
    markerShape = 'circle',
    markerSize = 30,
    pixelsPerTick = 50,
    seriesLabels = [],
    smoothed = false,
    stacked = false,
    xDomain: xDomainProp,
    xKey = 'x',
    xScaleType = 'linear',
    yDomain: yDomainProp,
    yKey = 'y',
    yScaleType = 'linear',
    ...other
  } = props;

  let data = dataProp;
  const stackedData = useStackedArrays(dataProp);
  if (stacked) {
    if (areaKeys) {
      const stackGen = d3.stack().keys(areaKeys);
      data = stackGen(dataProp);
    } else {
      data = stackedData;
    }
  }

  const margin = { top: 40, bottom: 40, left: 50, right: 30, ...marginProp };
  const chartSettings = {
    marginTop: margin.top,
    marginRight: margin.right,
    marginBottom: margin.bottom,
    marginLeft: margin.left,
  };
  const [chartRef, dimensions] = useChartDimensions(chartSettings);
  const handleRef = useForkRef(chartRef, ref);
  const { width, height, boundedWidth, boundedHeight, marginLeft, marginTop } = dimensions;
  const xDomain = xDomainProp || getExtent(data, (d) => d[xKey]);
  const yDomain = yDomainProp || getExtent(data, (d) => d[yKey]);
  const xRange = [0, boundedWidth];
  const yRange = [0, boundedHeight];
  const maxXTicks = getMaxDataSetLength(data) - 1;
  const xScale = useScale(xScaleType, xDomain, xRange);
  const yScale = useScale(yScaleType, yDomain, yRange);
  const xTicks = useTicks({
    range: xRange,
    scale: xScale,
    pixelsPerTick,
    maxTicks: maxXTicks,
  });
  const yTicks = useTicks({
    range: yRange,
    scale: yScale,
    pixelsPerTick,
    maxTicks: 999,
  });

  const [mousePosition, setMousePosition] = React.useState({
    x: -1,
    y: -1,
  });

  const handleMouseMove = useThrottle((event) => {
    setMousePosition({
      x: event.nativeEvent.offsetX - marginLeft,
      y: event.nativeEvent.offsetY - marginTop,
    });
  });

  const handleMouseOut = () => {
    setMousePosition({
      x: -1,
      y: -1,
    });
  };

  return (
    <ChartContext.Provider
      value={{
        areaKeys,
        data,
        dimensions,
        highlightMarkers,
        invertMarkers,
        markerShape,
        markerSize,
        seriesLabels,
        stacked,
        mousePosition,
        smoothed,
        xKey,
        xScale,
        xScaleType,
        xRange,
        xTicks,
        yKey,
        yRange,
        yScale,
        yScaleType,
        yTicks,
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        ref={handleRef}
        {...other}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
      >
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
});

LineChart.propTypes /* remove-proptypes */ = {
  /**
   * The area keys to use when stacking the data.
   */
  areaKeys: PropTypes.array,
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
   * The series labels. Used in the tooltip.
   */
  seriesLabels: PropTypes.array,
  /**
   * If `true`, the plotted lines will be smoothed.
   */
  smoothed: PropTypes.bool,
  /**
   * If `true`, the data will be stacked.
   */
  stacked: PropTypes.bool,
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
};

export default LineChart;
