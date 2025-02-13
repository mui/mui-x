import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useBaseCalendarDaysGridBodyContext } from '../days-grid-body/BaseCalendarDaysGridBodyContext';
import type { useBaseCalendarDaysGridRow } from './useBaseCalendarDaysGridRow';
import { useCompositeListItem } from '../../../composite/list/useCompositeListItem';

export function useBaseCalendarDaysGridRowWrapper(
  parameters: useBaseCalendarDaysGridRowWrapper.Parameters,
): useBaseCalendarDaysGridRowWrapper.ReturnValue {
  const { forwardedRef, value } = parameters;
  const baseDaysGridBodyContext = useBaseCalendarDaysGridBodyContext();
  const { ref: listItemRef, index } = useCompositeListItem();
  const ref = useForkRef(forwardedRef, listItemRef);

  // TODO: Improve how we pass the week to the week row components.
  const days = React.useMemo(
    () => baseDaysGridBodyContext.daysGrid.find((week) => week[0] === value) ?? [],
    [baseDaysGridBodyContext.daysGrid, value],
  );

  const ctx = React.useMemo<useBaseCalendarDaysGridRow.Context>(
    () => ({
      days,
      rowIndex: index,
    }),
    [days, index],
  );

  return { ref, ctx };
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
