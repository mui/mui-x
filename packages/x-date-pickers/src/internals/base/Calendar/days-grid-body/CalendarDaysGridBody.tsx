'use client';
import * as React from 'react';
import { useCalendarDaysGridBody } from './useCalendarDaysGridBody';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';
import { CalendarDaysGridBodyContext } from './CalendarDaysGridBodyContext';

const CalendarDaysGridBody = React.forwardRef(function CalendarDaysGrid(
  props: CalendarDaysGridBody.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, ...otherProps } = props;
  const { getDaysGridBodyProps, context, calendarWeekRowRefs } = useCalendarDaysGridBody({
    children,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysGridBodyProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <CalendarDaysGridBodyContext.Provider value={context}>
      <CompositeList elementsRef={calendarWeekRowRefs}>{renderElement()}</CompositeList>
    </CalendarDaysGridBodyContext.Provider>
  );
});

export namespace CalendarDaysGridBody {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useCalendarDaysGridBody.Parameters {}
}

export { CalendarDaysGridBody };
