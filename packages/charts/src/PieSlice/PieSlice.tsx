import React, { useState } from 'react';
import * as d3 from 'd3';

interface SliceData {
  data: { value: number; label?: string; fill: string; stroke?: string };
  endAngle: number;
  index: number;
  padAngle: number;
  startAngle: number;
  value: number;
}

export interface PieSliceProps {
  /**
   * The data to use for the slice.
   */
  data: SliceData;
  /**
   * If true, the slice will expand when hovered
   * @default false
   */
  expandOnHover: boolean;
  /**
   * The radius at which to start the inside of the slice.
   */
  innerRadius?: number;
  /**
   * The radius of the pie chart.
   */
  radius?: number;
}

function PieSlice(props: PieSliceProps) {
  const { data, expandOnHover, innerRadius = 0, radius = 100 } = props;
  const [radiusAdd, setRadiusAdd] = useState(0);
  const arc = d3
    .arc()
    .innerRadius(innerRadius + radiusAdd)
    .outerRadius(radius + radiusAdd);

  function mouseOver() {
    if (expandOnHover) {
      setRadiusAdd(((radius - innerRadius) / 100) * 10);
    }
  }

  function mouseOut() {
    setRadiusAdd(0);
  }

  return (
    <path
      style={{ fill: data.data.fill, stroke: data.data.stroke }}
      d={arc(data)}
      onMouseOver={mouseOver}
      onMouseOut={mouseOut}
    />
  );
}

export default PieSlice;
