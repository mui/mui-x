import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { InteractionContext } from '../context/InteractionProvider';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';

export interface LineElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when higlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}
export interface LineElementOwnerState {
  id: string;
  color: string;
  isNotHighlighted: boolean;
  isHighlighted: boolean;
  classes?: Partial<LineElementClasses>;
}

export function getLineElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiLineElement', slot);
}

export const lineElementClasses: LineElementClasses = generateUtilityClasses('MuiLineElement', [
  'root',
  'highlighted',
  'faded',
]);

const useUtilityClasses = (ownerState: LineElementOwnerState) => {
  const { classes, id, isNotHighlighted, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isNotHighlighted && 'faded'],
  };

  return composeClasses(slots, getLineElementUtilityClass, classes);
};

const LineElementPath = styled('path', {
  name: 'MuiLineElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: LineElementOwnerState }>(({ ownerState }) => ({
  stroke: ownerState.color,
  strokeWidth: 2,
  strokeLinejoin: 'round',
  fill: 'none',
  opacity: ownerState.isNotHighlighted ? 0.3 : 1,
}));

LineElementPath.propTypes = {
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
  }).isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export type LineElementProps = Omit<LineElementOwnerState, 'isNotHighlighted' | 'isHighlighted'> &
  React.ComponentPropsWithoutRef<'path'>;

function LineElement(props: LineElementProps) {
  const { id, classes: innerClasses, color, ...other } = props;

  const getInteractionItemProps = useInteractionItemProps();

  const { item } = React.useContext(InteractionContext);
  const someSeriesIsHighlighted = item !== null;
  const isHighlighted = item !== null && item.type === 'line' && item.seriesId === id;

  const ownerState = {
    id,
    classes: innerClasses,
    color,
    isNotHighlighted: someSeriesIsHighlighted && !isHighlighted,
    isHighlighted,
  };
  const classes = useUtilityClasses(ownerState);

  return (
    <LineElementPath
      {...other}
      ownerState={ownerState}
      className={classes.root}
      {...getInteractionItemProps({ type: 'line', seriesId: id })}
    />
  );
}

LineElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
} as any;

export { LineElement };
