'use client';
import * as React from 'react';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import { type PieItemId } from '@mui/x-charts';

export type PieArcLabelProps = Omit<React.SVGProps<SVGTextElement>, 'ref' | 'color' | 'id'> & {
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  arcLabelRadius: number;
  cornerRadius: number;
  paddingAngle: number;
  formattedArcLabel?: string | null;
  seriesId: PieItemId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
};

const PieArcLabel = React.forwardRef<SVGTextElement, PieArcLabelProps>(
  function PieArcLabel(props, ref) {
    const {
      seriesId,
      dataIndex,
      color,
      startAngle,
      endAngle,
      paddingAngle,
      arcLabelRadius,
      innerRadius,
      outerRadius,
      cornerRadius,
      formattedArcLabel,
      isHighlighted,
      isFaded,
      style,
      ...other
    } = props;

    const [x, y] = d3Arc().cornerRadius(cornerRadius).centroid({
      padAngle: paddingAngle,
      startAngle,
      endAngle,
      innerRadius,
      outerRadius,
    });

    return (
      <text
        ref={ref}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        pointerEvents="none"
        fill="currentColor"
        {...other}
      >
        {formattedArcLabel}
      </text>
    );
  },
);

export { PieArcLabel };
