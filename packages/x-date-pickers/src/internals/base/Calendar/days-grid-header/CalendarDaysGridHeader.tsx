'use client';
import * as React from 'react';
import { useCalendarDaysGridHeader } from './useCalendarDaysGridHeader';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRenderer';

const CalendarDaysGridHeader = React.forwardRef(function CalendarDaysGridHeader(
  props: CalendarDaysGridHeader.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, ...otherProps } = props;
  const { getDaysGridHeaderProps } = useCalendarDaysGridHeader({
    children,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysGridHeaderProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

export namespace CalendarDaysGridHeader {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useCalendarDaysGridHeader.Parameters {}
}

export { CalendarDaysGridHeader };
