'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, SxProps, Theme } from '@mui/material/styles';
import clsx from 'clsx';
import { ChartsLabelMarkClasses, labelMarkClasses, useUtilityClasses } from './labelMarkClasses';
import { consumeThemeProps } from '../internals/consumeThemeProps';

export interface ChartsLabelCustomMarkProps {
  className?: string;
  /** Color of the series this mark refers to. */
  color?: string;
}

export interface ChartsLabelMarkProps {
  /**
   * The type of the mark.
   * @default 'square'
   */
  type?: 'square' | 'circle' | 'line' | React.ComponentType<ChartsLabelCustomMarkProps>;
  /**
   * The color of the mark.
   */
  color?: string;
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
})<{ ownerState: ChartsLabelMarkProps }>(() => {
  return {
    display: 'flex',
    width: 14,
    height: 14,
    [`&.${labelMarkClasses.line}`]: {
      width: 16,
      height: 'unset',
      alignItems: 'center',
      [`.${labelMarkClasses.mask}`]: {
        height: 4,
        width: '100%',
        borderRadius: 1,
        overflow: 'hidden',
      },
    },
    [`&.${labelMarkClasses.square}`]: {
      height: 13,
      width: 13,
      borderRadius: 2,
      overflow: 'hidden',
    },
    [`&.${labelMarkClasses.circle}`]: {
      height: 15,
      width: 15,
    },
    svg: {
      display: 'block',
    },
    [`& .${labelMarkClasses.mask} > *`]: {
      height: '100%',
      width: '100%',
    },
    [`& .${labelMarkClasses.mask}`]: {
      height: '100%',
      width: '100%',
    },
  };
});

/**
 * Generates the label mark for the tooltip and legend.
 * @ignore - internal component.
 */
const ChartsLabelMark = consumeThemeProps(
  'MuiChartsLabelMark',
  {
    defaultProps: { type: 'square' },
    classesResolver: useUtilityClasses,
  },
  function ChartsLabelMark(props: ChartsLabelMarkProps, ref: React.Ref<HTMLDivElement>) {
    const { type, color, className, classes, ...other } = props;
    const Component = type;

    return (
      <Root
        className={clsx(classes?.root, className)}
        ownerState={props}
        aria-hidden="true"
        ref={ref}
        {...other}
      >
        <div className={classes?.mask}>
          {typeof Component === 'function' ? (
            <Component className={classes?.fill} color={color} />
          ) : (
            <svg viewBox="0 0 24 24" preserveAspectRatio={type === 'line' ? 'none' : undefined}>
              {type === 'circle' ? (
                <circle className={classes?.fill} r="12" cx="12" cy="12" fill={color} />
              ) : (
                <rect className={classes?.fill} width="24" height="24" fill={color} />
              )}
            </svg>
          )}
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
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The color of the mark.
   */
  color: PropTypes.string,
  /**
   * The type of the mark.
   * @default 'square'
   */
  type: PropTypes.oneOf(['circle', 'line', 'square']),
} as any;

export { ChartsLabelMark };
