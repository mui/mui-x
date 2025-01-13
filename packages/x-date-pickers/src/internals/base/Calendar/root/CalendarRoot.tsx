'use client';
import * as React from 'react';
import { DateValidationError } from '../../../../models';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { BaseCalendarRootContext } from '../../utils/base-calendar/root/BaseCalendarRootContext';
import { useBaseCalendarRoot } from '../../utils/base-calendar/root/useBaseCalendarRoot';
import { useCalendarRoot } from './useCalendarRoot';

const CalendarRoot = React.forwardRef(function CalendarRoot(
  props: CalendarRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Form props
    readOnly,
    disabled,
    // Focus and navigation props
    monthPageSize,
    yearPageSize,
    // Value props
    onValueChange,
    defaultValue,
    value,
    timezone,
    referenceDate,
    // Visible date props
    onVisibleDateChange,
    visibleDate,
    defaultVisibleDate,
    // Validation props
    onError,
    minDate,
    maxDate,
    disablePast,
    disableFuture,
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    // Props forwarded to the DOM element
    ...otherProps
  } = props;
  const { getRootProps, baseContext, isEmpty } = useCalendarRoot({
    readOnly,
    disabled,
    monthPageSize,
    yearPageSize,
    onValueChange,
    defaultValue,
    value,
    timezone,
    referenceDate,
    onVisibleDateChange,
    visibleDate,
    defaultVisibleDate,
    onError,
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
  });

  const state: CalendarRoot.State = React.useMemo(() => ({ empty: isEmpty }), [isEmpty]);

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
      {renderElement()}
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
