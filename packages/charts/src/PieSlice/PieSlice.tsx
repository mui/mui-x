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
   * The label for the slice.
   */
  label?: string;
  /**
   * The color of the label.
   * @default 'currentColor'
   */
  labelColor?: string;
  /**
   * The font size of the label.
   * @default '12px'
   */
  labelFontSize?: string;
  /**
   * The radius at which to place the label.
   */
  labelRadius?: number;
  /**
   * The radius of the pie chart.
   */
  radius?: number;
}

function PieSlice(props: PieSliceProps) {
  const {
    data,
    expandOnHover,
    innerRadius = 0,
    label,
    labelColor = 'currentColor',
    labelFontSize = '12px',
    labelRadius: labelRadiusProp,
    radius = 100,
  } = props;

  const [radiusAdd, setRadiusAdd] = useState(0);
  const labelRadius = labelRadiusProp ? labelRadiusProp * 2 + radiusAdd : radius + radiusAdd;
  const arc = d3
    .arc()
    .innerRadius(innerRadius + radiusAdd)
    .outerRadius(radius + radiusAdd);

  const labelArc = d3
    .arc()
    .innerRadius(innerRadius + radiusAdd)
    .outerRadius(labelRadius);

  function mouseOver() {
    if (expandOnHover) {
      setRadiusAdd(((radius - innerRadius) / 100) * 12);
    }
  }

  function mouseOut() {
    setRadiusAdd(0);
  }

  return (
    <React.Fragment>
      <path
        style={{ fill: data.data.fill, stroke: data.data.stroke }}
        d={arc(data)}
        onMouseOver={mouseOver}
        onMouseOut={mouseOut}
      />
      <text
        textAnchor="middle"
        fill={labelColor}
        fontSize={labelFontSize}
        transform={`translate(${labelArc.centroid(data)})`}
      >
        {label}
      </text>
    </React.Fragment>
  );
}

export default PieSlice;
