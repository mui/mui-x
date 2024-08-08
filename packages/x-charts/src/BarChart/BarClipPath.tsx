import * as React from 'react';
import { SpringValue, animated } from '@react-spring/web';
import { getRadius } from './getRadius';

const buildInset = (corners: {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}) =>
  `inset(0px round ${corners.topLeft}px ${corners.topRight}px ${corners.bottomRight}px ${corners.bottomLeft}px)`;

function BarClipRect(props: Record<string, any>) {
  const radiusData = props.ownerState;

  return (
    <animated.rect
      style={{
        ...props.style,
        clipPath: (
          (props.ownerState.layout === 'vertical'
            ? props.style?.height
            : props.style?.width) as SpringValue<number>
        ).to((value) =>
          buildInset({
            topLeft: Math.min(value, getRadius('top-left', radiusData)),
            topRight: Math.min(value, getRadius('top-right', radiusData)),
            bottomRight: Math.min(value, getRadius('bottom-right', radiusData)),
            bottomLeft: Math.min(value, getRadius('bottom-left', radiusData)),
          }),
        ),
      }}
    />
  );
}

export interface BarClipPathProps {
  maskId: string;
  borderRadius?: number;
  hasNegative: boolean;
  hasPositive: boolean;
  layout?: 'vertical' | 'horizontal';
  style: {};
}

/**
 * @ignore - internal component.
 */
function BarClipPath(props: BarClipPathProps) {
  const { style, maskId, ...rest } = props;

  if (!props.borderRadius || props.borderRadius <= 0) {
    return null;
  }

  return (
    <clipPath id={maskId}>
      <BarClipRect ownerState={rest} style={style} />
    </clipPath>
  );
}

export { BarClipPath };
