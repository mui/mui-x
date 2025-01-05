'use client';
import * as React from 'react';
import { useCalendarDaysGridBody } from './useCalendarDaysGridBody';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRender';
import { CompositeList } from '../../composite/list/CompositeList';

const CalendarDaysGridBody = React.forwardRef(function CalendarDaysGrid(
  props: CalendarDaysGridBody.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, ...otherProps } = props;
  const { getDaysGridBodyProps, calendarDaysCellRefs } = useCalendarDaysGridBody({
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

  return <CompositeList elementsRef={calendarDaysCellRefs}>{renderElement()}</CompositeList>;
});

export namespace CalendarDaysGridBody {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useCalendarDaysGridBody.Parameters {}
}

export { CalendarDaysGridBody };
