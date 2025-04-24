'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useBaseCalendarMonthCell } from '../../utils/base-calendar/month-cell/useBaseCalendarMonthCell';
import { useBaseCalendarMonthCellWrapper } from '../../utils/base-calendar/month-cell/useBaseCalendarMonthCellWrapper';

const InnerCalendarMonthCell = React.forwardRef(function InnerCalendarMonthCell(
  componentProps: InnerCalendarMonthCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...elementProps } = componentProps;
  const { getMonthCellProps } = useBaseCalendarMonthCell({ value, format, ctx });

  const state: CalendarMonthCell.State = React.useMemo(
    () => ({
      selected: ctx.isSelected,
      disabled: ctx.isDisabled,
      invalid: ctx.isInvalid,
      current: ctx.isCurrent,
    }),
    [ctx.isSelected, ctx.isDisabled, ctx.isInvalid, ctx.isCurrent],
  );

  const renderElement = useRenderElement('button', componentProps, {
    state,
    ref: forwardedRef,
    props: [getMonthCellProps, elementProps],
  });

  return renderElement();
});

const MemoizedInnerCalendarMonthCell = React.memo(InnerCalendarMonthCell);

const CalendarMonthCell = React.forwardRef(function CalendarMonthCell(
  props: CalendarMonthCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useBaseCalendarMonthCellWrapper({ value: props.value, forwardedRef });

  return <MemoizedInnerCalendarMonthCell {...props} ref={ref} ctx={ctx} />;
});

export namespace CalendarMonthCell {
  export interface State {
    /**
     * Whether the month is selected.
     */
    selected: boolean;
    /**
     * Whether the month is disabled.
     */
    disabled: boolean;
    /**
     * Whether the month is invalid.
     */
    invalid: boolean;
    /**
     * Whether the month contains the current date.
     */
    current: boolean;
  }

  export interface Props
    extends Omit<useBaseCalendarMonthCell.Parameters, 'ctx'>,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

interface InnerCalendarMonthCellProps
  extends useBaseCalendarMonthCell.Parameters,
    Omit<BaseUIComponentProps<'button', CalendarMonthCell.State>, 'value'> {}

export { CalendarMonthCell };
