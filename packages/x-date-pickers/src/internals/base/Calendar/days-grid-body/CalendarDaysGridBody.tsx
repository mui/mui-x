'use client';
import * as React from 'react';
import { useCalendarDaysGridBody } from './useCalendarDaysGridBody';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRender';

const CalendarDaysGridBody = React.forwardRef(function CalendarDaysGrid(
  props: CalendarDaysGridBody.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, ...otherProps } = props;
  const { getDaysGridBodyProps } = useCalendarDaysGridBody({
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

  return renderElement();
});

export namespace CalendarDaysGridBody {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useCalendarDaysGridBody.Parameters {}
}

export { CalendarDaysGridBody };
