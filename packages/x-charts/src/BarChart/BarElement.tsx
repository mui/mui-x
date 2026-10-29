'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useUtilityClasses } from './barClasses';
import type { BarElementOwnerState } from './barClasses';
import { useItemHighlightState } from '../hooks/useItemHighlightState';
import { AnimatedBarElement } from './AnimatedBarElement';
import type { BarProps } from './AnimatedBarElement';
import { useIsItemFocused } from '../hooks/useIsItemFocused';
import type { BarPropsOverrides } from '../models/chartsSlotsComponentsProps';

export interface BarElementSlots {
  /**
   * The component that renders the bar.
   * @default BarElementPath
   */
  bar?: React.JSXElementConstructor<BarProps & BarPropsOverrides>;
}
export interface BarElementSlotProps {
  bar?: SlotComponentPropsFromProps<BarProps, BarPropsOverrides, BarElementOwnerState>;
}

export type BarElementProps = Omit<
  BarElementOwnerState,
  'isFaded' | 'isHighlighted' | 'isFocused'
> &
  Omit<React.SVGProps<SVGRectElement>, 'ref'> & {
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: BarElementSlotProps;
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: BarElementSlots;

    /**
     * The position of the element in the x-axis.
     */
    x: number;
    /**
     * The position in the x-axis of the stack this bar belongs to.
     */
    xOrigin: number;
    /**
     * The position of the element in the y-axis.
     */
    y: number;
    /**
     * The position in the y-axis of the stack this bar belongs to.
     */
    yOrigin: number;
    /**
     * The width of the element.
     */
    width: number;
    /**
     * The height of the element.
     */
    height: number;
    /**
     * The orientation of the bar.
     */
    layout: 'horizontal' | 'vertical';
    /**
     * If `true`, animations are skipped.
     */
    skipAnimation: boolean;
    /**
     * If `true`, the element is hidden.
     */
    hidden?: boolean;
  };

function BarElement(props: BarElementProps) {
  const {
    seriesId,
    dataIndex,
    classes: innerClasses,
    color,
    slots,
    slotProps,
    style,
    onClick,
    skipAnimation,
    layout,
    x,
    xOrigin,
    y,
    yOrigin,
    width,
    height,
    hidden,
    ...other
  } = props;
  const itemIdentifier = React.useMemo(
    () => ({ type: 'bar' as const, seriesId, dataIndex }),
    [seriesId, dataIndex],
  );
  const highlightState = useItemHighlightState(itemIdentifier);
  const isHighlighted = highlightState === 'highlighted';
  const isFaded = highlightState === 'faded';
  const isFocused = useIsItemFocused(itemIdentifier);

  const ownerState: BarElementOwnerState = {
    seriesId,
    dataIndex,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
    isFocused,
  };

  const classes = useUtilityClasses(ownerState);

  const Bar = slots?.bar ?? AnimatedBarElement;

  const barProps = useSlotProps({
    elementType: Bar,
    externalSlotProps: slotProps?.bar,
    externalForwardedProps: other,
    additionalProps: {
      seriesId,
      dataIndex,
      color,
      x,
      xOrigin,
      y,
      yOrigin,
      width,
      height,
      style,
      onClick,
      cursor: onClick ? 'pointer' : undefined,
      stroke: 'none',
      fill: color,
      skipAnimation,
      layout,
      hidden,
    },
    className: classes.element,
    ownerState,
  });

  return <Bar {...barProps} />;
}

BarElement.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The index of the data point in the series.
   */
  dataIndex: PropTypes.number.isRequired,
  /**
   * If `true`, the element is hidden.
   */
  hidden: PropTypes.bool,
  /**
   * The orientation of the bar.
   */
  layout: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  /**
   * The id of the series the element belongs to.
   */
  seriesId: PropTypes.string.isRequired,
  /**
   * If `true`, animations are skipped.
   */
  skipAnimation: PropTypes.bool.isRequired,
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
   * The position in the x-axis of the stack this bar belongs to.
   */
  xOrigin: PropTypes.number.isRequired,
  /**
   * The position in the y-axis of the stack this bar belongs to.
   */
  yOrigin: PropTypes.number.isRequired,
} as any;

export { BarElement };
