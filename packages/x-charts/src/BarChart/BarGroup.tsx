import * as React from 'react';
import { SpringValue, animated } from '@react-spring/web';
import useId from '@mui/utils/useId';
import { getRadius } from './getRadius';

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
        ).to(
          (value) =>
            `inset(0px round ${Math.min(value, getRadius('top-left', radiusData))}px ${Math.min(value, getRadius('top-right', radiusData))}px ${Math.min(value, getRadius('bottom-right', radiusData))}px ${Math.min(value, getRadius('bottom-left', radiusData))}px)`,
        ),
      }}
    />
  );
}

function BarGroup(props: {
  borderRadius?: number;
  children: React.ReactNode;
  hasNegative: boolean;
  hasPositive: boolean;
  layout?: 'vertical' | 'horizontal';
  style: Record<'x' | 'y' | 'width' | 'height', any> & Record<string, any>;
}) {
  const maskUniqueId = useId();
  const { style, children, ...rest } = props;

  if (!props.borderRadius || props.borderRadius <= 0) {
    return children;
  }

  return (
    <React.Fragment>
      <clipPath id={maskUniqueId}>
        <BarClipRect style={style} ownerState={rest} />
      </clipPath>
      <g clipPath={`url(#${maskUniqueId})`}>{children}</g>
    </React.Fragment>
  );
}

export { BarGroup };
