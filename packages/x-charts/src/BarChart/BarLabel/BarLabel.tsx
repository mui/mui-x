'use client';
import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { useAnimate } from '../../internals/animation/useAnimate';
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

type UseAnimateBarLabelParams = Pick<
  BarLabelProps,
  'x' | 'y' | 'width' | 'height' | 'layout' | 'skipAnimation'
> & {
  ref?: React.Ref<SVGTextElement>;
};
type UseAnimateBarLabelReturn = {
  ref: React.Ref<SVGTextElement>;
} & Pick<BarLabelProps, 'x' | 'y' | 'width' | 'height'>;
type BarLabelInterpolatedProps = Pick<UseAnimateBarLabelParams, 'x' | 'y' | 'width' | 'height'>;

function barLabelPropsInterpolator(from: BarLabelInterpolatedProps, to: BarLabelInterpolatedProps) {
  const interpolateX = interpolateNumber(from.x, to.x);
  const interpolateY = interpolateNumber(from.y, to.y);
  const interpolateWidth = interpolateNumber(from.width, to.width);
  const interpolateHeight = interpolateNumber(from.height, to.height);

  return (t: number) => {
    return {
      x: interpolateX(t),
      y: interpolateY(t),
      width: interpolateWidth(t),
      height: interpolateHeight(t),
    };
  };
}

export function useAnimateBarLabel(props: UseAnimateBarLabelParams): UseAnimateBarLabelReturn {
  const [firstRender, setFirstRender] = React.useState(true);
  const initialProps = {
    x: props.layout === 'vertical' ? props.x + props.width / 2 : props.x,
    y: props.layout === 'vertical' ? props.y + props.height : props.y + props.height / 2,
    width: props.width,
    height: props.height,
  };

  React.useEffect(() => {
    setFirstRender(false);
  }, []);

  const ref = useAnimate(
    {
      x: props.x + props.width / 2,
      y: props.layout === 'vertical' ? props.y + props.height / 2 : props.y + props.height / 2,
      width: props.width,
      height: props.height,
    },
    {
      createInterpolator: barLabelPropsInterpolator,
      applyProps(element, animatedProps) {
        element.setAttribute('x', animatedProps.x.toString());
        element.setAttribute('y', animatedProps.y.toString());
        element.setAttribute('width', animatedProps.width.toString());
        element.setAttribute('height', animatedProps.height.toString());
      },
      initialProps,
      skip: props.skipAnimation,
    },
  );

  // Only use the initial props on the first render.
  const usedProps = !props.skipAnimation && firstRender ? initialProps : props;

  return {
    ref,
    x: usedProps.x,
    y: usedProps.y,
    width: usedProps.width,
    height: usedProps.height,
  };
}

export type BarLabelProps = Omit<
  React.SVGProps<SVGTextElement>,
  'ref' | 'id' | 'x' | 'y' | 'width' | 'height'
> &
  BarLabelOwnerState & {
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
