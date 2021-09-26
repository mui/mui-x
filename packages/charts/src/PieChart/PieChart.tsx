import React from 'react';
import * as d3 from 'd3';
import { useForkRef } from '@mui/material/utils';
import useChartDimensions from '../hooks/useChartDimensions';
import PieSlice from '../PieSlice';

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

export interface PieChartProps {
  /**
   * The data to use for the chart.
   */
  data: ChartData[];
  /**
   * If true, the slice will expand when hovered
   * @default false
   */
  innerRadius?: number;
  /**
   * The margin to use around the chart.
   * Labels and fall within these margins.
   */
  margin?: Margin;
  /**
   * The radius of the pie chart.
   */
  radius?: number;
}

const PieChart = React.forwardRef<SVGSVGElement, PieChartProps>(function PieChart(props, ref) {
  const { data, innerRadius = 0, margin: marginProp, radius: radiusProp, ...other } = props;

  const margin = { top: 50, bottom: 50, left: 50, right: 50, ...marginProp };
  const chartSettings = {
    marginTop: margin.top,
    marginBottom: margin.bottom,
    marginLeft: margin.left,
    marginRight: margin.right,
  };

  const [chartRef, dimensions] = useChartDimensions(chartSettings);
  const { boundedHeight, boundedWidth, width, height } = dimensions;
  const handleRef = useForkRef(chartRef, ref);

  const pie = d3.pie().value((d) => d.value);

  const radius = radiusProp || Math.min(boundedWidth, boundedHeight) / 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} ref={handleRef} {...other}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {pie(data).map((d, i) => (
          <PieSlice data={d} key={i} radius={radius} innerRadius={innerRadius} />
        ))}
      </g>
    </svg>
  );
});

export default PieChart;
