'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import { animated } from '@react-spring/web';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
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

const PieArcRoot = styled(animated.path, {
  name: 'MuiPieArc',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.arc,
})<{ ownerState: PieArcOwnerState }>(({ theme }) => ({
  // Got to move stroke to an element prop instead of style.
  stroke: (theme.vars || theme).palette.background.paper,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in, filter 0.2s ease-in',

  '@keyframes animation': {
    from: {
      transform: 'rotate(var(--angle))',
    },
    to: {
      transform: 'rotate(0)',
    },
  },

  animation: 'animation 0.2s ease-in',
}));

const PieArcClipPath = styled('path')({});

export type PieArcProps = Omit<React.SVGProps<SVGPathElement>, 'ref' | 'id'> &
  PieArcOwnerState & {
    cornerRadius: number;
    endAngle: number;
    innerRadius: number;
    onClick?: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
    outerRadius: number;
    paddingAngle: number;
    startAngle: number;
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

  const d = d3Arc().cornerRadius(cornerRadius)({
    padAngle: paddingAngle,
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
  })!;

  return (
    <React.Fragment>
      <clipPath id={`pie-${id}-arc-clip-path-${dataIndex}`}>
        <PieArcClipPath d={d} />
      </clipPath>
      <g clipPath={`url(#pie-${id}-arc-clip-path-${dataIndex})`}>
        <PieArcRoot
          d={d}
          visibility={startAngle === endAngle ? 'hidden' : 'visible'}
          onClick={onClick}
          cursor={onClick ? 'pointer' : 'unset'}
          ownerState={ownerState}
          className={classes.root}
          fill={ownerState.color}
          opacity={ownerState.isFaded ? 0.3 : 1}
          filter={ownerState.isHighlighted ? 'brightness(120%)' : 'none'}
          strokeWidth={1}
          strokeLinejoin="round"
          style={{ '--angle': `-${endAngle - startAngle}rad` }}
          {...other}
          {...getInteractionItemProps({ type: 'pie', seriesId: id, dataIndex })}
        />
      </g>
    </React.Fragment>
  );
}

PieArc.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  dataIndex: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
} as any;

export { PieArc };
