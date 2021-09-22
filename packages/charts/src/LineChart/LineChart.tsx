import * as React from 'react';
import * as d3 from 'd3';
import { useForkRef } from '@mui/material/utils';
import ChartContext from '../ChartContext';
import useChartDimensions from '../hooks/useChartDimensions';
import useStackedArrays from '../hooks/useStackedArrays';
import useTicks from '../hooks/useTicks';
import useScale from '../hooks/useScale';
import useThrottle from '../hooks/useThrottle';
import { getExtent, getMaxDataSetLength } from '../utils';

interface ChartData<X, Y> {
  x: X;
  y: Y;
}

interface Margin {
  bottom?: number;
  left?: number;
  right?: number;
  top?: number;
}

export interface LineChartProps<X = number, Y = number> {
  /**
   * The area keys to use when stacking the data.
   */
  areaKeys?: string[];
  /**
   * The content of the component.
   */
  children: React.ReactNode;
  /**
   * The data to use for the chart.
   */
  data: ChartData<X, Y>[];
  /**
   * The fill color to use for the area.
   */
  fill?: string;
  /**
   * The height of the chart.
   */
  height?: number;
  /**
   * If true, the markers will be highlighted when the mouse is over them.
   */
  highlightMarkers?: boolean;
  /**
   * Invert the line and fill colors of the point markers.
   */
  invertMarkers?: boolean;
  /**
   * The label to display above the chart.
   */
  label?: string;
  /**
   * The color of the label.
   */
  labelColor?: string;
  /**
   * The font size of the label.
   */
  labelFontSize?: number;
  /**
   * The margin to use.
   * Labels and axes fall within these margins.
   */
  margin?: Margin;
  /**
   * The shape of the markers.
   * If auto, the shape will be based on the data series.
   */
  markerShape?:
    | 'auto'
    | 'circle'
    | 'cross'
    | 'diamond'
    | 'square'
    | 'star'
    | 'triangle'
    | 'wye'
    | 'none';
  /**
   * The size of the markers.
   */
  markerSize?: number;
  /**
   * The maximum number of pixels per tick.
   */
  pixelsPerTick?: number;
  /**
   * The series labels. Used in the tooltip.
   */
  seriesLabels?: string[];
  /**
   * If `true`, the plotted lines will be smoothed.
   */
  smoothed?: boolean;
  /**
   * If `true`, the data will be stacked.
   */
  stacked?: boolean;
  /**
   * Override the calculated domain of the x axis.
   */
  xDomain?: string[];
  /**
   * The key to use for the x axis.
   */

  xKey?: string;
  /**
   * The scale type to use for the x axis.
   */
  xScaleType?: 'linear' | 'time' | 'log' | 'point' | 'pow' | 'sqrt' | 'utc';
  /**
   * Override the calculated domain of the y axis.
   */
  yDomain?: string[];
  /**
   * The key to use for the y axis.
   */
  yKey?: string;
  /**
   * The scale type to use for the y axis.
   */
  yScaleType?: 'linear' | 'time' | 'log' | 'point' | 'pow' | 'sqrt' | 'utc';
}

const LineChart = React.forwardRef<SVGSVGElement, LineChartProps>(function LineChart(props, ref) {
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
  const [lines, setLines] = React.useState([]);
  const { width, height, boundedWidth, boundedHeight, marginLeft, marginTop } = dimensions;
  const xDomain = xDomainProp || getExtent(data, (d) => d[xKey]);
  const yDomain = yDomainProp || getExtent(data, (d) => d[yKey]);
  const xRange = [0, boundedWidth];
  const yRange = [0, boundedHeight];
  const maxXTicks = getMaxDataSetLength(data) - 1;
  const xScale = useScale(xScaleType, xDomain, xRange);
  const yScale = useScale(yScaleType, yDomain, yRange);
  const xTicks = useTicks({
    scale: xScale,
    pixelsPerTick,
    maxTicks: maxXTicks,
  });
  const yTicks = useTicks({
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
        lines,
        markerShape,
        markerSize,
        seriesLabels,
        setLines,
        stacked,
        mousePosition,
        smoothed,
        xKey,
        xScale,
        xScaleType,
        xTicks,
        yKey,
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

export default LineChart;
