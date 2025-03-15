import * as React from 'react';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { getRadius } from './getRadius';

export interface BarClipPathProps {
  className?: string;
  maskId: string;
  borderRadius?: number;
  hasNegative: boolean;
  hasPositive: boolean;
  layout?: 'vertical' | 'horizontal';
  style?: React.CSSProperties;

  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BarClipPathClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if it is horizontal. */
  horizontal: string;
  /** Styles applied to the root element if it is vertical. */
  vertical: string;
}

export const barClipPathClasses: BarClipPathClasses = generateUtilityClasses('MuiBarClipPath', [
  'root',
  'horizontal',
  'vertical',
]);

/**
 * @ignore - internal component.
 */
function BarClipPath(props: BarClipPathProps) {
  const { className, maskId, x, y, width, height, style, ...radiusData } = props;

  if (!props.borderRadius || props.borderRadius <= 0) {
    return null;
  }

  return (
    <clipPath id={maskId}>
      <rect
        className={className}
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          ...style,
          clipPath: `inset(0px round ${getRadius('top-left', radiusData)}px ${getRadius('top-right', radiusData)}px ${getRadius('bottom-right', radiusData)}px ${getRadius('bottom-left', radiusData)}px)`,
        }}
      />
    </clipPath>
  );
}

export { BarClipPath };
