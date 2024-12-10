'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, SxProps, Theme } from '@mui/material/styles';
import clsx from 'clsx';
import { ChartsLabelMarkClasses, labelMarkClasses, useUtilityClasses } from './labelMarkClasses';
import { consumeThemeProps } from '../internals/consumeThemeProps';

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
  lineWidth?: number;
  /**
   * The border radius of the mark.
   *
   * @default type='square': 2
   * @default type='circle': '50%'
   * @default type='line': 1
   */
  borderRadius?: number | string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsLabelMarkClasses>;
  className?: string;
  sx?: SxProps<Theme>;
}

const Root = styled('div', {
  name: 'MuiChartsLabelMark',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: ChartsLabelMarkProps }>(({ ownerState }) => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    [`&.${labelMarkClasses.line}`]: {
      width: ownerState.size,
      display: 'flex',
      alignItems: 'center',
      '> div': {
        height: ownerState.lineWidth,
        width: '100%',
        borderRadius: ownerState.borderRadius,
        overflow: 'hidden',
      },
    },
    [`&.${labelMarkClasses.square}, &.${labelMarkClasses.circle}`]: {
      height: ownerState.size,
      width: ownerState.size,
      borderRadius: ownerState.borderRadius,
      overflow: 'hidden',
    },
    svg: {
      display: 'block',
    },
  };
});

/**
 * @ignore - internal component.
 *
 * Generates the label mark for the tooltip and legend.
 */
const ChartsLabelMark = consumeThemeProps(
  'MuiChartsLabelMark',
  {
    defaultProps: (props) => {
      if (props.type === 'line') {
        return {
          size: 16,
          borderRadius: 1,
          lineWidth: 4,
        };
      }

      if (props.type === 'circle') {
        return {
          size: 15,
          borderRadius: '50%',
          lineWidth: 4,
        };
      }

      return {
        size: 13,
        borderRadius: 2,
        lineWidth: 4,
      };
    },
    classesResolver: useUtilityClasses,
  },
  function ChartsLabelMark(props: ChartsLabelMarkProps, ref: React.Ref<HTMLDivElement>) {
    const { type, color, className, classes, borderRadius, lineWidth, size, ...other } = props;

    return (
      <Root
        className={clsx(classes?.root, className)}
        ownerState={props}
        aria-hidden="true"
        ref={ref}
        {...other}
      >
        <div>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            preserveAspectRatio={type === 'line' ? 'none' : undefined}
          >
            <rect width="24" height="24" fill={color} />
          </svg>
        </div>
      </Root>
    );
  },
);

ChartsLabelMark.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The border radius of the mark.
   *
   * @default type='square': 2
   * @default type='circle': '50%'
   * @default type='line': 1
   */
  borderRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The color of the mark.
   */
  color: PropTypes.string,
  /**
   * The width of the line.
   * @default 4
   */
  lineWidth: PropTypes.number,
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
  size: PropTypes.number,
  /**
   * The type of the mark.
   * @default 'square'
   */
  type: PropTypes.oneOf(['circle', 'line', 'square']),
} as any;

export { ChartsLabelMark };
