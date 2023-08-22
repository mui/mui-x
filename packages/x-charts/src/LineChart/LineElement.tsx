import * as React from 'react';
import PropTypes from 'prop-types';
import { color as d3Color } from 'd3-color';
import composeClasses from '@mui/utils/composeClasses';
import { SlotComponentProps } from '@mui/base';
import { useSlotProps } from '@mui/base/utils';
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

export interface LineElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when higlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}

export type LineElementClassKey = keyof LineElementClasses;

export interface LineElementOwnerState {
  id: string;
  color: string;
  isFaded: boolean;
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
  const { classes, id, isFaded, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getLineElementUtilityClass, classes);
};

export const LineElementPath = styled('path', {
  name: 'MuiLineElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: LineElementOwnerState }>(({ ownerState }) => ({
  strokeWidth: 2,
  strokeLinejoin: 'round',
  fill: 'none',
  stroke: ownerState.isHighlighted
    ? d3Color(ownerState.color)!.brighter(0.5).formatHex()
    : ownerState.color,
  transition: 'opacity 0.2s ease-in, stroke 0.2s ease-in',
  opacity: ownerState.isFaded ? 0.3 : 1,
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
    isFaded: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
  }).isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export type LineElementProps = Omit<LineElementOwnerState, 'isFaded' | 'isHighlighted'> &
  React.ComponentPropsWithoutRef<'path'> & {
    highlightScope?: Partial<HighlightScope>;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: {
      line?: SlotComponentProps<'path', {}, LineElementOwnerState>;
    };
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: {
      /**
       * The component that renders the root.
       * @default LineElementPath
       */
      line?: React.ElementType;
    };
  };

function LineElement(props: LineElementProps) {
  const { id, classes: innerClasses, color, highlightScope, slots, slotProps, ...other } = props;

  const getInteractionItemProps = useInteractionItemProps(highlightScope);

  const { item } = React.useContext(InteractionContext);

  const isHighlighted = getIsHighlighted(item, { type: 'line', seriesId: id }, highlightScope);
  const isFaded =
    !isHighlighted && getIsFaded(item, { type: 'line', seriesId: id }, highlightScope);

  const ownerState = {
    id,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
  };
  const classes = useUtilityClasses(ownerState);

  const Line = slots?.line ?? LineElementPath;
  const lineProps = useSlotProps({
    elementType: Line,
    externalSlotProps: slotProps?.line,
    additionalProps: {
      ...other,
      ...getInteractionItemProps({ type: 'line', seriesId: id }),
      className: classes.root,
    },
    ownerState,
  });
  return <Line {...lineProps} />;
}

LineElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  highlightScope: PropTypes.shape({
    faded: PropTypes.oneOf(['global', 'none', 'series']),
    highlighted: PropTypes.oneOf(['item', 'none', 'series']),
  }),
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { LineElement };
