'use client';
import * as React from 'react';
import { useBaseCalendarDaysGridRow } from '../../utils/base-calendar/days-grid-row/useBaseCalendarDaysGridRow';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { useBaseCalendarDaysGridRowWrapper } from '../../utils/base-calendar/days-grid-row/useBaseCalendarDaysGridRowWrapper';
import { BaseCalendarDaysGridRowContext } from '../../utils/base-calendar/days-grid-row/BaseCalendarDaysGridRowContext';

const InnerCalendarDaysGridRow = React.forwardRef(function InnerCalendarDaysGridRow(
  props: InnerCalendarDaysGridRowProps,
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

const MemoizedInnerCalendarDaysGridRow = React.memo(InnerCalendarDaysGridRow);

const CalendarDaysGridRow = React.forwardRef(function CalendarDaysGridRow(
  props: CalendarDaysGridRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { ref, ctx } = useBaseCalendarDaysGridRowWrapper({ forwardedRef, value: props.value });
  return <MemoizedInnerCalendarDaysGridRow {...props} ref={ref} ctx={ctx} />;
});

export namespace CalendarDaysGridRow {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      Omit<useBaseCalendarDaysGridRow.Parameters, 'ctx'> {}
}

interface InnerCalendarDaysGridRowProps
  extends Omit<BaseUIComponentProps<'div', CalendarDaysGridRow.State>, 'children'>,
    useBaseCalendarDaysGridRow.Parameters {}

export { CalendarDaysGridRow };
