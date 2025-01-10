'use client';
import * as React from 'react';
import { useBaseCalendarMonthsList } from '../../utils/base-calendar/months-list/useBaseCalendarMonthsList';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';
import { BaseCalendarMonthsGridOrListContext } from '../../utils/base-calendar/months-grid/BaseCalendarMonthsGridOrListContext';

const CalendarMonthsList = React.forwardRef(function CalendarMonthsList(
  props: CalendarMonthsList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, loop, canChangeYear, ...otherProps } = props;
  const { getMonthListProps, monthsCellRefs, monthsListOrGridContext } = useBaseCalendarMonthsList({
    children,
    loop,
    canChangeYear,
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
    <BaseCalendarMonthsGridOrListContext.Provider value={monthsListOrGridContext}>
      <CompositeList elementsRef={monthsCellRefs}>{renderElement()}</CompositeList>
    </BaseCalendarMonthsGridOrListContext.Provider>
  );
});

export namespace CalendarMonthsList {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarMonthsList.Parameters {}
}

export { CalendarMonthsList };
