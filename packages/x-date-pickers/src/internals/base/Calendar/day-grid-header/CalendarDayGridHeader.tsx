'use client';
import * as React from 'react';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { useBaseCalendarDayGridHeader } from '../../utils/base-calendar/day-grid-header/useBaseCalendarDayGridHeader';

const CalendarDayGridHeader = React.forwardRef(function CalendarDayGridHeader(
  props: CalendarDayGridHeader.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, ...otherProps } = props;
  const { getDayGridHeaderProps } = useBaseCalendarDayGridHeader({
    children,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDayGridHeaderProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

namespace CalendarDayGridHeader {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarDayGridHeader.Parameters {}
}

export { CalendarDayGridHeader };
