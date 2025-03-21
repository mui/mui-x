'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import useForkRef from '@mui/utils/useForkRef';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from '../constants';
import { useAnimate } from '../internals/useAnimate';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { PieItemId } from '../models';

export interface PieArcClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when highlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}

export type PieArcClassKey = keyof PieArcClasses;

interface PieArcOwnerState {
  id: PieItemId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<PieArcClasses>;
}

export function getPieArcUtilityClass(slot: string) {
  return generateUtilityClass('MuiPieArc', slot);
}

export const pieArcClasses: PieArcClasses = generateUtilityClasses('MuiPieArc', [
  'root',
  'highlighted',
  'faded',
]);

const useUtilityClasses = (ownerState: PieArcOwnerState) => {
  const { classes, id, isFaded, isHighlighted, dataIndex } = ownerState;
  const slots = {
    root: [
      'root',
      `series-${id}`,
      `data-index-${dataIndex}`,
      isHighlighted && 'highlighted',
      isFaded && 'faded',
    ],
  };

  return composeClasses(slots, getPieArcUtilityClass, classes);
};

type PieArcAnimatedProps = Pick<
  PieArcProps,
  | 'startAngle'
  | 'endAngle'
  | 'cornerRadius'
  | 'paddingAngle'
  | 'innerRadius'
  | 'outerRadius'
  | 'skipAnimation'
> & { ref?: React.Ref<SVGPathElement> };

type PieArcInterpolatedProps = Pick<PieArcAnimatedProps, 'startAngle' | 'endAngle'>;

function pieArcPropsInterpolator(from: PieArcInterpolatedProps, to: PieArcInterpolatedProps) {
  const interpolateStartAngle = interpolateNumber(from.startAngle, to.startAngle);
  const interpolateEndAngle = interpolateNumber(from.endAngle, to.endAngle);

  return (t: number) => {
    return {
      startAngle: interpolateStartAngle(t),
      endAngle: interpolateEndAngle(t),
    };
  };
}

/** Animates a pie slice using a `path` element.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
export function useAnimatePieArc(props: PieArcAnimatedProps): {
  ref: React.Ref<SVGPathElement>;
  d: string;
} {
  const ref = useAnimate(
    { startAngle: props.startAngle, endAngle: props.endAngle },
    {
      createInterpolator: pieArcPropsInterpolator,
      applyProps(element, animatedProps) {
        element.setAttribute(
          'd',
          d3Arc()
            .cornerRadius(props.cornerRadius)({
              padAngle: props.paddingAngle,
              innerRadius: props.innerRadius,
              outerRadius: props.outerRadius,
              startAngle: animatedProps.startAngle,
              endAngle: animatedProps.endAngle,
            })!
            .toString(),
        );
      },
      initialProps: {
        startAngle: (props.startAngle + props.endAngle) / 2,
        endAngle: (props.startAngle + props.endAngle) / 2,
      },
      skip: props.skipAnimation,
    },
  );

  return {
    ref: useForkRef(ref, props.ref),
    d: d3Arc().cornerRadius(props.cornerRadius)({
      padAngle: props.paddingAngle,
      innerRadius: props.innerRadius,
      outerRadius: props.outerRadius,
      startAngle: props.startAngle,
      endAngle: props.endAngle,
    })!,
  };
}

const PieArcRoot = styled('path', {
  name: 'MuiPieArc',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.arc,
})<{ ownerState: PieArcOwnerState }>(({ theme }) => ({
  // Got to move stroke to an element prop instead of style.
  stroke: (theme.vars || theme).palette.background.paper,
  transitionProperty: 'opacity, fill, filter',
  transitionDuration: `${ANIMATION_DURATION_MS}ms`,
  transitionTimingFunction: ANIMATION_TIMING_FUNCTION,
}));

export type PieArcProps = Omit<React.SVGProps<SVGPathElement>, 'ref' | 'id'> &
  PieArcOwnerState & {
    cornerRadius: number;
    endAngle: number;
    innerRadius: number;
    onClick?: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
    outerRadius: number;
    paddingAngle: number;
    startAngle: number;
    /** @default false */
    skipAnimation: boolean;
  };

function PieArc(props: PieArcProps) {
  const {
    classes: innerClasses,
    color,
    dataIndex,
    id,
    isFaded,
    isHighlighted,
    onClick,
    cornerRadius,
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    paddingAngle,
    skipAnimation,
    ...other
  } = props;

  const ownerState = {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
  };
  const classes = useUtilityClasses(ownerState);

  const interactionProps = useInteractionItemProps({ type: 'pie', seriesId: id, dataIndex });
  const animatedProps = useAnimatePieArc({
    cornerRadius,
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    paddingAngle,
    skipAnimation,
  });

  return (
    <PieArcRoot
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'unset'}
      ownerState={ownerState}
      className={classes.root}
      fill={ownerState.color}
      opacity={ownerState.isFaded ? 0.3 : 1}
      filter={ownerState.isHighlighted ? 'brightness(120%)' : 'none'}
      strokeWidth={1}
      strokeLinejoin="round"
      {...other}
      {...interactionProps}
      {...animatedProps}
    />
  );
}

PieArc.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  cornerRadius: PropTypes.number.isRequired,
  dataIndex: PropTypes.number.isRequired,
  endAngle: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  innerRadius: PropTypes.number.isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  outerRadius: PropTypes.number.isRequired,
  paddingAngle: PropTypes.number.isRequired,
  /**
   * @default false
   */
  skipAnimation: PropTypes.bool.isRequired,
  startAngle: PropTypes.number.isRequired,
} as any;

export { PieArc };
