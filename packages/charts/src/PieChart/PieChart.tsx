import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { useForkRef } from '@mui/material/utils';
import useChartDimensions from '../hooks/useChartDimensions';
import PieSegment from '../PieSegment';

interface ChartData {
  value: number;
  label: string;
  fill: string;
}

interface Margin {
  bottom?: number;
  left?: number;
  right?: number;
  top?: number;
}

function ascending(a, b) {
  return a.value - b.value;
}

function descending(a, b) {
  return b.value - a.value;
}
export interface PieChartProps {
  /**
   * The data to use for the chart.
   */
  data: ChartData[];
  /**
   * If true, the segment will expand when hovered
   * @default false
   */
  expandOnHover?: boolean;
  /**
   * The radius at which to start the inside of the segment.
   */
  innerRadius?: number;
  /**
   * The label to display above the chart.
   */
  label?: string;
  /**
   * The color of the label.
   * @default 'currentColor'
   */
  labelColor?: string;
  /**
   * The font size of the label.
   * @default 18
   */
  labelFontSize?: number;
  /**
   * The margin to use around the chart.
   */
  margin?: Margin;
  /**
   * The radius of the pie chart.
   */
  radius?: number;
  /**
   * The color of the segment labels.
   * @default 'currentColor'
   */
  segmentLabelColor?: string;
  /**
   * The font size of the segment labels.
   * @default '12'
   */
  segmentLabelFontSize?: number;
  /**
   * The radius at which to place the segment label.
   */
  segmentLabelRadius?: number;
  /**
   * The sort order for the segments.
   */
  sort?: 'ascending' | 'descending';
  /**
   * The angle in degrees from which to start rendering the first segment.
   */
  startAngle?: number;
}

const PieChart = React.forwardRef<SVGSVGElement, PieChartProps>(function PieChart(props, ref) {
  const {
    data,
    expandOnHover = false,
    innerRadius = 0,
    label,
    labelColor = 'currentColor',
    labelFontSize = 18,
    margin: marginProp,
    radius: radiusProp,
    segmentLabelColor = 'currentColor',
    segmentLabelFontSize = 12,
    segmentLabelRadius,
    sort,
    startAngle = 0,
    ...other
  } = props;

  const margin = { top: 10, bottom: 10, left: 10, right: 10, ...marginProp };

  const chartSettings = {
    marginTop: margin.top,
    marginBottom: margin.bottom,
    marginLeft: margin.left,
    marginRight: margin.right,
  };

  const [chartRef, dimensions] = useChartDimensions(chartSettings);
  const { boundedHeight, boundedWidth, width, height } = dimensions;
  const handleRef = useForkRef(chartRef, ref);
  const [percentVisible, setPercentVisible] = useState(0);

  let sortOrder;

  if (sort === 'ascending') {
    sortOrder = ascending;
  } else if (sort === 'descending') {
    sortOrder = descending;
  }

  const pie = d3
    .pie()
    .startAngle((startAngle * Math.PI) / 180) // Degrees to radians
    .endAngle(startAngle + ((((360 - startAngle) * Math.PI) / 180) * percentVisible) / 100)
    .value((d) => d.value)
    .sort(sortOrder);

  // From: https://codesandbox.io/s/drilldown-piechart-in-react-and-d3-d62y5
  useEffect(() => {
    d3.selection()
      .transition('pie-reveal')
      .duration(500)
      .ease(d3.easeSinInOut)
      .tween('percentVisible', () => {
        const percentInterpolate = d3.interpolate(0, 100);
        return (t) => setPercentVisible(percentInterpolate(t));
      });
  }, [data]);

  const radius = radiusProp || Math.min(boundedWidth, boundedHeight) / 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} ref={handleRef} {...other}>
      <g
        transform={`translate(${boundedWidth / 2 + margin.left}, ${
          boundedHeight / 2 + margin.top
        })`}
      >
        {pie(data).map((d, i) => (
          <PieSegment
            data={d}
            expandOnHover={expandOnHover}
            innerRadius={innerRadius}
            label={d.data.label}
            labelColor={segmentLabelColor}
            labelFontSize={segmentLabelFontSize}
            labelRadius={segmentLabelRadius}
            key={i}
            radius={radius}
          />
        ))}
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
  );
});

export default PieChart;
