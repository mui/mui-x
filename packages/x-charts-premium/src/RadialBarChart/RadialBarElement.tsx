'use client';
import * as React from 'react';
import clsx from 'clsx';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import { styled } from '@mui/material/styles';
import { type SeriesId } from '@mui/x-charts/internals';
import { type RadialBarClasses, useUtilityClasses } from './radialBarClasses';

type RadialBarElementProps = Omit<React.SVGProps<SVGPathElement>, 'ref'> & {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  classes?: Partial<RadialBarClasses>;
  onClick?: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
};

const RadialBarElementRoot = styled('path', {
  name: 'MuiRadialBarElement',
  slot: 'Root',
})();

function RadialBarElement(props: RadialBarElementProps) {
  const {
    seriesId,
    dataIndex,
    color,
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    className,
    classes: innerClasses,
    onClick,
    ...other
  } = props;

  const classes = useUtilityClasses({ classes: innerClasses });

  const d = d3Arc()({
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
  });

  return (
    <RadialBarElementRoot
      className={clsx(classes.element, className)}
      d={d ?? undefined}
      fill={color}
      stroke="none"
      onClick={onClick}
      cursor={onClick ? 'pointer' : undefined}
      data-index={dataIndex}
      {...other}
    />
  );
}

export { RadialBarElement };
