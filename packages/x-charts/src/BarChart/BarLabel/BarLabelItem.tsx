import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import PropTypes from 'prop-types';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useUtilityClasses } from './barLabelClasses';
import { BarLabelOwnerState, BarItem, BarLabelContext } from './BarLabel.types';
import { getBarLabel } from './getBarLabel';
import { BarLabel, BarLabelProps } from './BarLabel';
import { useItemHighlighted } from '../../hooks/useItemHighlighted';

export interface BarLabelSlots {
  /**
   * The component that renders the bar label.
   * @default BarLabel
   */
  barLabel?: React.JSXElementConstructor<BarLabelProps>;
}

export interface BarLabelSlotProps {
  barLabel?: SlotComponentPropsFromProps<BarLabelProps, {}, BarLabelOwnerState>;
}

export type BarLabelItemProps = Omit<BarLabelOwnerState, 'isFaded' | 'isHighlighted'> &
  Pick<BarLabelProps, 'style'> & {
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: BarLabelSlotProps;
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: BarLabelSlots;
    /**
     * The position of the bar in the x-axis.
     */
    x: number;
    /**
     * The position of the bar in the y-axis.
     */
    y: number;
    /**
     * The height of the bar.
     */
    height: number;
    /**
     * The width of the bar.
     */
    width: number;
    /**
     * The orientation of the bar.
     */
    layout: 'vertical' | 'horizontal';
    /**
     * The value of the data point.
     */
    value: number | null;
    /**
     * If true, no animations should be applied.
     */
    skipAnimation: boolean;
    /**
     * If provided, the function will be used to format the label of the bar.
     * It can be set to 'value' to display the current value.
     * @param {BarItem} item The item to format.
     * @param {BarLabelContext} context data about the bar.
     * @returns {string} The formatted label.
     */
    barLabel?: 'value' | ((item: BarItem, context: BarLabelContext) => string | null | undefined);
  };

/**
 * @ignore - internal component.
 */
function BarLabelItem(props: BarLabelItemProps) {
  const {
    seriesId,
    classes: innerClasses,
    color,
    dataIndex,
    barLabel,
    slots,
    slotProps,
    x,
    y,
    width,
    height,
    value,
    skipAnimation,
    layout,
    ...other
  } = props;
  const { isFaded, isHighlighted } = useItemHighlighted({
    seriesId,
    dataIndex,
  });

  const ownerState = {
    seriesId,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
    dataIndex,
    skipAnimation,
    layout,
  };
  const classes = useUtilityClasses(ownerState);

  const Component = slots?.barLabel ?? BarLabel;

  const { ownerState: barLabelOwnerState, ...barLabelProps } = useSlotProps({
    elementType: Component,
    externalSlotProps: slotProps?.barLabel,
    additionalProps: {
      ...other,
      x,
      y,
      width,
      height,
      className: classes.root,
    },
    ownerState,
  });

  if (!barLabel) {
    return null;
  }

  const formattedLabelText = getBarLabel({
    barLabel,
    value,
    dataIndex,
    seriesId,
    height,
    width,
  });

  if (!formattedLabelText) {
    return null;
  }

  return (
    <Component {...barLabelProps} {...barLabelOwnerState}>
      {formattedLabelText}
    </Component>
  );
}

BarLabelItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * If provided, the function will be used to format the label of the bar.
   * It can be set to 'value' to display the current value.
   * @param {BarItem} item The item to format.
   * @param {BarLabelContext} context data about the bar.
   * @returns {string} The formatted label.
   */
  barLabel: PropTypes.oneOfType([PropTypes.oneOf(['value']), PropTypes.func]),
  classes: PropTypes.object,
  color: PropTypes.string.isRequired,
  dataIndex: PropTypes.number.isRequired,
  /**
   * The height of the bar.
   */
  height: PropTypes.number.isRequired,
  seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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
  /**
   * The value of the data point.
   */
  value: PropTypes.number,
  /**
   * The width of the bar.
   */
  width: PropTypes.number.isRequired,
} as any;

export { BarLabelItem };
