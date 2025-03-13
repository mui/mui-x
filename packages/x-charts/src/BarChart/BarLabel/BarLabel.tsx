'use client';
import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { interrupt, Transition } from '@mui/x-charts-vendor/d3-transition';
import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { select } from '@mui/x-charts-vendor/d3-selection';
import useForkRef from '@mui/utils/useForkRef';
import { BarLabelOwnerState } from './BarLabel.types';
import { barLabelClasses } from './barLabelClasses';

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
  [`&.${barLabelClasses.animate}`]: {
    transition: 'x 0.2s ease-in, y 0.2s ease-in, width 0.2s ease-in, height 0.2s ease-in',
  },
}));

export type BarLabelProps = Omit<
  React.SVGProps<SVGTextElement>,
  'ref' | 'id' | 'x' | 'y' | 'width' | 'height'
> &
  BarLabelOwnerState & {
    layout: 'vertical' | 'horizontal';
    x: number;
    y: number;
    width: number;
    height: number;
  };

const DURATION = 200;
function useAnimateProps(
  props: Pick<BarLabelProps, 'layout' | 'x' | 'y' | 'width' | 'height'>,
  { skip }: { skip: boolean },
) {
  const lastRef = React.useRef({
    x: props.layout === 'vertical' ? props.x + props.width / 2 : props.x + props.width,
    y: props.layout === 'vertical' ? props.y + props.height : props.y + props.height / 2,
    width: props.width,
    height: props.height,
  });
  const transitionRef = React.useRef<Transition<SVGTextElement, unknown, null, undefined>>(null);
  const [element, setElement] = React.useState<SVGTextElement | null>(null);

  React.useLayoutEffect(() => {
    /* If we're not skipping animation, we need to set the attribute to override React's changes.
     * Still need to figure out if this is better than asking the user not to pass the `d` prop to the component.
     * The problem with that is that SSR might not look good. */
    if (!skip && element) {
      element.setAttribute('x', lastRef.current.x.toString());
      element.setAttribute('y', lastRef.current.y.toString());
      element.setAttribute('width', lastRef.current.width.toString());
      element.setAttribute('height', lastRef.current.height.toString());
    }
  }, [element, skip]);

  React.useLayoutEffect(() => {
    // TODO: What if we set skipAnimation to true in the middle of the animation?
    if (element === null || skip) {
      return undefined;
    }

    const last = lastRef.current;
    const xInterpolator = interpolateNumber(last.x, props.x + props.width / 2);
    const yInterpolator = interpolateNumber(last.y, props.y + props.height / 2);
    const widthInterpolator = interpolateNumber(last.width, props.width);
    const heightInterpolator = interpolateNumber(last.height, props.height);

    transitionRef.current = select(element)
      .transition()
      .duration(DURATION)
      .attrTween('x', () => (t) => {
        const interpolatedX = xInterpolator(t);

        lastRef.current.x = interpolatedX;

        return interpolatedX.toString();
      })
      .attrTween('y', () => (t) => {
        const interpolatedY = yInterpolator(t);

        lastRef.current.y = interpolatedY;

        return interpolatedY.toString();
      })
      .attrTween('width', () => (t) => {
        const interpolatedWidth = widthInterpolator(t);

        lastRef.current.width = interpolatedWidth;

        return interpolatedWidth.toString();
      })
      .attrTween('height', () => (t) => {
        const interpolatedHeight = heightInterpolator(t);

        lastRef.current.height = interpolatedHeight;

        return interpolatedHeight.toString();
      });

    return () => interrupt(element);
  }, [element, props.height, props.width, props.x, props.y, skip]);

  return setElement;
}

const BarLabel = React.forwardRef<SVGTextElement, BarLabelProps>(function BarLabel(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiBarLabel' });

  const {
    seriesId,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    classes,
    skipAnimation,
    ...otherProps
  } = props;

  const animateRef = useAnimateProps(props, { skip: skipAnimation });
  const forkRef = useForkRef(ref, animateRef);

  return <BarLabelComponent {...otherProps} ref={forkRef} />;
});

BarLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  dataIndex: PropTypes.number.isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
} as any;

export { BarLabel };
