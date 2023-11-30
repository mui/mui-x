import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { useSlotProps, SlotComponentProps } from '@mui/base/utils';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import { color as d3Color } from 'd3-color';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { animated } from '@react-spring/web';
import {
  getIsFaded,
  getIsHighlighted,
  useInteractionItemProps,
} from '../hooks/useInteractionItemProps';
import { InteractionContext } from '../context/InteractionProvider';
import { HighlightScope } from '../context/HighlightProvider';

export interface BarElementClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type BarElementClassKey = keyof BarElementClasses;

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

export const barElementClasses: BarElementClasses = generateUtilityClasses('MuiBarElement', [
  'root',
]);

const useUtilityClasses = (ownerState: BarElementOwnerState) => {
  const { classes, id } = ownerState;
  const slots = {
    root: ['root', `series-${id}`],
  };

  return composeClasses(slots, getBarElementUtilityClass, classes);
};

export const BarElementPath = styled(animated.rect, {
  name: 'MuiBarElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: BarElementOwnerState }>(({ ownerState }) => ({
  stroke: 'none',
  shapeRendering: 'crispEdges',
  fill: ownerState.isHighlighted
    ? d3Color(ownerState.color)!.brighter(0.5).formatHex()
    : ownerState.color,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  opacity: (ownerState.isFaded && 0.3) || 1,
}));

export type BarElementProps = Omit<BarElementOwnerState, 'isFaded' | 'isHighlighted'> &
  React.ComponentPropsWithoutRef<'path'> & {
    highlightScope?: Partial<HighlightScope>;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: {
      bar?: SlotComponentProps<'path', {}, BarElementOwnerState>;
    };
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: {
      /**
       * The component that renders the root.
       * @default BarElementPath
       */
      bar?: React.ElementType;
    };
  };

function BarElement(props: BarElementProps) {
  const {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    highlightScope,
    slots,
    slotProps,
    style,
    ...other
  } = props;
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

  const Bar = slots?.bar ?? BarElementPath;
  const barProps = useSlotProps({
    elementType: Bar,
    externalSlotProps: slotProps?.bar,
    additionalProps: {
      ...other,
      ...getInteractionItemProps({ type: 'bar', seriesId: id, dataIndex }),
      style,
      className: classes.root,
    },
    ownerState,
  });
  return <Bar {...barProps} />;
}

BarElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  dataIndex: PropTypes.number.isRequired,
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

export { BarElement };
