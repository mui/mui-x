import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from 'd3-shape';
import { getSymbol } from '../internals/utils';
import { InteractionContext } from '../context/InteractionProvider';

export interface MarkElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when higlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}
export interface MarkElementOwnerState {
  id: string;
  color: string;
  isNotHighlighted: boolean;
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
  const { classes, id, isNotHighlighted, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isNotHighlighted && 'faded'],
  };

  return composeClasses(slots, getMarkElementUtilityClass, classes);
};

const MarkElementPath = styled('path', {
  name: 'MuiMarkElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: MarkElementOwnerState }>(({ ownerState, theme }) => ({
  transform: `translate(${ownerState.x}px, ${ownerState.y}px)`,
  fill: (theme.vars || theme).palette.background.paper,
  stroke: ownerState.color,
  strokeWidth: 2,
  '&.MuiMarkElement-highlighted': {
    fill: ownerState.color,
    stroke: (theme.vars || theme).palette.background.paper,
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
    isHighlighted: PropTypes.bool.isRequired,
    isNotHighlighted: PropTypes.bool.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export type MarkElementProps = Omit<MarkElementOwnerState, 'isNotHighlighted' | 'isHighlighted'> &
  React.ComponentPropsWithoutRef<'path'> & {
    /**
     * The shape of the marker.
     */
    shape: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    /**
     * The index to the element in the series' data array.
     */
    dataIndex: number;
  };

function MarkElement(props: MarkElementProps) {
  const { x, y, id, classes: innerClasses, color, shape, dataIndex, ...other } = props;
  const { axis } = React.useContext(InteractionContext);
  const isHighlighted = axis.x?.index === dataIndex;
  const someSeriesIsHighlighted = axis.x !== null;
  const ownerState = {
    id,
    classes: innerClasses,
    isHighlighted,
    isNotHighlighted: someSeriesIsHighlighted && !isHighlighted,
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
  /**
   * The shape of the marker.
   */
  shape: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'])
    .isRequired,
} as any;

export { MarkElement };
