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

export interface PieElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when higlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}

export type PieElementClassKey = keyof PieElementClasses;

export interface PieElementOwnerState {
  id: string;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<PieElementClasses>;
}

export function getPieElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiPieElement', slot);
}

export const pieElementClasses: PieElementClasses = generateUtilityClasses('MuiPieElement', [
  'root',
  'highlighted',
  'faded',
]);

const useUtilityClasses = (ownerState: PieElementOwnerState) => {
  const { classes, id, isFaded, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getPieElementUtilityClass, classes);
};

const PieElementPath = styled('path', {
  name: 'MuiPieElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: PieElementOwnerState }>(({ ownerState }) => ({
  stroke: 'none',
  strokeWidth: 2,
  strokePiejoin: 'round',
  fill: ownerState.color,
  opacity: ownerState.isFaded ? 0.3 : 1,
}));

PieElementPath.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  as: PropTypes.elementType,
  ownerState: PropTypes.shape({
    classes: PropTypes.object,
    color: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    isFaded: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
  }).isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export type PieElementProps = Omit<PieElementOwnerState, 'isFaded' | 'isHighlighted'> &
  React.ComponentPropsWithoutRef<'path'> &
  D3PieArcDatum<any> & {
    highlightScope?: Partial<HighlightScope>;
    innerRadius: PieSeriesType['innerRadius'];
    outerRadius: number;
    cornerRadius: PieSeriesType['cornerRadius'];
  };

function PieElement(props: PieElementProps) {
  const {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    highlightScope,
    innerRadius = 0,
    outerRadius,
    cornerRadius = 0,
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

  return (
    <PieElementPath
      d={
        d3Arc().cornerRadius(cornerRadius)({
          ...other,
          innerRadius,
          outerRadius,
        })!
      }
      {...other}
      ownerState={ownerState}
      className={classes.root}
      {...getInteractionItemProps({ type: 'pie', seriesId: id, dataIndex })}
    />
  );
}

PieElement.propTypes = {
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

export { PieElement };
