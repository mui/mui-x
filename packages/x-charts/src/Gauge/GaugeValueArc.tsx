'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useSkipAnimation } from '@mui/x-charts/hooks/useSkipAnimation';
import { useAnimateGaugeValueArc } from '../hooks/animation/useAnimateGaugeValueArc';
import { useGaugeState } from './GaugeProvider';

const StyledPath = styled('path', {
  name: 'MuiGauge',
  slot: 'ReferenceArc',
  overridesResolver: (props, styles) => styles.referenceArc,
})(({ theme }) => ({
  fill: (theme.vars || theme).palette.primary.main,
}));

export function GaugeValueArc(props: React.ComponentProps<'path'> & { skipAnimation?: boolean }) {
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
    <AnimatedGaugeValueArc
      {...props}
      cx={cx}
      cy={cy}
      startAngle={startAngle}
      endAngle={valueAngle}
      cornerRadius={cornerRadius}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
    />
  );
}

interface AnimatedGaugeValueArcProps extends React.ComponentProps<'path'> {
  cx: number;
  cy: number;
  startAngle: number;
  endAngle: number;
  cornerRadius: number;
  innerRadius: number;
  outerRadius: number;
  skipAnimation?: boolean;
}

function AnimatedGaugeValueArc({
  cx,
  cy,
  startAngle,
  endAngle,
  cornerRadius,
  innerRadius,
  outerRadius,
  skipAnimation: inSkipAnimation,
  ...other
}: AnimatedGaugeValueArcProps) {
  const skipAnimation = useSkipAnimation(inSkipAnimation);
  const animatedProps = useAnimateGaugeValueArc({
    startAngle,
    endAngle,
    cornerRadius,
    innerRadius,
    outerRadius,
    skipAnimation,
  });

  return <StyledPath {...animatedProps} transform={`translate(${cx}, ${cy})`} {...other} />;
}
