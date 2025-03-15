'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { interrupt, Transition } from '@mui/x-charts-vendor/d3-transition';
import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { select } from '@mui/x-charts-vendor/d3-selection';
import { easeLinear } from '@mui/x-charts-vendor/d3-ease';
import { PieItemId } from '../models/seriesType/pie';

export interface PieArcLabelClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when highlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
  /** Styles applied to the root element if animation is not skipped. */
  animate: string;
}

export type PieArcLabelClassKey = keyof PieArcLabelClasses;

interface PieArcLabelOwnerState {
  id: PieItemId;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  skipAnimation: boolean;
  classes?: Partial<PieArcLabelClasses>;
}

export function getPieArcLabelUtilityClass(slot: string) {
  return generateUtilityClass('MuiPieArcLabel', slot);
}

export const pieArcLabelClasses: PieArcLabelClasses = generateUtilityClasses('MuiPieArcLabel', [
  'root',
  'highlighted',
  'faded',
  'animate',
]);

const useUtilityClasses = (ownerState: PieArcLabelOwnerState) => {
  const { classes, id, isFaded, isHighlighted, skipAnimation } = ownerState;
  const slots = {
    root: [
      'root',
      `series-${id}`,
      isHighlighted && 'highlighted',
      isFaded && 'faded',
      !skipAnimation && 'animate',
    ],
  };

  return composeClasses(slots, getPieArcLabelUtilityClass, classes);
};

const PieArcLabelRoot = styled('text', {
  name: 'MuiPieArcLabel',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  fill: (theme.vars || theme).palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'middle',
  pointerEvents: 'none',

  [`&.${pieArcLabelClasses.animate}`]: {
    animation: 'animate-opacity 0.2s ease-in',

    '@keyframes animate-opacity': {
      from: { opacity: 0 },
    },
  },
}));

function getPosition({
  angle,
  arcLabelRadius,
  cornerRadius,
  paddingAngle,
}: {
  angle: number;
  arcLabelRadius: number;
  cornerRadius: number;
  paddingAngle: number;
}) {
  return d3Arc().cornerRadius(cornerRadius).centroid({
    padAngle: paddingAngle,
    startAngle: angle,
    endAngle: angle,
    innerRadius: arcLabelRadius,
    outerRadius: arcLabelRadius,
  })!;
}

export type PieArcLabelProps = PieArcLabelOwnerState &
  Omit<React.SVGProps<SVGTextElement>, 'ref' | 'color' | 'id'> & {
    startAngle: number;
    endAngle: number;
    innerRadius: number;
    outerRadius: number;
    arcLabelRadius: number;
    cornerRadius: number;
    paddingAngle: number;
    skipAnimation: boolean;
  } & {
    formattedArcLabel?: string | null;
  };

const DURATION = 200;
function useAnimateArcLabel(
  props: Pick<
    PieArcLabelProps,
    'paddingAngle' | 'arcLabelRadius' | 'cornerRadius' | 'skipAnimation'
  > & { angle: number },
) {
  const lastValuesRef = React.useRef({
    paddingAngle: props.paddingAngle,
    angle: props.angle,
    arcLabelRadius: props.arcLabelRadius,
    cornerRadius: props.cornerRadius,
  });
  const transitionRef = React.useRef<Transition<SVGTextElement, unknown, null, undefined>>(null);
  const [element, setElement] = React.useState<SVGTextElement | null>(null);

  React.useLayoutEffect(() => {
    /* If we're not skipping animation, we need to set the attribute to override React's changes.
     * Still need to figure out if this is better than asking the user not to pass the `d` prop to the component.
     * The problem with that is that SSR might not look good. */
    if (!props.skipAnimation) {
      const [x, y] = getPosition({
        angle: props.angle,
        arcLabelRadius: props.arcLabelRadius,
        cornerRadius: props.cornerRadius,
        paddingAngle: props.paddingAngle,
      });

      element?.setAttribute('x', x.toString());
      element?.setAttribute('y', y.toString());
    }
  }, [
    element,
    props.angle,
    props.arcLabelRadius,
    props.cornerRadius,
    props.paddingAngle,
    props.skipAnimation,
  ]);

  React.useLayoutEffect(() => {
    // TODO: What if we set skipAnimation to true in the middle of the animation?
    if (element === null || props.skipAnimation) {
      return undefined;
    }

    const lastValues = lastValuesRef.current;
    const interpolateAngle = interpolateNumber(lastValues.angle, props.angle);
    const interpolatePaddingAngle = interpolateNumber(lastValues.paddingAngle, props.paddingAngle);
    const interpolateArcLabelRadius = interpolateNumber(
      lastValues.arcLabelRadius,
      props.arcLabelRadius,
    );
    const interpolateCornerRadius = interpolateNumber(lastValues.cornerRadius, props.cornerRadius);

    const interpolateCentroid = (t: number) => {
      const angle = interpolateAngle(t);
      const pA = interpolatePaddingAngle(t);
      const aLR = interpolateArcLabelRadius(t);
      const cR = interpolateCornerRadius(t);

      lastValuesRef.current = {
        angle,
        paddingAngle: pA,
        arcLabelRadius: aLR,
        cornerRadius: cR,
      };

      return getPosition({ cornerRadius: cR, paddingAngle: pA, angle, arcLabelRadius: aLR })!;
    };

    transitionRef.current = select(element)
      .transition()
      .duration(DURATION)
      .ease(easeLinear)
      .attrTween('x', () => (t) => interpolateCentroid(t)[0].toString())
      .attrTween('y', () => (t) => interpolateCentroid(t)[1].toString());

    return () => interrupt(element);
  }, [
    element,
    props.angle,
    props.arcLabelRadius,
    props.cornerRadius,
    props.paddingAngle,
    props.skipAnimation,
  ]);

  return setElement;
}

function PieArcLabel(props: PieArcLabelProps) {
  const {
    id,
    classes: innerClasses,
    color,
    startAngle,
    endAngle,
    paddingAngle,
    arcLabelRadius,
    innerRadius,
    outerRadius,
    cornerRadius,
    formattedArcLabel,
    isHighlighted,
    isFaded,
    skipAnimation,
    ...other
  } = props;

  const ownerState = {
    id,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
    skipAnimation,
  };
  const classes = useUtilityClasses(ownerState);

  const angle = (startAngle + endAngle) / 2;
  const animationProps = {
    angle,
    paddingAngle,
    arcLabelRadius,
    cornerRadius,
    skipAnimation,
  };

  const ref = useAnimateArcLabel(animationProps);
  const [x, y] = getPosition(animationProps);

  return (
    <PieArcLabelRoot className={classes.root} {...other} x={x} y={y} ref={ref}>
      {formattedArcLabel}
    </PieArcLabelRoot>
  );
}

PieArcLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  color: PropTypes.string.isRequired,
  formattedArcLabel: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
} as any;

export { PieArcLabel };
