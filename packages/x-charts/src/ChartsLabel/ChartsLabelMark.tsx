'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { labelMarkClasses, useUtilityClasses } from './labelMarkClasses';

export interface ChartsLabelMarkProps {
  /**
   * Defines the max size of the mark.
   *
   * For the `line` type, the size is the length of the line.
   * For all other types, the size is the width and height of the mark.
   *
   * @default type='square': 13
   * @default type='line': 16
   * @default type='circle': 15
   */
  // eslint-disable-next-line react/no-unused-prop-types
  size?: number;
  /**
   * The type of the mark.
   * @default 'square'
   */
  type?: 'square' | 'circle' | 'line';
  /**
   * The color of the mark.
   */
  color?: string;

  /**
   * The width of the line.
   * @default 4
   */
  // eslint-disable-next-line react/no-unused-prop-types
  lineWidth?: number;

  /**
   * The border radius of the mark.
   *
   * @default type='square': 2
   * @default type='circle': '50%'
   * @default type='line': 1
   */
  // eslint-disable-next-line react/no-unused-prop-types
  borderRadius?: number;
}

const sizeMap = {
  square: 13,
  circle: 15,
  line: 16,
};

const borderRadiusMap = {
  square: 2,
  circle: '50%',
  line: 1,
};

const defaultLineWidth = 4;

const defaultType = 'square';

const Root = styled('div', {
  name: 'MuiChartsLabelMark',
  slot: 'Root',
})<{ ownerState: ChartsLabelMarkProps }>(({ ownerState }) => {
  const size = ownerState.size ?? sizeMap[ownerState.type ?? defaultType];
  const borderRadius = ownerState.borderRadius ?? borderRadiusMap[ownerState.type ?? defaultType];

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,

    [`&.${labelMarkClasses.line}`]: {
      width: size,
      display: 'flex',
      alignItems: 'center',

      '> div': {
        height: ownerState.lineWidth ?? defaultLineWidth,
        width: '100%',
        borderRadius,
        overflow: 'hidden',
      },
    },

    [`&.${labelMarkClasses.square}, &.${labelMarkClasses.circle}`]: {
      height: size,
      width: size,
      borderRadius,
      overflow: 'hidden',
    },

    svg: {
      display: 'block',
    },
  };
});

/**
 * Generates the label mark for the tooltip and legend.
 */
export default function ChartsLabelMark(props: ChartsLabelMarkProps) {
  const { type, color } = props;

  const classes = useUtilityClasses(props);

  return (
    <Root className={classes.root} ownerState={props} aria-hidden="true">
      <div>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 10 10"
          preserveAspectRatio={type === 'line' ? 'none' : undefined}
        >
          <rect width="10" height="10" fill={color} />
        </svg>
      </div>
    </Root>
  );
}

export { ChartsLabelMark };
