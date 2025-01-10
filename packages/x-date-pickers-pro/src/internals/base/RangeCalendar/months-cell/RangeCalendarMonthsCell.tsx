'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarMonthsCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/months-cell/useBaseCalendarMonthsCell';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarMonthsCellWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/months-cell/useBaseCalendarMonthsCellWrapper';

const InnerRangeCalendarMonthsCell = React.forwardRef(function InnerRangeCalendarMonthsCell(
  props: InnerRangeCalendarMonthsCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...otherProps } = props;
  const { getMonthsCellProps, isCurrent } = useBaseCalendarMonthsCell({ value, format, ctx });

  const state: RangeCalendarMonthsCell.State = React.useMemo(
    () => ({
      selected: ctx.isSelected,
      disabled: ctx.isDisabled,
      invalid: ctx.isInvalid,
      current: isCurrent,
    }),
    [ctx.isSelected, ctx.isDisabled, ctx.isInvalid, isCurrent],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getMonthsCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

const MemoizedInnerRangeCalendarMonthsCell = React.memo(InnerRangeCalendarMonthsCell);

const RangeCalendarMonthsCell = React.forwardRef(function RangeCalendarMonthsCell(
  props: RangeCalendarMonthsCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useBaseCalendarMonthsCellWrapper({ value: props.value, forwardedRef });

  return <MemoizedInnerRangeCalendarMonthsCell {...props} ref={ref} ctx={ctx} />;
});

export namespace RangeCalendarMonthsCell {
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
    extends Omit<useBaseCalendarMonthsCell.Parameters, 'ctx'>,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

interface InnerRangeCalendarMonthsCellProps
  extends useBaseCalendarMonthsCell.Parameters,
    Omit<BaseUIComponentProps<'button', RangeCalendarMonthsCell.State>, 'value'> {}

export { RangeCalendarMonthsCell };
