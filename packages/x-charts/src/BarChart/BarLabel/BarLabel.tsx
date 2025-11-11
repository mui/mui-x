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
    /**
     * The x-coordinate of the stack this bar label belongs to.
     */
    xOrigin: number;
    /**
     * The y-coordinate of the stack this bar label belongs to.
     */
    yOrigin: number;
    /**
     * Position in the x-axis of the bar this label belongs to.
     */
    x: number;
    /**
     * Position in the y-axis of the bar this label belongs to.
     */
    y: number;
    /**
     * Width of the bar this label belongs to.
     */
    width: number;
    /**
     * Height of the bar this label belongs to.
     */
    height: number;
    /**
     * The placement of the bar label.
     * It controls whether the label is rendered in the center or outside the bar.
     * @default 'center'
     */
    placement?: 'center' | 'outside';
  };

function BarLabel(inProps: BarLabelProps): React.JSX.Element {
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
    placement,
    ...otherProps
  } = props;

  const animatedProps = useAnimateBarLabel(props);
  const textAnchor = getTextAnchor(props);
  const dominantBaseline = getDominantBaseline(props);

  return (
    <BarLabelComponent
      textAnchor={textAnchor}
      dominantBaseline={dominantBaseline}
      {...otherProps}
      {...animatedProps}
    />
  );
}

function getTextAnchor({
  placement,
  layout,
  xOrigin,
  x,
}: Pick<
  BarLabelProps,
  'layout' | 'placement' | 'x' | 'y' | 'xOrigin' | 'yOrigin'
>): React.SVGAttributes<SVGTextElement>['textAnchor'] {
  if (placement === 'outside') {
    if (layout === 'horizontal') {
      return x < xOrigin ? 'end' : 'start';
    }

    return 'middle';
  }

  return 'middle';
}

function getDominantBaseline({
  placement,
  layout,
  yOrigin,
  y,
}: Pick<
  BarLabelProps,
  'layout' | 'placement' | 'x' | 'y' | 'xOrigin' | 'yOrigin'
>): React.SVGAttributes<SVGTextElement>['dominantBaseline'] {
  if (placement === 'outside') {
    if (layout === 'horizontal') {
      return 'central';
    }

    return y < yOrigin ? 'auto' : 'hanging';
  }

  return 'central';
}

BarLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  dataIndex: PropTypes.number.isRequired,
  /**
   * Height of the bar this label belongs to.
   */
  height: PropTypes.number.isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  layout: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  /**
   * The placement of the bar label.
   * It controls whether the label is rendered in the center or outside the bar.
   * @default 'center'
   */
  placement: PropTypes.oneOf(['center', 'outside']),
  seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  skipAnimation: PropTypes.bool.isRequired,
  /**
   * Width of the bar this label belongs to.
   */
  width: PropTypes.number.isRequired,
  /**
   * Position in the x-axis of the bar this label belongs to.
   */
  x: PropTypes.number.isRequired,
  /**
   * The x-coordinate of the stack this bar label belongs to.
   */
  xOrigin: PropTypes.number.isRequired,
  /**
   * Position in the y-axis of the bar this label belongs to.
   */
  y: PropTypes.number.isRequired,
  /**
   * The y-coordinate of the stack this bar label belongs to.
   */
  yOrigin: PropTypes.number.isRequired,
} as any;

export { BarLabel };
