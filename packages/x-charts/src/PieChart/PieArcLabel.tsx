import * as React from 'react';
import PropTypes from 'prop-types';
import { animated, SpringValue, to } from '@react-spring/web';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { PieItemId } from '../models/seriesType/pie';

export interface PieArcLabelClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when highlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}

export type PieArcLabelClassKey = keyof PieArcLabelClasses;

interface PieArcLabelOwnerState {
  id: PieItemId;
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
  pointerEvents: 'none',
}));

export type PieArcLabelProps = PieArcLabelOwnerState &
  Omit<React.SVGProps<SVGTextElement>, 'ref' | 'color' | 'id'> & {
    startAngle: SpringValue<number>;
    endAngle: SpringValue<number>;
    innerRadius: SpringValue<number>;
    outerRadius: SpringValue<number>;
    arcLabelRadius: SpringValue<number>;
    cornerRadius: SpringValue<number>;
    paddingAngle: SpringValue<number>;
  } & {
    formattedArcLabel?: string | null;
  };

/**
 * Helper to compute label position.
 * It's not an inline function because we need it in interpolation.
 */
const getLabelPosition =
  (formattedArcLabel: string | null | undefined, variable: 'x' | 'y') =>
  (
    startAngle: number,
    endAngle: number,
    padAngle: number,
    arcLabelRadius: number,
    cornerRadius: number,
  ) => {
    if (!formattedArcLabel) {
      return 0;
    }
    const [x, y] = d3Arc().cornerRadius(cornerRadius).centroid({
      padAngle,
      startAngle,
      endAngle,
      innerRadius: arcLabelRadius,
      outerRadius: arcLabelRadius,
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
    arcLabelRadius,
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
          [startAngle, endAngle, paddingAngle, arcLabelRadius, cornerRadius],
          getLabelPosition(formattedArcLabel, 'x'),
        ),
        y: to(
          [startAngle, endAngle, paddingAngle, arcLabelRadius, cornerRadius],
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
