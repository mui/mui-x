'use client';
import * as React from 'react';
import { useCalendarYearsList } from './useCalendarYearsList';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRender';
import { CompositeList } from '../../composite/list/CompositeList';
import { CalendarYearsListContext } from './CalendarYearsListContext';

const CalendarYearsList = React.forwardRef(function CalendarYearsList(
  props: CalendarYearsList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, loop, alwaysVisible, ...otherProps } = props;
  const { getYearListProps, context, calendarYearsCellRefs, shouldRender } = useCalendarYearsList({
    children,
    loop,
    alwaysVisible,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getYearListProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  if (!shouldRender) {
    return null;
  }

  return (
    <CalendarYearsListContext.Provider value={context}>
      <CompositeList elementsRef={calendarYearsCellRefs}>{renderElement()}</CompositeList>
    </CalendarYearsListContext.Provider>
  );
});

export namespace CalendarYearsList {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useCalendarYearsList.Parameters {}
}

export { CalendarYearsList };
