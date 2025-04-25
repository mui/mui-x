'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useSkipAnimation } from '../hooks/useSkipAnimation';
import { useAnimateGaugeValueArc } from '../hooks/animation/useAnimateGaugeValueArc';
import { useGaugeState } from './GaugeProvider';

const StyledPath = styled('path', {
  name: 'MuiGauge',
  slot: 'ReferenceArc',
})(({ theme }) => ({
  fill: (theme.vars || theme).palette.primary.main,
}));

function GaugeValueArc(props: React.ComponentProps<'path'> & { skipAnimation?: boolean }) {
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

GaugeValueArc.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  skipAnimation: PropTypes.bool,
} as any;

export { GaugeValueArc };

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

AnimatedGaugeValueArc.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  cornerRadius: PropTypes.number.isRequired,
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  endAngle: PropTypes.number.isRequired,
  innerRadius: PropTypes.number.isRequired,
  outerRadius: PropTypes.number.isRequired,
  skipAnimation: PropTypes.bool,
  startAngle: PropTypes.number.isRequired,
} as any;
