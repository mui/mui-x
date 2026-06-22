import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import { type SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useUtilityClasses } from '../scatterClasses';
import { type ScatterClasses } from '../scatterClasses';
import { MarkerLabel, type MarkerLabelOwnerState, type MarkerLabelProps } from './MarkerLabel';

export interface MarkerLabelSlots {
  /**
   * The component that renders the marker label.
   * @default MarkerLabel
   */
  markerLabel?: React.JSXElementConstructor<MarkerLabelProps>;
}

export interface MarkerLabelSlotProps {
  markerLabel?: SlotComponentPropsFromProps<MarkerLabelProps, {}, MarkerLabelOwnerState>;
}

export type MarkerLabelItemProps = {
  classes?: Partial<ScatterClasses>;
  slotProps?: MarkerLabelSlotProps;
  slots?: MarkerLabelSlots;
  /**
   * The position of the marker in the x-axis.
   */
  x: number;
  /**
   * The position of the marker in the y-axis.
   */
  y: number;
  /**
   * The resolved label to display.
   */
  text: string;
  /**
   * If `true`, the label is highlighted.
   */
  isHighlighted: boolean;
  /**
   * If `true`, the label is faded.
   */
  isFaded: boolean;
};

function MarkerLabelItem(props: MarkerLabelItemProps) {
  const { classes: innerClasses, slots, slotProps, x, y, text, isHighlighted, isFaded } = props;

  const ownerState: MarkerLabelOwnerState = {
    classes: innerClasses,
    isFaded,
  };
  const classes = useUtilityClasses(ownerState);

  const Component = slots?.markerLabel ?? MarkerLabel;

  const { ownerState: markerLabelOwnerState, ...markerLabelProps } = useSlotProps({
    elementType: Component,
    externalSlotProps: slotProps?.markerLabel,
    additionalProps: {
      x,
      y,
      className: classes.label,
      'data-highlighted': isHighlighted || undefined,
      'data-faded': isFaded || undefined,
    },
    ownerState,
  });

  return (
    <Component {...markerLabelProps} {...markerLabelOwnerState}>
      {text}
    </Component>
  );
}

MarkerLabelItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  text: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
} as any;

export { MarkerLabelItem };
