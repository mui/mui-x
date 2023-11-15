import * as React from 'react';
import PropTypes from 'prop-types';
import { animated, SpringValue, to } from '@react-spring/web';
import { arc as d3Arc } from 'd3-shape';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface PieArcLabelClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when higlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}

export type PieArcLabelClassKey = keyof PieArcLabelClasses;

interface PieArcLabelOwnerState {
  id: string;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<PieArcLabelClasses>;
}

export function getPieArcLabelUtilityClass(slot: string) {
  return generateUtilityClass('MuiPieArcLabel', slot);
}

export const pieArcLabelClasses: PieArcLabelClasses = generateUtilityClasses('MuiPieArcLabel', [
  'root',
  'highlighted',
  'faded',
]);

const useUtilityClasses = (ownerState: PieArcLabelOwnerState) => {
  const { classes, id, isFaded, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getPieArcLabelUtilityClass, classes);
};

const PieArcLabelRoot = styled(animated.text, {
  name: 'MuiPieArcLabel',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  fill: (theme.vars || theme).palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'middle',
}));

export type PieArcLabelProps = PieArcLabelOwnerState &
  React.ComponentPropsWithoutRef<'text'> & {
    startAngle: SpringValue<number>;
    endAngle: SpringValue<number>;
    innerRadius: SpringValue<number>;
    outerRadius: SpringValue<number>;
    cornerRadius: SpringValue<number>;
    paddingAngle: SpringValue<number>;
  } & {
    formattedArcLabel?: string | null;
  };

/**
 * Helper to compute label position.
 * It's not an inline function because we need it in inerpolation.
 */
const getLabelPosition =
  (formattedArcLabel: string | null | undefined, variable: 'x' | 'y') =>
  (
    startAngle: number,
    endAngle: number,
    padAngle: number,
    innerRadius: number,
    outerRadius: number,
    cornerRadius: number,
  ) => {
    if (!formattedArcLabel) {
      return 0;
    }
    const [x, y] = d3Arc().cornerRadius(cornerRadius).centroid({
      padAngle,
      startAngle,
      endAngle,
      innerRadius,
      outerRadius,
    })!;
    if (variable === 'x') {
      return x;
    }
    return y;
  };

function PieArcLabel(props: PieArcLabelProps) {
  const {
    id,
    classes: innerClasses,
    color,
    startAngle,
    endAngle,
    paddingAngle,
    innerRadius,
    outerRadius,
    cornerRadius,
    formattedArcLabel,
    isHighlighted,
    isFaded,
    style,
    ...other
  } = props;

  const ownerState = {
    id,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
  };
  const classes = useUtilityClasses(ownerState);

  return (
    <PieArcLabelRoot
      className={classes.root}
      {...other}
      style={{
        x: to(
          [startAngle, endAngle, paddingAngle, innerRadius, outerRadius, cornerRadius],
          getLabelPosition(formattedArcLabel, 'x'),
        ),
        y: to(
          [startAngle, endAngle, paddingAngle, innerRadius, outerRadius, cornerRadius],
          getLabelPosition(formattedArcLabel, 'y'),
        ),
        ...style,
      }}
    >
      {formattedArcLabel}
    </PieArcLabelRoot>
  );
}

PieArcLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  formattedArcLabel: PropTypes.string,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
} as any;

export { PieArcLabel };
