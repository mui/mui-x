'use client';
import { type PieItemId } from '@mui/x-charts';
import { useInteractionItemProps } from '@mui/x-charts/hooks/useInteractionItemProps';
import * as React from 'react';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';

export type PieArcProps = Omit<React.SVGProps<SVGPathElement>, 'ref' | 'id'> & {
  cornerRadius: number;
  endAngle: number;
  innerRadius: number;
  onClick?: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
  outerRadius: number;
  paddingAngle: number;
  startAngle: number;
  /**
   * If `true`, the default event handlers are disabled.
   * Those are used, for example, to display a tooltip or highlight the arc on hover.
   */
  skipInteraction?: boolean;
  seriesId: PieItemId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  isFocused: boolean;
  stroke?: string;
};

const PieArc = React.forwardRef<SVGPathElement, PieArcProps>(function PieArc(props, ref) {
  const {
    color,
    dataIndex,
    seriesId,
    isFaded,
    isHighlighted,
    isFocused,
    onClick,
    cornerRadius,
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    paddingAngle,
    skipInteraction,
    stroke,
    ...other
  } = props;

  const interactionProps = useInteractionItemProps(
    { type: 'pie', seriesId, dataIndex },
    skipInteraction,
  );
  const p = {
    cornerRadius,
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    paddingAngle,
  };

  const d = d3Arc().cornerRadius(p.cornerRadius)({
    padAngle: p.paddingAngle,
    innerRadius: p.innerRadius,
    outerRadius: p.outerRadius,
    startAngle: p.startAngle,
    endAngle: p.endAngle,
  })!;
  const visibility = p.startAngle === p.endAngle ? ('hidden' as const) : ('visible' as const);

  return (
    <path
      ref={ref}
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'unset'}
      fill={color}
      opacity={isFaded ? 0.3 : 1}
      filter={isHighlighted ? 'brightness(120%)' : 'none'}
      stroke={stroke}
      strokeWidth={1}
      strokeLinejoin="round"
      data-highlighted={isHighlighted || undefined}
      data-faded={isFaded || undefined}
      data-series={seriesId}
      data-index={dataIndex}
      d={d}
      visibility={visibility}
      {...other}
      {...interactionProps}
    />
  );
});

export { PieArc };
