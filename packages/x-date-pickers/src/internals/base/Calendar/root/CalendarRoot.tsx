'use client';
import * as React from 'react';
import { DateValidationError } from '../../../../models';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { BaseCalendarRootContext } from '../../utils/base-calendar/root/BaseCalendarRootContext';
import { useBaseCalendarRoot } from '../../utils/base-calendar/root/useBaseCalendarRoot';
import { CalendarRootContext } from './CalendarRootContext';
import { useCalendarRoot } from './useCalendarRoot';

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
    yearPageSize,
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
    ...otherProps
  } = props;
  const { getRootProps, context, baseContext } = useCalendarRoot({
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
    yearPageSize,
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
    <BaseCalendarRootContext.Provider value={baseContext}>
      <CalendarRootContext.Provider value={context}>{renderElement()}</CalendarRootContext.Provider>
    </BaseCalendarRootContext.Provider>
  );
});

export namespace CalendarRoot {
  export interface State {}

  export interface Props
    extends useCalendarRoot.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'value' | 'defaultValue' | 'onError'> {
    children: React.ReactNode;
  }

  export interface ValueChangeHandlerContext
    extends useBaseCalendarRoot.ValueChangeHandlerContext<DateValidationError> {}
}

export { CalendarRoot };
