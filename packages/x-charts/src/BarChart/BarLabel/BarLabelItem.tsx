import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import PropTypes from 'prop-types';
import type { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useUtilityClasses } from '../barClasses';
import type { BarLabelOwnerState } from './BarLabel.types';
import { BarLabel } from './BarLabel';
import type { BarLabelProps } from './BarLabel';
import { useItemHighlightState } from '../../hooks/useItemHighlightState';
import type { ChartSeriesType } from '../../models/seriesType/config';
import type { BarLabelPropsOverrides } from '../../models/chartsSlotsComponentsProps';

/**
 * The series types whose bars can render a label: `'bar'`, and `'rangeBar'` when it is registered.
 */
type BarLabelSeriesType = Extract<ChartSeriesType, 'bar' | 'rangeBar'>;

export interface BarLabelSlots {
  /**
   * The component that renders the bar label.
   * @default BarLabel
   */
  barLabel?: React.JSXElementConstructor<BarLabelProps & BarLabelPropsOverrides>;
}

export interface BarLabelSlotProps {
  barLabel?: SlotComponentPropsFromProps<BarLabelProps, BarLabelPropsOverrides, BarLabelOwnerState>;
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
     * The position in the x-axis of the origin the bar grows from.
     */
    xOrigin: number;
    /**
     * The position in the y-axis of the origin the bar grows from.
     */
    yOrigin: number;
    /**
     * The position of the box the label is placed in, in the x-axis.
     */
    x: number;
    /**
     * The position of the box the label is placed in, in the y-axis.
     */
    y: number;
    /**
     * The height of the box the label is placed in.
     */
    height: number;
    /**
     * The width of the box the label is placed in.
     */
    width: number;
    /**
     * The orientation of the bar.
     */
    layout: 'vertical' | 'horizontal';
    /**
     * The type of the series the bar belongs to.
     * It is used to get the highlight state of the label.
     * @default 'bar'
     */
    seriesType?: BarLabelSeriesType;
    /**
     * If true, no animations should be applied.
     */
    skipAnimation: boolean;
    /**
     * The text of the label, formatted from the `barLabel` property of the series.
     * Nothing is rendered if it is empty.
     */
    label: string | number | null | undefined;
    /**
     * The placement of the bar label.
     * It controls whether the label is rendered in the center or outside the bar.
     * @default 'center'
     */
    barLabelPlacement?: BarLabelProps['placement'];
    /** If true, the bar label is hidden. */
    hidden?: boolean;
  };

/**
 * @ignore - internal component.
 */
function BarLabelItem(props: BarLabelItemProps) {
  const {
    seriesId,
    seriesType = 'bar',
    classes: innerClasses,
    color,
    dataIndex,
    label,
    slots,
    slotProps,
    xOrigin,
    yOrigin,
    x,
    y,
    width,
    height,
    skipAnimation,
    layout,
    barLabelPlacement,
    hidden,
    ...other
  } = props;
  const highlightState = useItemHighlightState({
    type: seriesType,
    seriesId,
    dataIndex,
  });
  const isHighlighted = highlightState === 'highlighted';
  const isFaded = highlightState === 'faded';

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
      xOrigin,
      yOrigin,
      x,
      y,
      width,
      height,
      placement: barLabelPlacement,
      className: classes.label,
      'data-highlighted': isHighlighted || undefined,
      'data-faded': isFaded || undefined,
    },
    ownerState,
  });

  if (!label) {
    return null;
  }

  return (
    <Component {...barLabelProps} {...barLabelOwnerState} hidden={hidden}>
      {label}
    </Component>
  );
}

BarLabelItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  color: PropTypes.string.isRequired,
  dataIndex: PropTypes.number.isRequired,
  /**
   * The height of the box the label is placed in.
   */
  height: PropTypes.number.isRequired,
  /**
   * The text of the label, formatted from the `barLabel` property of the series.
   * Nothing is rendered if it is empty.
   */
  label: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The type of the series the bar belongs to.
   * It is used to get the highlight state of the label.
   * @default 'bar'
   */
  seriesType: PropTypes.oneOf(['bar', 'rangeBar']),
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
   * The width of the box the label is placed in.
   */
  width: PropTypes.number.isRequired,
} as any;

export { BarLabelItem };
