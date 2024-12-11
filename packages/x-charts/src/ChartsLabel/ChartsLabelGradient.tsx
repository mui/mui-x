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
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsLabelGradientClasses>;
  className?: string;
  sx?: SxProps<Theme>;
}

const Root = styled('div', {
  name: 'MuiChartsLabelGradient',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: ChartsLabelGradientProps }>(() => {
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
          transform: 'rotate(90deg)',
          height: '100%',
        },
      },
    },
    svg: {
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
  function ChartsLabelGradient(props: ChartsLabelGradientProps, ref: React.Ref<HTMLDivElement>) {
    const { gradientId, direction, classes, className, ...other } = props;

    return (
      <Root
        className={clsx(classes?.root, className)}
        ownerState={props}
        aria-hidden="true"
        ref={ref}
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
} as any;

export { ChartsLabelGradient };
