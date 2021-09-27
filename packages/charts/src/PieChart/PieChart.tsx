import React, { useState, useEffect } from 'react';
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
  expandOnHover?: boolean;
  /**
   * The radius at which to start the inside of the slice.
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
  /**
   * The angle from which to start rendering the first slice.
   */
  startAngle?: number;
}

const PieChart = React.forwardRef<SVGSVGElement, PieChartProps>(function PieChart(props, ref) {
  const {
    data,
    expandOnHover = false,
    innerRadius = 0,
    margin: marginProp,
    radius: radiusProp,
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

  const pie = d3
    .pie()
    .startAngle(startAngle)
    .endAngle(startAngle + percentVisible * Math.PI * 2)
    .value((d) => d.value);

  // From: https://codesandbox.io/s/drilldown-piechart-in-react-and-d3-d62y5
  useEffect(() => {
    d3.selection()
      .transition('pie-reveal')
      .duration(3000)
      .ease(d3.easeSinInOut)
      .tween('percentVisible', () => {
        const percentInterpolate = d3.interpolate(0, 100);
        return (t) => setPercentVisible(percentInterpolate(t));
      });
  }, [data]);

  const radius = radiusProp || Math.min(boundedWidth, boundedHeight) / 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} ref={handleRef} {...other}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {pie(data).map((d, i) => (
          <PieSlice
            data={d}
            key={i}
            radius={radius}
            innerRadius={innerRadius}
            expandOnHover={expandOnHover}
          />
        ))}
      </g>
    </svg>
  );
});

export default PieChart;
