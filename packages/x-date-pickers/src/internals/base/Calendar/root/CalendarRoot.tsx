'use client';
import * as React from 'react';
import { CalendarRootContext } from './CalendarRootContext';
import { useCalendarRoot } from './useCalendarRoot';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../utils/types';

const CalendarRoot = React.forwardRef(function CalendarRoot(
  props: CalendarRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    readOnly,
    disabled,
    autoFocus,
    onError,
    defaultValue,
    onValueChange,
    value,
    timezone,
    referenceDate,
    monthPageSize,
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
    ...otherProps
  } = props;
  const { context, getRootProps } = useCalendarRoot({
    readOnly,
    disabled,
    autoFocus,
    onError,
    defaultValue,
    onValueChange,
    value,
    timezone,
    referenceDate,
    monthPageSize,
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
  });

  const state: CalendarRoot.State = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getRootProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <CalendarRootContext.Provider value={context}>{renderElement()}</CalendarRootContext.Provider>
  );
});

export namespace CalendarRoot {
  export interface State {}

  export interface Props
    extends useCalendarRoot.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'value' | 'defaultValue' | 'onError'> {
    children: React.ReactNode;
  }

  export interface ValueChangeHandlerContext extends useCalendarRoot.ValueChangeHandlerContext {}
}

export { CalendarRoot };
