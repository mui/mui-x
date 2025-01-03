'use client';
import * as React from 'react';
import { useCalendarMonthList } from './useCalendarMonthList';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRender';

const CalendarMonthList = React.forwardRef(function CalendarMonthList(
  props: CalendarMonthList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, ...otherProps } = props;
  const { getMonthListProps } = useCalendarMonthList(otherProps);
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getMonthListProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

export namespace CalendarMonthList {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useCalendarMonthList.Parameters {}
}

export { CalendarMonthList };
