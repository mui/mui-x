'use client';
import * as React from 'react';
import { useCalendarMonthsList } from './useCalendarMonthsList';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRender';
import { CompositeList } from '../../composite/list/CompositeList';
import { CalendarMonthsListContext } from './CalendarMonthsListContext';

const CalendarMonthsList = React.forwardRef(function CalendarMonthsList(
  props: CalendarMonthsList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, loop, ...otherProps } = props;
  const { getMonthListProps, context, calendarMonthsCellRefs } = useCalendarMonthsList({
    children,
    loop,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getMonthListProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <CalendarMonthsListContext.Provider value={context}>
      <CompositeList elementsRef={calendarMonthsCellRefs}>{renderElement()}</CompositeList>
    </CalendarMonthsListContext.Provider>
  );
});

export namespace CalendarMonthsList {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useCalendarMonthsList.Parameters {}
}

export { CalendarMonthsList };
