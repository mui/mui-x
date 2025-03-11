'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { interpolate as d3Interpolate } from '@mui/x-charts-vendor/d3-interpolate';
import type { Transition } from '@mui/x-charts-vendor/d3-transition';
import { interrupt } from '@mui/x-charts-vendor/d3-transition';
import { select } from '@mui/x-charts-vendor/d3-selection';
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

const PieArcRoot = styled('path', {
  name: 'MuiPieArc',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.arc,
})<{ ownerState: PieArcOwnerState }>(({ theme }) => ({
  // Got to move stroke to an element prop instead of style.
  stroke: (theme.vars || theme).palette.background.paper,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in, filter 0.2s ease-in',
}));

const DURATION = 500;

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
  const svgRef = React.useRef<SVGPathElement>(null);
  const classes = useUtilityClasses(ownerState);
  const transitionRef = React.useRef<Transition<SVGPathElement, unknown, null, undefined>>(null);
  const lastAngles = React.useRef({
    startAngle: (startAngle + endAngle) / 2,
    endAngle: (startAngle + endAngle) / 2,
  });

  const interactionProps = useInteractionItemProps({ type: 'pie', seriesId: id, dataIndex });

  React.useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) {
      return;
    }

    const lastStartAngle = lastAngles.current.startAngle;
    const lastEndAngle = lastAngles.current.endAngle;

    const interpolateStartAngle = d3Interpolate(lastStartAngle, startAngle);
    const interpolateEndAngle = d3Interpolate(lastEndAngle, endAngle);
    transitionRef.current = select(svg)
      .transition()
      .duration(DURATION)
      .attrTween('d', () => {
        const arc = d3Arc()
          .cornerRadius(cornerRadius)
          .padAngle(paddingAngle)
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle((startAngle + endAngle) / 2)
          .endAngle((startAngle + endAngle) / 2);

        return (t) => {
          const sA = interpolateStartAngle(t);
          const eA = interpolateEndAngle(t);
          arc.startAngle(sA).endAngle(eA);

          lastAngles.current = { startAngle: sA, endAngle: eA };

          // @ts-expect-error it seems that the types are wrong since the function accepts no arguments.
          return arc();
        };
      });

    // eslint-disable-next-line consistent-return
    return () => {
      interrupt(svg);
    };
  }, [cornerRadius, endAngle, innerRadius, outerRadius, paddingAngle, startAngle]);

  return (
    <PieArcRoot
      ref={svgRef}
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
      {...other}
      {...interactionProps}
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
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
} as any;

export { PieArc };
