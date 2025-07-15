'use client';
import * as React from 'react';
import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { useAnimate } from '../hooks/animation';
import { getRadius, GetRadiusData } from './getRadius';

function buildClipPath(
  size: number,
  borderRadius: number,
  ownerState: Omit<GetRadiusData, 'borderRadius'>,
) {
  const radiusData = { ...ownerState, borderRadius };
  const topLeft = Math.min(size, getRadius('top-left', radiusData));
  const topRight = Math.min(size, getRadius('top-right', radiusData));
  const bottomRight = Math.min(size, getRadius('bottom-right', radiusData));
  const bottomLeft = Math.min(size, getRadius('bottom-left', radiusData));

  return `inset(0px round ${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px)`;
}

type UseAnimateBarClipRectParams = Pick<
  BarClipRectProps,
  'x' | 'y' | 'width' | 'height' | 'skipAnimation'
> & {
  ref?: React.Ref<SVGRectElement>;
  borderRadius: number;
  ownerState: Omit<GetRadiusData, 'borderRadius'>;
};
type UseAnimateBarClipRectReturn = {
  ref: React.Ref<SVGRectElement>;
  style: React.CSSProperties;
} & Pick<BarClipRectProps, 'x' | 'y' | 'width' | 'height'>;
type BarClipRectInterpolatedProps = Pick<
  UseAnimateBarClipRectParams,
  'x' | 'y' | 'width' | 'height'
> & { borderRadius: number };

function barClipRectPropsInterpolator(
  from: BarClipRectInterpolatedProps,
  to: BarClipRectInterpolatedProps,
) {
  const interpolateX = interpolateNumber(from.x, to.x);
  const interpolateY = interpolateNumber(from.y, to.y);
  const interpolateWidth = interpolateNumber(from.width, to.width);
  const interpolateHeight = interpolateNumber(from.height, to.height);
  const interpolateBorderRadius = interpolateNumber(from.borderRadius, to.borderRadius);

  return (t: number) => {
    return {
      x: interpolateX(t),
      y: interpolateY(t),
      width: interpolateWidth(t),
      height: interpolateHeight(t),
      borderRadius: interpolateBorderRadius(t),
    };
  };
}

export function useAnimateBarClipRect(
  props: UseAnimateBarClipRectParams,
): UseAnimateBarClipRectReturn {
  const initialProps = {
    x: props.x,
    y: props.y + (props.ownerState.layout === 'vertical' ? props.height : 0),
    width: props.ownerState.layout === 'vertical' ? props.width : 0,
    height: props.ownerState.layout === 'vertical' ? 0 : props.height,
    borderRadius: props.borderRadius,
  };

  return useAnimate(
    {
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
      borderRadius: props.borderRadius,
    },
    {
      createInterpolator: barClipRectPropsInterpolator,
      transformProps: (p) => ({
        x: p.x,
        y: p.y,
        width: p.width,
        height: p.height,
        style: {
          clipPath: buildClipPath(
            props.ownerState.layout === 'vertical' ? p.height : p.width,
            p.borderRadius,
            props.ownerState,
          ),
        },
      }),
      applyProps(element: SVGRectElement, animatedProps) {
        element.setAttribute('x', animatedProps.x.toString());
        element.setAttribute('y', animatedProps.y.toString());
        element.setAttribute('width', animatedProps.width.toString());
        element.setAttribute('height', animatedProps.height.toString());
        element.style.clipPath = animatedProps.style.clipPath;
      },
      initialProps,
      skip: props.skipAnimation,
      ref: props.ref,
    },
  );
}

interface BarClipRectProps
  extends Pick<BarClipPathProps, 'x' | 'y' | 'width' | 'height' | 'skipAnimation'> {
  ownerState: GetRadiusData;
}

function BarClipRect(props: BarClipRectProps) {
  const animatedProps = useAnimateBarClipRect({
    ...props,
    borderRadius: props.ownerState.borderRadius ?? 0,
  });

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
  xOrigin: number;
  yOrigin: number;
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
      <path
        d={generateClipPath(
          props.hasNegative,
          props.hasPositive,
          props.layout ?? 'vertical',
          x,
          y,
          width,
          height,
          props.xOrigin,
          props.yOrigin,
          props.borderRadius,
        )}
      />
    </clipPath>
  );
}

function generateClipPath(
  hasNegative: boolean,
  hasPositive: boolean,
  layout: 'vertical' | 'horizontal',
  x: number,
  y: number,
  width: number,
  height: number,
  xOrigin: number,
  yOrigin: number,
  borderRadius: number,
) {
  const bR = Math.min(borderRadius, width / 2);

  if (layout === 'vertical') {
    if (hasPositive && hasNegative) {
      let path = '';
      path += `M${x},${y + height / 2} v${-(height / 2 - bR)} a${bR},${bR} 0 0 1 ${bR},${-bR} h${width - bR * 2} a${bR},${bR} 0 0 1 ${bR},${bR} v${height / 2 - bR} Z`;
      path += `M${x},${y + height / 2} v${height / 2 - bR} a${bR},${bR} 0 0 0 ${bR},${bR} h${width - bR * 2} a${bR},${bR} 0 0 0 ${bR},${-bR} v${-(height / 2 - bR)} Z`;
      return path;
    }

    if (hasPositive) {
      return `M${x},${yOrigin} v${-(yOrigin - y - bR)} a${bR},${bR} 0 0 1 ${bR},${-bR} h${width - bR * 2} a${bR},${bR} 0 0 1 ${bR},${bR} v${yOrigin - y - bR} Z`;
    }

    if (hasNegative) {
      return `M${x},${yOrigin} v${y + height - yOrigin - bR} a${bR},${bR} 0 0 0 ${bR},${bR} h${width - bR * 2} a${bR},${bR} 0 0 0 ${bR},${-bR} v${-(y + height - yOrigin - bR)} Z`;
    }
  }

  if (layout === 'horizontal') {
    const positiveStack = positiveStacks.get(id);

    if (positiveStack && positiveStack.seriesId === seriesId) {
      return `path("M0,0 h${width - bR} a${bR},${bR} 0 0 1 ${bR},${bR} v${height - bR * 2} a${bR},${bR} 0 0 1 -${bR},${bR} h-${width - bR} Z")`;
    }

    const negativeStack = negativeStacks.get(id);
    if (negativeStack && negativeStack.seriesId === seriesId) {
      return `path("M${width},0 h-${width - bR} a${bR},${bR} 0 0 0 -${bR},${bR} v${height - bR * 2} a${bR},${bR} 0 0 0 ${bR},${bR} h${width - bR} Z")`;
    }
  }

  return undefined;
}

export { BarClipPath };
