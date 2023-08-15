import * as React from 'react';
import { arc as d3Arc, PieArcDatum as D3PieArcDatum } from 'd3-shape';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { InteractionContext } from '../context/InteractionProvider';
import {
  getIsFaded,
  getIsHighlighted,
  useInteractionItemProps,
} from '../hooks/useInteractionItemProps';
import { HighlightScope } from '../context/HighlightProvider';
import { PieSeriesType } from '../models/seriesType/pie';

export interface PieArcClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when higlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}

export type PieArcClassKey = keyof PieArcClasses;

export interface PieArcOwnerState {
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

const PieArcRoot = styled('path', {
  name: 'MuiPieArc',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.arc,
})<{ ownerState: PieArcOwnerState }>(({ ownerState, theme }) => ({
  stroke: theme.palette.background.paper,
  strokeWidth: 1,
  strokeLinejoin: 'round',
  fill: ownerState.color,
  opacity: ownerState.isFaded ? 0.3 : 1,
}));

export type PieArcProps = Omit<PieArcOwnerState, 'isFaded' | 'isHighlighted'> &
  React.ComponentPropsWithoutRef<'path'> &
  D3PieArcDatum<any> & {
    highlightScope?: Partial<HighlightScope>;
    innerRadius: PieSeriesType['innerRadius'];
    outerRadius: number;
    cornerRadius: PieSeriesType['cornerRadius'];
    highlighted: PieSeriesType['highlighted'];
    faded: PieSeriesType['faded'];
  };

export default function PieArc(props: PieArcProps) {
  const {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    highlightScope,
    innerRadius: baseInnerRadius = 0,
    outerRadius: baseOuterRadius,
    cornerRadius: baseCornerRadius = 0,
    highlighted,
    faded = { additionalRadius: -5 },
    ...other
  } = props;

  const getInteractionItemProps = useInteractionItemProps(highlightScope);

  const { item } = React.useContext(InteractionContext);

  const isHighlighted = getIsHighlighted(
    item,
    { type: 'pie', seriesId: id, dataIndex },
    highlightScope,
  );

  const isFaded =
    !isHighlighted && getIsFaded(item, { type: 'pie', seriesId: id, dataIndex }, highlightScope);

  const ownerState = {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
  };
  const classes = useUtilityClasses(ownerState);

  const attibuesOverride = {
    additionalRadius: 0,
    ...((isFaded && faded) || (isHighlighted && highlighted) || {}),
  };
  const innerRadius = Math.max(0, attibuesOverride.innerRadius ?? baseInnerRadius);

  const outerRadius = Math.max(
    0,
    attibuesOverride.outerRadius ?? baseOuterRadius + attibuesOverride.additionalRadius,
  );
  const cornerRadius = attibuesOverride.cornerRadius ?? baseCornerRadius;

  return (
    <PieArcRoot
      d={
        d3Arc().cornerRadius(cornerRadius)({
          ...other,
          innerRadius,
          outerRadius,
        })!
      }
      ownerState={ownerState}
      className={classes.root}
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
  cornerRadius: PropTypes.number,
  dataIndex: PropTypes.number.isRequired,
  highlightScope: PropTypes.shape({
    faded: PropTypes.oneOf(['global', 'none', 'series']),
    highlighted: PropTypes.oneOf(['item', 'none', 'series']),
  }),
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number.isRequired,
} as any;
