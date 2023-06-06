import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { InteractionContext } from '../context/InteractionProvider';
import { HighlightScope } from '../context/HighlightProvider';
import { BarItemIdentifier, LineItemIdentifier, ScatterItemIdentifier } from '../models';

export interface BarElementClasses {
  /** Styles applied to the root element. */
  root: string;
}
export interface BarElementOwnerState {
  id: string;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<BarElementClasses>;
}

export function getBarElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiBarElement', slot);
}

export const lineElementClasses: BarElementClasses = generateUtilityClasses('MuiBarElement', [
  'root',
]);

const useUtilityClasses = (ownerState: BarElementOwnerState) => {
  const { classes, id } = ownerState;
  const slots = {
    root: ['root', `series-${id}`],
  };

  return composeClasses(slots, getBarElementUtilityClass, classes);
};

const BarElementPath = styled('rect', {
  name: 'MuiBarElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: BarElementOwnerState }>(({ ownerState }) => ({
  stroke: 'none',
  shapeRendering: 'crispEdges',
  fill: ownerState.color,
  transition: 'opacity 0.2s ease-in',
  opacity: (ownerState.isFaded && 0.3) || (ownerState.isHighlighted && 1) || 0.8,
}));

export type BarElementProps = Omit<BarElementOwnerState, 'isFaded' | 'isHighlighted'> &
  React.ComponentPropsWithoutRef<'path'> & {
    highlightScope?: Partial<HighlightScope>;
  };

const getIsHighlighted = (
  selectedItem: BarItemIdentifier | LineItemIdentifier | ScatterItemIdentifier | null,
  currentItem: BarItemIdentifier,
  highlightScope?: Partial<HighlightScope>,
) => {
  if (
    !highlightScope?.highlighted ||
    highlightScope.highlighted === 'none' ||
    selectedItem === null
  ) {
    return false;
  }

  const isSeriesSelected =
    selectedItem.type === 'bar' && selectedItem.seriesId === currentItem.seriesId;

  if (!isSeriesSelected) {
    return false;
  }

  if (highlightScope.highlighted === 'series') {
    return isSeriesSelected;
  }

  return selectedItem.dataIndex === currentItem.dataIndex;
};

const getIsFaded = (
  selectedItem: BarItemIdentifier | LineItemIdentifier | ScatterItemIdentifier | null,
  currentItem: BarItemIdentifier,
  highlightScope?: Partial<HighlightScope>,
) => {
  if (!highlightScope?.faded || highlightScope.faded === 'none' || selectedItem === null) {
    return false;
  }

  const isSeriesSelected =
    selectedItem.type === 'bar' && selectedItem.seriesId === currentItem.seriesId;

  if (highlightScope.faded === 'series') {
    return isSeriesSelected && selectedItem.dataIndex !== currentItem.dataIndex;
  }
  if (highlightScope.faded === 'global') {
    if (!isSeriesSelected) {
      return true;
    }
    return selectedItem.dataIndex !== currentItem.dataIndex;
  }
  return false;
};

export function BarElement(props: BarElementProps) {
  const { id, dataIndex, classes: innerClasses, color, highlightScope, ...other } = props;
  const getInteractionItemProps = useInteractionItemProps(highlightScope);

  const { item } = React.useContext(InteractionContext);

  const isHighlighted = getIsHighlighted(
    item,
    { type: 'bar', seriesId: id, dataIndex },
    highlightScope,
  );
  const isFaded =
    !isHighlighted && getIsFaded(item, { type: 'bar', seriesId: id, dataIndex }, highlightScope);

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
    <BarElementPath
      {...other}
      ownerState={ownerState}
      className={classes.root}
      {...getInteractionItemProps({ type: 'bar', seriesId: id, dataIndex })}
    />
  );
}
