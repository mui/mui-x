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
  // eslint-disable-next-line react/no-unused-prop-types
  gradientId: string;
  /**
   * The direction of the gradient.
   *
   * @default 'row'
   */
  // eslint-disable-next-line react/no-unused-prop-types
  direction?: 'column' | 'row';
  /**
   * The width of the line.
   * @default 12
   */
  // eslint-disable-next-line react/no-unused-prop-types
  lineWidth?: number;
  /**
   * The border radius of the gradient.
   *
   * @default 2
   */
  // eslint-disable-next-line react/no-unused-prop-types
  borderRadius?: number;
  /**
   * Override or extend the styles applied to the component.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  classes?: Partial<ChartsLabelGradientClasses>;
  className?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  sx?: SxProps<Theme>;
}

const Root = styled('div', {
  name: 'MuiChartsLabelGradient',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: ChartsLabelGradientProps }>(({ ownerState }) => {
  const { lineWidth, borderRadius } = ownerState;

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '> div': {
      borderRadius,
      overflow: 'hidden',
    },

    [`&.${labelGradientClasses.row}`]: {
      width: '100%',
      '> div': {
        height: lineWidth,
        width: '100%',
      },
    },

    [`&.${labelGradientClasses.column}`]: {
      height: '100%',
      '> div': {
        width: lineWidth,
        height: '100%',
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
      lineWidth: 12,
      borderRadius: 2,
    },
    classesResolver: useUtilityClasses,
  },
  function ChartsLabelGradient(props: ChartsLabelGradientProps, ref: React.Ref<HTMLDivElement>) {
    const { gradientId, direction, classes, borderRadius, lineWidth, className, ...other } = props;

    return (
      <Root
        className={clsx(classes?.root, className)}
        ownerState={props}
        aria-hidden="true"
        ref={ref}
        {...other}
      >
        <div>
          <svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio={'none'}>
            <rect width="10" height="10" fill={`url(#${gradientId})`} />
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
   * The border radius of the Gradient.
   *
   * @default type='square': 2
   */
  borderRadius: PropTypes.number,
} as any;

export { ChartsLabelGradient };
