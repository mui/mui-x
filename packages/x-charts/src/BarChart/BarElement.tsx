import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { InteractionContext } from '../context/InteractionProvider';

export interface BarElementClasses {
  /** Styles applied to the root element. */
  root: string;
}
export interface BarElementOwnerState {
  id: string;
  dataIndex: number;
  color: string;
  isNotHighlighted: boolean;
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
  // opacity: ownerState.isNotHighlighted ? 0.3 : 1,
}));

export type BarElementProps = Omit<BarElementOwnerState, 'isNotHighlighted' | 'isHighlighted'> &
  React.ComponentPropsWithoutRef<'path'>;

export function BarElement(props: BarElementProps) {
  const { id, dataIndex, classes: innerClasses, color, ...other } = props;

  const getInteractionItemProps = useInteractionItemProps();

  const { item } = React.useContext(InteractionContext);
  const someSeriesIsHighlighted = item !== null;
  const isHighlighted =
    item !== null && item.type === 'bar' && item.seriesId === id && item.dataIndex === dataIndex;

  const ownerState = {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    isNotHighlighted: someSeriesIsHighlighted && !isHighlighted,
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
