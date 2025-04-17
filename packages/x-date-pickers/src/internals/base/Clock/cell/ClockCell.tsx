'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockCell } from './useClockCell';
import { useClockCellWrapper } from './useClockCellWrapper';

const InnerClockCell = React.forwardRef(function InnerClockCell(
  componentProps: InnerClockCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, ctx, ...elementProps } = componentProps;
  const { getCellProps } = useClockCell({
    value,
    ctx,
  });

  const state: ClockCell.State = React.useMemo(
    () => ({
      selected: ctx.isSelected,
      disabled: ctx.isDisabled,
      invalid: ctx.isInvalid,
    }),
    [ctx.isSelected, ctx.isDisabled, ctx.isInvalid],
  );

  const renderElement = useRenderElement('button', componentProps, {
    state,
    ref: [forwardedRef],
    props: [getCellProps, elementProps],
  });

  return renderElement();
});

const MemoizedInnerClockCell = React.memo(InnerClockCell);

const ClockCell = React.forwardRef(function ClockCell(
  props: ClockCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useClockCellWrapper({
    value: props.value,
    format: props.format,
    forwardedRef,
  });

  return <MemoizedInnerClockCell ref={ref} {...props} ctx={ctx} />;
});

export namespace ClockCell {
  export interface State {
    /**
     * Whether the cell is selected.
     */
    selected: boolean;
    /**
     * Whether the cell is disabled.
     */
    disabled: boolean;
    /**
     * Whether the cell is invalid.
     */
    invalid: boolean;
  }

  export interface Props
    extends Omit<BaseUIComponentProps<'button', State>, 'value'>,
      Omit<useClockCell.Parameters, 'ctx'> {}
}

interface InnerClockCellProps
  extends Omit<BaseUIComponentProps<'button', ClockCell.State>, 'value'>,
    useClockCell.Parameters {}

export { ClockCell };
