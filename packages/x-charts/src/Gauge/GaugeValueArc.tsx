import * as React from 'react';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import { styled } from '@mui/material/styles';
import { useGaugeState } from './GaugeProvider';

const StyledPath = styled('path', {
  name: 'MuiGauge',
  slot: 'ReferenceArc',
  overridesResolver: (props, styles) => styles.referenceArc,
})(({ theme }) => ({
  fill: (theme.vars || theme).palette.primary.main,
}));

export function GaugeValueArc(props: React.ComponentProps<'path'>) {
  const {
    value,
    valueMin,
    valueMax,
    startAngle,
    endAngle,
    outerRadius,
    innerRadius,
    cornerRadius,
    cx,
    cy,
  } = useGaugeState();

  if (value === null) {
    return null;
  }
  const valueAngle =
    startAngle + ((value - valueMin) / (valueMax - valueMin)) * (endAngle - startAngle);

  return (
    <StyledPath
      transform={`translate(${cx}, ${cy})`}
      d={
        d3Arc().cornerRadius(cornerRadius)({
          startAngle,
          endAngle: valueAngle,
          innerRadius,
          outerRadius,
        })!
      }
      {...props}
    />
  );
}
