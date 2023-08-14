import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { SlotComponentProps } from '@mui/base';
import { useSlotProps } from '@mui/base/utils';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { color as d3Color } from 'd3-color';
import {
  getIsFaded,
  getIsHighlighted,
  useInteractionItemProps,
} from '../hooks/useInteractionItemProps';
import { InteractionContext } from '../context/InteractionProvider';
import { HighlightScope } from '../context/HighlightProvider';

export interface AreaElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when higlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}

export type AreaElementClassKey = keyof AreaElementClasses;

export interface AreaElementOwnerState {
  id: string;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<AreaElementClasses>;
}

export function getAreaElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiAreaElement', slot);
}

export const areaElementClasses: AreaElementClasses = generateUtilityClasses('MuiAreaElement', [
  'root',
  'highlighted',
  'faded',
]);

const useUtilityClasses = (ownerState: AreaElementOwnerState) => {
  const { classes, id, isFaded, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getAreaElementUtilityClass, classes);
};

export const AreaElementPath = styled('path', {
  name: 'MuiAreaElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: AreaElementOwnerState }>(({ ownerState }) => ({
  stroke: 'none',
  fill: ownerState.isHighlighted
    ? d3Color(ownerState.color)!.brighter(1).formatHex()
    : d3Color(ownerState.color)!.brighter(0.5).formatHex(),
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  opacity: ownerState.isFaded ? 0.3 : 1,
}));

AreaElementPath.propTypes = {
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

export type AreaElementProps = Omit<AreaElementOwnerState, 'isFaded' | 'isHighlighted'> &
  React.ComponentPropsWithoutRef<'path'> & {
    highlightScope?: Partial<HighlightScope>;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: {
      area?: SlotComponentProps<'path', {}, AreaElementOwnerState>;
    };
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: {
      /**
       * The component that renders the root.
       * @default AreaElementPath
       */
      area?: React.ElementType;
    };
  };

function AreaElement(props: AreaElementProps) {
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

  const Area = slots?.area ?? AreaElementPath;
  const areaProps = useSlotProps({
    elementType: Area,
    externalSlotProps: slotProps?.area,
    additionalProps: {
      ...other,
      ...getInteractionItemProps({ type: 'line', seriesId: id }),
      className: classes.root,
    },
    ownerState,
  });
  return <Area {...areaProps} />;
}

AreaElement.propTypes = {
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

export { AreaElement };
