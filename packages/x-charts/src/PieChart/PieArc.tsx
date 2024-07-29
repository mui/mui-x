import * as React from 'react';
import PropTypes from 'prop-types';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import { animated, SpringValue, to } from '@react-spring/web';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { PieItemId } from '../models';
import { HighlightScope } from '../context';

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
  const { classes, id, isFaded, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getPieArcUtilityClass, classes);
};

const PieArcRoot = styled(animated.path, {
  name: 'MuiPieArc',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.arc,
})<{ ownerState: PieArcOwnerState }>(({ theme }) => ({
  stroke: (theme.vars || theme).palette.background.paper,
  strokeWidth: 1,
  strokeLinejoin: 'round',
}));

export type PieArcProps = Omit<React.SVGProps<SVGPathElement>, 'ref' | 'id'> &
  PieArcOwnerState & {
    cornerRadius: SpringValue<number>;
    endAngle: SpringValue<number>;
    /**
     * @deprecated Use the `isFaded` or `isHighlighted` props instead.
     */
    highlightScope?: Partial<HighlightScope>;
    innerRadius: SpringValue<number>;
    onClick?: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
    outerRadius: SpringValue<number>;
    paddingAngle: SpringValue<number>;
    startAngle: SpringValue<number>;
  };

function PieArc(props: PieArcProps) {
  const {
    classes: innerClasses,
    color,
    cornerRadius,
    dataIndex,
    endAngle,
    id,
    innerRadius,
    isFaded,
    isHighlighted,
    onClick,
    outerRadius,
    paddingAngle,
    startAngle,
    highlightScope,
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

  const getInteractionItemProps = useInteractionItemProps();

  return (
    <PieArcRoot
      d={to(
        [startAngle, endAngle, paddingAngle, innerRadius, outerRadius, cornerRadius],
        (sA, eA, pA, iR, oR, cR) =>
          d3Arc().cornerRadius(cR)({
            padAngle: pA,
            startAngle: sA,
            endAngle: eA,
            innerRadius: iR,
            outerRadius: oR,
          })!,
      )}
      visibility={to([startAngle, endAngle], (sA, eA) => (sA === eA ? 'hidden' : 'visible'))}
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'unset'}
      ownerState={ownerState}
      className={classes.root}
      {...other}
      {...getInteractionItemProps({ type: 'pie', seriesId: id, dataIndex })}
    />
  );
}

PieArc.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  dataIndex: PropTypes.number.isRequired,
  /**
   * @deprecated Use the `isFaded` or `isHighlighted` props instead.
   */
  highlightScope: PropTypes.shape({
    fade: PropTypes.oneOf(['global', 'none', 'series']),
    faded: PropTypes.oneOf(['global', 'none', 'series']),
    highlight: PropTypes.oneOf(['item', 'none', 'series']),
    highlighted: PropTypes.oneOf(['item', 'none', 'series']),
  }),
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
} as any;

export { PieArc };
