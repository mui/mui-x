'use client';
import * as React from 'react';
import { useBaseCalendarDayGridRow } from '../../utils/base-calendar/day-grid-row/useBaseCalendarDayGridRow';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { useBaseCalendarDayGridRowWrapper } from '../../utils/base-calendar/day-grid-row/useBaseCalendarDayGridRowWrapper';
import { BaseCalendarDayGridRowContext } from '../../utils/base-calendar/day-grid-row/BaseCalendarDayGridRowContext';

const InnerCalendarDayGridRow = React.forwardRef(function InnerCalendarDayGridRow(
  props: InnerCalendarDayGridRowProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, value, ctx, children, ...otherProps } = props;
  const { getDayGridRowProps, context } = useBaseCalendarDayGridRow({
    value,
    ctx,
    children,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDayGridRowProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarDayGridRowContext.Provider value={context}>
      {renderElement()}
    </BaseCalendarDayGridRowContext.Provider>
  );
});

const MemoizedInnerCalendarDayGridRow = React.memo(InnerCalendarDayGridRow);

const CalendarDayGridRow = React.forwardRef(function CalendarDayGridRow(
  props: CalendarDayGridRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { ref, ctx } = useBaseCalendarDayGridRowWrapper({ forwardedRef, value: props.value });
  return <MemoizedInnerCalendarDayGridRow {...props} ref={ref} ctx={ctx} />;
});

namespace CalendarDayGridRow {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      Omit<useBaseCalendarDayGridRow.Parameters, 'ctx'> {}
}

interface InnerCalendarDayGridRowProps
  extends Omit<BaseUIComponentProps<'div', CalendarDayGridRow.State>, 'children'>,
    useBaseCalendarDayGridRow.Parameters {}

export { CalendarDayGridRow };
