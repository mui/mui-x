'use client';
import * as React from 'react';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { useBaseCalendarDaysGridHeader } from '../../utils/base-calendar/days-grid-header/useBaseCalendarDaysGridHeader';

const CalendarDaysGridHeader = React.forwardRef(function CalendarDaysGridHeader(
  props: CalendarDaysGridHeader.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, ...otherProps } = props;
  const { getDaysGridHeaderProps } = useBaseCalendarDaysGridHeader({
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
      useBaseCalendarDaysGridHeader.Parameters {}
}

export { CalendarDaysGridHeader };
