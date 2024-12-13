'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, SxProps, Theme } from '@mui/material/styles';
import clsx from 'clsx';
import {
  ChartsLabelGradientClasses,
  useUtilityClasses,
  labelGradientClasses,
} from './labelGradientClasses';
import { consumeThemeProps } from '../internals/consumeThemeProps';

export interface ChartsLabelGradientProps {
  /**
   * A unique identifier for the gradient.
   *
   * The `gradientId` will be used as `fill="url(#gradientId)"`.
   */
  gradientId: string;
  /**
   * The direction of the gradient.
   *
   * @default 'row'
   */
  direction?: 'column' | 'row';
  /**
   * If `true`, the gradient will be reversed.
   */
  reverse?: boolean;
  /**
   * If provided, the gradient will be rotated by 90deg.
   *
   * Useful for linear gradients that are not in the correct orientation.
   */
  rotate?: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsLabelGradientClasses>;
  className?: string;
  sx?: SxProps<Theme>;
  ref: React.Ref<HTMLDivElement>;
}

const getRotation = (direction?: 'column' | 'row', reverse?: boolean, rotate?: boolean) => {
  if (!rotate && reverse) {
    return direction === 'column' ? 90 : 180;
  }

  if (rotate && !reverse) {
    return direction === 'column' ? 0 : 90;
  }

  if (rotate && reverse) {
    return direction === 'column' ? 180 : -90;
  }

  return direction === 'column' ? -90 : 0;
};

const Root = styled('div', {
  name: 'MuiChartsLabelGradient',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: ChartsLabelGradientProps }>(({ ownerState }) => {
  const rotation = getRotation(ownerState.direction, ownerState.reverse, ownerState.rotate);

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [`.${labelGradientClasses.mask}`]: {
      borderRadius: 2,
      overflow: 'hidden',
    },
    [`&.${labelGradientClasses.row}`]: {
      width: '100%',
      [`.${labelGradientClasses.mask}`]: {
        height: 12,
        width: '100%',
      },
    },
    [`&.${labelGradientClasses.column}`]: {
      height: '100%',
      [`.${labelGradientClasses.mask}`]: {
        width: 12,
        height: '100%',
        '> svg': {
          height: '100%',
        },
      },
    },
    svg: {
      transform: `rotate(${rotation}deg)`,
      display: 'block',
    },
  };
});

/**
 * @ignore - internal component.
 *
 * Generates the label Gradient for the tooltip and legend.
 */
const ChartsLabelGradient = consumeThemeProps(
  'MuiChartsLabelGradient',
  {
    defaultProps: {
      direction: 'row',
    },
    classesResolver: useUtilityClasses,
  },
  function ChartsLabelGradient(props: ChartsLabelGradientProps) {
    const { gradientId, direction, classes, className, ...other } = props;

    return (
      <Root
        className={clsx(classes?.root, className)}
        ownerState={props}
        aria-hidden="true"
        {...other}
      >
        <div className={classes?.mask}>
          <svg viewBox="0 0 24 24">
            <rect width="24" height="24" fill={`url(#${gradientId})`} />
          </svg>
        </div>
      </Root>
    );
  },
);

ChartsLabelGradient.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The direction of the gradient.
   *
   * @default 'row'
   */
  direction: PropTypes.oneOf(['column', 'row']),
  /**
   * A unique identifier for the gradient.
   *
   * The `gradientId` will be used as `fill="url(#gradientId)"`.
   */
  gradientId: PropTypes.string.isRequired,
  /**
   * If `true`, the gradient will be reversed.
   */
  reverse: PropTypes.bool,
  /**
   * If provided, the gradient will be rotated by 90deg.
   *
   * Useful for linear gradients that are not in the correct orientation.
   */
  rotate: PropTypes.bool,
} as any;

export { ChartsLabelGradient };
