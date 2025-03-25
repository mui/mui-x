'use client';
import * as React from 'react';
import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { useAnimate } from '../internals/animation/useAnimate';
import { getRadius, GetRadiusData } from './getRadius';

function buildClipPath(size: number, radiusData: GetRadiusData) {
  const topLeft = Math.min(size, getRadius('top-left', radiusData));
  const topRight = Math.min(size, getRadius('top-right', radiusData));
  const bottomRight = Math.min(size, getRadius('bottom-right', radiusData));
  const bottomLeft = Math.min(size, getRadius('bottom-left', radiusData));

  return `inset(0px round ${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px)`;
}

type UseAnimateBarClipRectParams = Pick<
  BarClipRectProps,
  'x' | 'y' | 'width' | 'height' | 'skipAnimation' | 'ownerState'
> & {
  ref?: React.Ref<SVGRectElement>;
};
type UseAnimateBarClipRectReturnValue = {
  ref: React.Ref<SVGRectElement>;
  style: React.CSSProperties;
} & Pick<BarClipRectProps, 'x' | 'y' | 'width' | 'height'>;
type BarClipRectInterpolatedProps = Pick<
  UseAnimateBarClipRectParams,
  'x' | 'y' | 'width' | 'height'
>;

function barClipRectPropsInterpolator(
  from: BarClipRectInterpolatedProps,
  to: BarClipRectInterpolatedProps,
) {
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

export function useAnimateBarClipRect(
  props: UseAnimateBarClipRectParams,
): UseAnimateBarClipRectReturnValue {
  const [firstRender, setFirstRender] = React.useState(true);
  const initialProps = {
    x: props.x,
    y: props.y + (props.ownerState.layout === 'vertical' ? props.height : 0),
    width: props.ownerState.layout === 'vertical' ? props.width : 0,
    height: props.ownerState.layout === 'vertical' ? 0 : props.height,
  };

  React.useEffect(() => {
    setFirstRender(false);
  }, []);

  const ref = useAnimate<BarClipRectInterpolatedProps, SVGRectElement>(
    {
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
    },
    {
      createInterpolator: barClipRectPropsInterpolator,
      applyProps(element, animatedProps) {
        element.setAttribute('x', animatedProps.x.toString());
        element.setAttribute('y', animatedProps.y.toString());
        element.setAttribute('width', animatedProps.width.toString());
        element.setAttribute('height', animatedProps.height.toString());

        element.style.clipPath = buildClipPath(
          props.ownerState.layout === 'vertical' ? animatedProps.height : animatedProps.width,
          props.ownerState,
        );
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
    style: {
      clipPath: buildClipPath(
        props.ownerState.layout === 'vertical' ? usedProps.height : usedProps.width,
        props.ownerState,
      ),
    },
  };
}

interface BarClipRectProps
  extends Pick<BarClipPathProps, 'x' | 'y' | 'width' | 'height' | 'skipAnimation'> {
  ownerState: GetRadiusData;
}

function BarClipRect(props: BarClipRectProps) {
  const animatedProps = useAnimateBarClipRect(props);

  return <rect {...animatedProps} />;
}

export interface BarClipPathProps {
  maskId: string;
  borderRadius?: number;
  hasNegative: boolean;
  hasPositive: boolean;
  layout?: 'vertical' | 'horizontal';
  x: number;
  y: number;
  width: number;
  height: number;
  skipAnimation: boolean;
}

/**
 * @ignore - internal component.
 */
function BarClipPath(props: BarClipPathProps) {
  const { maskId, x, y, width, height, skipAnimation, ...rest } = props;

  if (!props.borderRadius || props.borderRadius <= 0) {
    return null;
  }

  return (
    <clipPath id={maskId}>
      <BarClipRect
        ownerState={rest}
        x={x}
        y={y}
        width={width}
        height={height}
        skipAnimation={skipAnimation}
      />
    </clipPath>
  );
}

export { BarClipPath };
