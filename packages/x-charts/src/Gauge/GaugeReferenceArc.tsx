'use client';
import * as React from 'react';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { useGaugeState } from './GaugeProvider';
import { gaugeClasses } from './gaugeClasses';

const StyledPath = styled('path', {
  name: 'MuiGauge',
  slot: 'ReferenceArc',
})(({ theme }) => ({
  fill: (theme.vars || theme).palette.divider,
}));

export function GaugeReferenceArc({ className, ...other }: React.ComponentProps<'path'>) {
  const { startAngle, endAngle, outerRadius, innerRadius, cornerRadius, cx, cy } = useGaugeState();

  return (
    <StyledPath
      className={clsx(gaugeClasses.referenceArc, className)}
      transform={`translate(${cx}, ${cy})`}
      d={
        d3Arc().cornerRadius(cornerRadius)({
          startAngle,
          endAngle,
          innerRadius,
          outerRadius,
        })!
      }
      {...other}
    />
  );
}
