import * as React from 'react';
import PropTypes from 'prop-types';
import { arc as d3Arc } from 'd3-shape';
import { animated, SpringValue, to } from '@react-spring/web';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { HighlightScope } from '../context/HighlightProvider';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';

export interface PieArcClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when higlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}

export type PieArcClassKey = keyof PieArcClasses;

interface PieArcOwnerState {
  id: string;
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

export type PieArcProps = PieArcOwnerState &
  React.ComponentPropsWithoutRef<'path'> & {
    startAngle: SpringValue<number>;
    endAngle: SpringValue<number>;
    innerRadius: SpringValue<number>;
    outerRadius: SpringValue<number>;
    cornerRadius: SpringValue<number>;
    paddingAngle: SpringValue<number>;
    highlightScope?: Partial<HighlightScope>;
    onClick?: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
  };

function PieArc(props: PieArcProps) {
  const {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    highlightScope,
    onClick,
    isFaded,
    isHighlighted,
    startAngle,
    endAngle,
    paddingAngle,
    innerRadius,
    outerRadius,
    cornerRadius,
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

  const getInteractionItemProps = useInteractionItemProps(highlightScope);

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
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  dataIndex: PropTypes.number.isRequired,
  highlightScope: PropTypes.shape({
    faded: PropTypes.oneOf(['global', 'none', 'series']),
    highlighted: PropTypes.oneOf(['item', 'none', 'series']),
  }),
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
} as any;

export { PieArc };
