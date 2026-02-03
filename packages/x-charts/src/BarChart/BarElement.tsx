'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import { type SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { type BarElementOwnerState, useUtilityClasses } from './barElementClasses';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { useItemHighlighted } from '../hooks/useItemHighlighted';
import { AnimatedBarElement, type BarProps } from './AnimatedBarElement';
import { useIsItemFocused } from '../hooks/useIsItemFocused';

export interface BarElementSlots {
  /**
   * The component that renders the bar.
   * @default BarElementPath
   */
  bar?: React.JSXElementConstructor<BarProps>;
}
export interface BarElementSlotProps {
  bar?: SlotComponentPropsFromProps<BarProps, {}, BarElementOwnerState>;
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

    x: number;
    xOrigin: number;
    y: number;
    yOrigin: number;
    width: number;
    height: number;
    layout: 'horizontal' | 'vertical';
    skipAnimation: boolean;
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
  const interactionProps = useInteractionItemProps(itemIdentifier);
  const { isFaded, isHighlighted } = useItemHighlighted(itemIdentifier);
  const isFocused = useIsItemFocused(
    React.useMemo(
      () => ({
        type: 'bar',
        seriesId,
        dataIndex,
      }),
      [seriesId, dataIndex],
    ),
  );

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
      ...interactionProps,
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
      cursor: onClick ? 'pointer' : 'unset',
      stroke: 'none',
      fill: color,
      skipAnimation,
      layout,
      hidden,
    },
    className: classes.root,
    ownerState,
  });

  return <Bar {...barProps} />;
}

BarElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  dataIndex: PropTypes.number.isRequired,
  layout: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  seriesId: PropTypes.string.isRequired,
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
  xOrigin: PropTypes.number.isRequired,
  yOrigin: PropTypes.number.isRequired,
} as any;

export { BarElement };
