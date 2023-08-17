import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from 'd3-shape';
import { getSymbol } from '../internals/utils';
import { InteractionContext } from '../context/InteractionProvider';
import { HighlightScope } from '../context/HighlightProvider';
import {
  getIsFaded,
  getIsHighlighted,
  useInteractionItemProps,
} from '../hooks/useInteractionItemProps';

export interface MarkElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when higlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}

export type MarkElementClassKey = keyof MarkElementClasses;

export interface MarkElementOwnerState {
  id: string;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  x: number;
  y: number;
  classes?: Partial<MarkElementClasses>;
}

export function getMarkElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiMarkElement', slot);
}

export const markElementClasses: MarkElementClasses = generateUtilityClasses('MuiMarkElement', [
  'root',
  'highlighted',
  'faded',
]);

const useUtilityClasses = (ownerState: MarkElementOwnerState) => {
  const { classes, id, isFaded, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getMarkElementUtilityClass, classes);
};

const MarkElementPath = styled('path', {
  name: 'MuiMarkElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: MarkElementOwnerState }>(({ ownerState, theme }) => ({
  transform: `translate(${ownerState.x}px, ${ownerState.y}px)`,
  transformOrigin: `${ownerState.x}px ${ownerState.y}px`,
  fill: theme.palette.background.paper,
  stroke: ownerState.color,
  strokeWidth: 2,
  '&.MuiMarkElement-highlighted': {
    fill: ownerState.color,
  },
}));

MarkElementPath.propTypes = {
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
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export type MarkElementProps = Omit<MarkElementOwnerState, 'isFaded' | 'isHighlighted'> &
  React.ComponentPropsWithoutRef<'path'> & {
    /**
     * The shape of the marker.
     */
    shape: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    /**
     * The index to the element in the series' data array.
     */
    dataIndex: number;
    highlightScope?: Partial<HighlightScope>;
  };

function MarkElement(props: MarkElementProps) {
  const {
    x,
    y,
    id,
    classes: innerClasses,
    color,
    shape,
    dataIndex,
    highlightScope,
    ...other
  } = props;

  const getInteractionItemProps = useInteractionItemProps(highlightScope);

  const { item, axis } = React.useContext(InteractionContext);

  const isHighlighted =
    axis.x?.index === dataIndex ||
    getIsHighlighted(item, { type: 'line', seriesId: id }, highlightScope);
  const isFaded =
    !isHighlighted && getIsFaded(item, { type: 'line', seriesId: id }, highlightScope);

  const ownerState = {
    id,
    classes: innerClasses,
    isHighlighted,
    isFaded,
    color,
    x,
    y,
  };
  const classes = useUtilityClasses(ownerState);

  return (
    <MarkElementPath
      {...other}
      ownerState={ownerState}
      className={classes.root}
      d={d3Symbol(d3SymbolsFill[getSymbol(shape)])()!}
      {...getInteractionItemProps({ type: 'line', seriesId: id, dataIndex })}
    />
  );
}

MarkElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  /**
   * The index to the element in the series' data array.
   */
  dataIndex: PropTypes.number.isRequired,
  highlightScope: PropTypes.shape({
    faded: PropTypes.oneOf(['global', 'none', 'series']),
    highlighted: PropTypes.oneOf(['item', 'none', 'series']),
  }),
  /**
   * The shape of the marker.
   */
  shape: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'])
    .isRequired,
} as any;

export { MarkElement };
