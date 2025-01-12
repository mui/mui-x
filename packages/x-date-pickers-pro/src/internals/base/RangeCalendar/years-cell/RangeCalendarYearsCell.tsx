'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarYearsCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/years-cell/useBaseCalendarYearsCell';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarYearsCellWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/years-cell/useBaseCalendarYearsCellWrapper';

const InnerRangeCalendarYearsCell = React.forwardRef(function InnerRangeCalendarYearsCell(
  props: InnerRangeCalendarYearsCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...otherProps } = props;
  const { getYearCellProps, isCurrent } = useBaseCalendarYearsCell({ value, format, ctx });

  const state: RangeCalendarYearsCell.State = React.useMemo(
    () => ({
      selected: ctx.isSelected,
      disabled: ctx.isDisabled,
      invalid: ctx.isInvalid,
      current: isCurrent,
    }),
    [ctx.isSelected, ctx.isDisabled, ctx.isInvalid, isCurrent],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getYearCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

const MemoizedInnerRangeCalendarYearsCell = React.memo(InnerRangeCalendarYearsCell);

const RangeCalendarYearsCell = React.forwardRef(function RangeCalendarsYearCell(
  props: RangeCalendarYearsCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useBaseCalendarYearsCellWrapper({ value: props.value, forwardedRef });

  return <MemoizedInnerRangeCalendarYearsCell ref={ref} {...props} ctx={ctx} />;
});

export namespace RangeCalendarYearsCell {
  export interface State {
    /**
     * Whether the year is selected.
     */
    selected: boolean;
    /**
     * Whether the year is disabled.
     */
    disabled: boolean;
    /**
     * Whether the year is invalid.
     */
    invalid: boolean;
    /**
     * Whether the year contains the current date.
     */
    current: boolean;
  }

  export interface Props
    extends Omit<useBaseCalendarYearsCell.Parameters, 'ctx'>,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

interface InnerRangeCalendarYearsCellProps
  extends useBaseCalendarYearsCell.Parameters,
    Omit<BaseUIComponentProps<'button', RangeCalendarYearsCell.State>, 'value'> {}

export { RangeCalendarYearsCell };
