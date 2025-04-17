import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useCalendarDayGridBodyContext } from '../../utils/base-calendar/day-grid-body/CalendarDayGridBodyContext';
import type { useCalendarDayGridRow } from './useCalendarDayGridRow';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';

export function useCalendarDayGridRowWrapper(
  parameters: useCalendarDayGridRowWrapper.Parameters,
): useCalendarDayGridRowWrapper.ReturnValue {
  const { forwardedRef, value } = parameters;
  const baseDayGridBodyContext = useCalendarDayGridBodyContext();
  const { ref: listItemRef, index } = useCompositeListItem();
  const ref = useForkRef(forwardedRef, listItemRef);

  // TODO: Improve how we pass the week to the week row components.
  const days = React.useMemo(
    () => baseDayGridBodyContext.daysGrid.find((week) => week[0] === value) ?? [],
    [baseDayGridBodyContext.daysGrid, value],
  );

  const ctx = React.useMemo<useCalendarDayGridRow.Context>(
    () => ({
      days,
      rowIndex: index,
    }),
    [days, index],
  );

  return { ref, ctx };
}

export namespace useCalendarDayGridRowWrapper {
  export interface Parameters extends Pick<useCalendarDayGridRow.Parameters, 'value'> {
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
    ctx: useCalendarDayGridRow.Context;
  }
}
