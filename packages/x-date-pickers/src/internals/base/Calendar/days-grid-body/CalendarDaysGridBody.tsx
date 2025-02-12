'use client';
import * as React from 'react';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseCalendarDaysGridBodyContext } from '../../utils/base-calendar/days-grid-body/BaseCalendarDaysGridBodyContext';
import { useBaseCalendarDaysGridBody } from '../../utils/base-calendar/days-grid-body/useBaseCalendarDaysGridBody';

const CalendarDaysGridBody = React.forwardRef(function CalendarDaysGrid(
  props: CalendarDaysGridBody.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, ...otherProps } = props;
  const { getDaysGridBodyProps, context } = useBaseCalendarDaysGridBody({
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

  return (
    <BaseCalendarDaysGridBodyContext.Provider value={context}>
      {renderElement()}
    </BaseCalendarDaysGridBodyContext.Provider>
  );
});

export namespace CalendarDaysGridBody {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarDaysGridBody.Parameters {}
}

export { CalendarDaysGridBody };
