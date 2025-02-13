'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysGridRow } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-grid-row/useBaseCalendarDaysGridRow';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysGridRowWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-grid-row/useBaseCalendarDaysGridRowWrapper';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarDaysGridRowContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-grid-row/BaseCalendarDaysGridRowContext';

const InnerRangeCalendarDaysGridRow = React.forwardRef(function InnerRangeCalendarDaysGridRow(
  props: InnerRangeCalendarDaysGridRowProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, value, ctx, children, ...otherProps } = props;
  const { getDaysGridRowProps, context } = useBaseCalendarDaysGridRow({
    value,
    ctx,
    children,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysGridRowProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarDaysGridRowContext.Provider value={context}>
      {renderElement()}
    </BaseCalendarDaysGridRowContext.Provider>
  );
});

const MemoizedInnerRangeCalendarDaysGridRow = React.memo(InnerRangeCalendarDaysGridRow);

const RangeCalendarDaysGridRow = React.forwardRef(function CalendarDaysGridRow(
  props: RangeCalendarDaysGridRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { ref, ctx } = useBaseCalendarDaysGridRowWrapper({ forwardedRef, value: props.value });
  return <MemoizedInnerRangeCalendarDaysGridRow {...props} ref={ref} ctx={ctx} />;
});

export namespace RangeCalendarDaysGridRow {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      Omit<useBaseCalendarDaysGridRow.Parameters, 'ctx'> {}
}

interface InnerRangeCalendarDaysGridRowProps
  extends Omit<BaseUIComponentProps<'div', RangeCalendarDaysGridRow.State>, 'children'>,
    useBaseCalendarDaysGridRow.Parameters {}

export { RangeCalendarDaysGridRow };
