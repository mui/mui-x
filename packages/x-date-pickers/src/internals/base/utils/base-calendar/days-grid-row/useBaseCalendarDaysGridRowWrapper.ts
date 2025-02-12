import * as React from 'react';
import { useBaseCalendarDaysGridContext } from '../days-grid/BaseCalendarDaysGridContext';
import type { useBaseCalendarDaysGridRow } from './useBaseCalendarDaysGridRow';

export function useBaseCalendarDaysGridRowWrapper(
  parameters: useBaseCalendarDaysGridRowWrapper.Parameters,
): useBaseCalendarDaysGridRowWrapper.ReturnValue {
  const { forwardedRef, value } = parameters;
  const baseDaysGridContext = useBaseCalendarDaysGridContext();

  // TODO: Improve how we pass the week to the week row components.
  const days = React.useMemo(
    () => baseDaysGridContext.daysGrid.find((week) => week[0] === value) ?? [],
    [baseDaysGridContext.daysGrid, value],
  );

  const ctx = React.useMemo(
    () => ({
      days,
    }),
    [days],
  );

  return { ref: forwardedRef, ctx };
}

export namespace useBaseCalendarDaysGridRowWrapper {
  export interface Parameters extends Pick<useBaseCalendarDaysGridRow.Parameters, 'value'> {
    /**
     * The ref forwarded by the parent component.
     */
    forwardedRef: React.ForwardedRef<HTMLDivElement>;
  }

  export interface ReturnValue {
    /**
     * The ref to forward to the component.
     */
    ref: React.ForwardedRef<HTMLDivElement> | null;
    /**
     * The memoized context to forward to the memoized component so that it does not need to subscribe to any context.
     */
    ctx: useBaseCalendarDaysGridRow.Context;
  }
}
