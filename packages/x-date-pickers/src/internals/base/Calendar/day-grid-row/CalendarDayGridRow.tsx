'use client';
import * as React from 'react';
import { useCalendarDayGridRow } from './useCalendarDayGridRow';
import { useCalendarDayGridRowWrapper } from './useCalendarDayGridRowWrapper';
import { CalendarDayGridRowContext } from './CalendarDayGridRowContext';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useRenderElement } from '../../base-utils/useRenderElement';

const InnerCalendarDayGridRow = React.forwardRef(function InnerCalendarDayGridRow(
  componentProps: InnerCalendarDayGridRowProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, value, ctx, children, ...elementProps } = componentProps;
  const { getDayGridRowProps, context } = useCalendarDayGridRow({
    value,
    ctx,
    children,
  });
  const state = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: forwardedRef,
    props: [getDayGridRowProps, elementProps],
  });

  return (
    <CalendarDayGridRowContext.Provider value={context}>
      {renderElement()}
    </CalendarDayGridRowContext.Provider>
  );
});

const MemoizedInnerCalendarDayGridRow = React.memo(InnerCalendarDayGridRow);

const CalendarDayGridRow = React.forwardRef(function CalendarDayGridRow(
  props: CalendarDayGridRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { ref, ctx } = useCalendarDayGridRowWrapper({ forwardedRef, value: props.value });
  return <MemoizedInnerCalendarDayGridRow {...props} ref={ref} ctx={ctx} />;
});

export namespace CalendarDayGridRow {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      Omit<useCalendarDayGridRow.Parameters, 'ctx'> {}
}

interface InnerCalendarDayGridRowProps
  extends Omit<BaseUIComponentProps<'div', CalendarDayGridRow.State>, 'children'>,
    useCalendarDayGridRow.Parameters {}

export { CalendarDayGridRow };
