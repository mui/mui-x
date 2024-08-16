import * as React from 'react';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import { styled } from '@mui/material/styles';
import { useGaugeState } from './GaugeProvider';

const StyledPath = styled('path', {
  name: 'MuiGauge',
  slot: 'ReferenceArc',
  overridesResolver: (props, styles) => styles.referenceArc,
})(({ theme }) => ({
  fill: (theme.vars || theme).palette.divider,
}));

export function GaugeReferenceArc(props: React.ComponentProps<'path'>) {
  const { startAngle, endAngle, outerRadius, innerRadius, cornerRadius, cx, cy } = useGaugeState();

  return (
    <StyledPath
      transform={`translate(${cx}, ${cy})`}
      d={
        d3Arc().cornerRadius(cornerRadius)({
          startAngle,
          endAngle,
          innerRadius,
          outerRadius,
        })!
      }
      {...props}
    />
  );
}
