import React, { useState } from 'react';
import * as d3 from 'd3';

interface SegmentData {
  data: { value: number; label?: string; fill: string; stroke?: string };
  endAngle: number;
  index: number;
  padAngle: number;
  startAngle: number;
  value: number;
}

export interface PieSegmentProps {
  /**
   * The data to use for the segment.
   */
  data: SegmentData;
  /**
   * If true, the segment will expand when hovered
   * @default false
   */
  expandOnHover: boolean;
  /**
   * The radius at which to start the inside of the segment.
   * @default 0
   */
  innerRadius?: number;
  /**
   * The label for the segment.
   */
  label?: string;
  /**
   * The color of the label.
   * @default 'currentColor'
   */
  labelColor?: string;
  /**
   * The font size of the label.
   * @default 12
   */
  labelFontSize?: number;
  /**
   * The radius at which to place the label.
   */
  labelRadius?: number;
  /**
   * The radius of the pie chart.
   * @default 100
   */
  radius?: number;
}

function PieSegment(props: PieSegmentProps) {
  const {
    data,
    expandOnHover,
    innerRadius = 0,
    label,
    labelColor = 'currentColor',
    labelFontSize = 12,
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
      setRadiusAdd(((radius - innerRadius) / 100) * 10);
    }
  }

  function mouseOut() {
    setRadiusAdd(0);
  }

  return (
    <React.Fragment>
      <path
        fill={data.data.fill}
        stroke={data.data.stroke}
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

export default PieSegment;
