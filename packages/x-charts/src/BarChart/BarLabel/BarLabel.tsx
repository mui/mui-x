'use client';
import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useAnimateBarLabel } from '../../hooks/animation/useAnimateBarLabel';
import { barLabelClasses } from './barLabelClasses';
import { BarLabelOwnerState } from './BarLabel.types';

export const BarLabelComponent = styled('text', {
  name: 'MuiBarLabel',
  slot: 'Root',
  overridesResolver: (_, styles) => [
    { [`&.${barLabelClasses.faded}`]: styles.faded },
    { [`&.${barLabelClasses.highlighted}`]: styles.highlighted },
    styles.root,
  ],
})(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: 'none',
  fill: (theme.vars || theme)?.palette?.text?.primary,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  textAnchor: 'middle',
  dominantBaseline: 'central',
  pointerEvents: 'none',
  opacity: 1,
  [`&.${barLabelClasses.faded}`]: {
    opacity: 0.3,
  },
}));

export type BarLabelProps = Omit<
  React.SVGProps<SVGTextElement>,
  'ref' | 'id' | 'x' | 'y' | 'width' | 'height'
> &
  BarLabelOwnerState & {
    /** x-coordinate of the stack this bar label belongs to. */
    xOrigin: number;
    /** y-coordinate of the stack this bar label belongs to. */
    yOrigin: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };

function BarLabel(inProps: BarLabelProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiBarLabel' });

  const {
    seriesId,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    classes,
    skipAnimation,
    layout,
    xOrigin,
    yOrigin,
    ...otherProps
  } = props;

  const animatedProps = useAnimateBarLabel(props);

  return <BarLabelComponent {...otherProps} {...animatedProps} />;
}

BarLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  dataIndex: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  layout: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  skipAnimation: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
} as any;

export { BarLabel };
