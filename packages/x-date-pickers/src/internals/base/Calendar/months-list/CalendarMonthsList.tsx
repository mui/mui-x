'use client';
import * as React from 'react';
import { useCalendarMonthsList } from './useCalendarMonthsList';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';

const CalendarMonthsList = React.forwardRef(function CalendarMonthsList(
  props: CalendarMonthsList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, loop, canChangeYear, ...otherProps } = props;
  const { getMonthListProps, monthsCellRefs } = useCalendarMonthsList({
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

  return <CompositeList elementsRef={monthsCellRefs}>{renderElement()}</CompositeList>;
});

export namespace CalendarMonthsList {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useCalendarMonthsList.Parameters {}
}

export { CalendarMonthsList };
