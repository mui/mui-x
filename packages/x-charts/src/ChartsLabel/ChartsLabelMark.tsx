'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, SxProps, Theme } from '@mui/material/styles';
import clsx from 'clsx';
import { ChartsLabelMarkClasses, labelMarkClasses, useUtilityClasses } from './labelMarkClasses';
import { consumeThemeProps } from '../internals/consumeThemeProps';

export interface ChartsLabelMarkProps {
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
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsLabelMarkClasses>;
  className?: string;
  sx?: SxProps<Theme>;
  ref?: React.Ref<HTMLDivElement>;
}

const Root = styled('div', {
  name: 'MuiChartsLabelMark',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: ChartsLabelMarkProps }>(() => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    [`&.${labelMarkClasses.line}`]: {
      width: 16,
      display: 'flex',
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
      borderRadius: '50%',
      overflow: 'hidden',
    },
    svg: {
      display: 'block',
      height: '100%',
      width: '100%',
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
    classesResolver: useUtilityClasses,
  },
  function ChartsLabelMark(props: ChartsLabelMarkProps) {
    const { type, color, className, classes, ...other } = props;

    return (
      <Root
        className={clsx(classes?.root, className)}
        ownerState={props}
        aria-hidden="true"
        {...other}
      >
        <div className={classes?.mask}>
          <svg viewBox="0 0 24 24" preserveAspectRatio={type === 'line' ? 'none' : undefined}>
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
