'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, SxProps, Theme } from '@mui/material/styles';
import clsx from 'clsx';
import { useRtl } from '@mui/system/RtlProvider';
import {
  ChartsLabelGradientClasses,
  useUtilityClasses,
  labelGradientClasses,
} from './labelGradientClasses';
import { consumeThemeProps } from '../internals/consumeThemeProps';

export interface ChartsLabelGradientProps {
  /**
   * A unique identifier for the gradient.
   * The `gradientId` will be used as `fill="url(#gradientId)"`.
   */
  gradientId: string;
  /**
   * The direction of the gradient.
   * @default 'horizontal'
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * If `true`, the gradient will be reversed.
   */
  reverse?: boolean;
  /**
   * If provided, the gradient will be rotated by 90deg.
   * Useful for linear gradients that are not in the correct orientation.
   */
  rotate?: boolean;
  /**
   * The thickness of the gradient
   * @default 12
   */
  thickness?: number;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsLabelGradientClasses>;
  className?: string;
  sx?: SxProps<Theme>;
}

const getRotation = (
  direction?: 'vertical' | 'horizontal',
  reverse?: boolean,
  rotate?: boolean,
  isRtl?: boolean,
) => {
  const angle = (direction === 'vertical' ? -90 : 0) + (rotate ? 90 : 0) + (reverse ? 180 : 0);

  if (isRtl && direction !== 'vertical') {
    return angle + 180;
  }

  return angle;
};

const Root = styled('div', {
  name: 'MuiChartsLabelGradient',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: ChartsLabelGradientProps & { isRtl: boolean } }>(({ ownerState }) => {
  const rotation = getRotation(
    ownerState.direction,
    ownerState.reverse,
    ownerState.rotate,
    ownerState.isRtl,
  );

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [`.${labelGradientClasses.mask}`]: {
      borderRadius: 2,
      overflow: 'hidden',
    },
    [`&.${labelGradientClasses.horizontal}`]: {
      width: '100%',
      [`.${labelGradientClasses.mask}`]: {
        height: ownerState.thickness,
        width: '100%',
      },
    },
    [`&.${labelGradientClasses.vertical}`]: {
      height: '100%',
      [`.${labelGradientClasses.mask}`]: {
        width: ownerState.thickness,
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
 * Generates the label Gradient for the tooltip and legend.
 * @ignore - internal component.
 */
const ChartsLabelGradient = consumeThemeProps(
  'MuiChartsLabelGradient',
  {
    defaultProps: {
      direction: 'horizontal',
      thickness: 12,
    },
    classesResolver: useUtilityClasses,
  },
  function ChartsLabelGradient(props: ChartsLabelGradientProps, ref: React.Ref<HTMLDivElement>) {
    const { gradientId, direction, classes, className, rotate, reverse, thickness, ...other } =
      props;
    const isRtl = useRtl();

    return (
      <Root
        className={clsx(classes?.root, className)}
        ownerState={{ ...props, isRtl }}
        aria-hidden="true"
        ref={ref}
        {...other}
      >
        <div className={classes?.mask}>
          <svg viewBox="0 0 24 24">
            <rect className={classes?.fill} width="24" height="24" fill={`url(#${gradientId})`} />
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
   * @default 'horizontal'
   */
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  /**
   * A unique identifier for the gradient.
   * The `gradientId` will be used as `fill="url(#gradientId)"`.
   */
  gradientId: PropTypes.string.isRequired,
  /**
   * If `true`, the gradient will be reversed.
   */
  reverse: PropTypes.bool,
  /**
   * If provided, the gradient will be rotated by 90deg.
   * Useful for linear gradients that are not in the correct orientation.
   */
  rotate: PropTypes.bool,
  /**
   * The thickness of the gradient
   * @default 12
   */
  thickness: PropTypes.number,
} as any;

export { ChartsLabelGradient };
