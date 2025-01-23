import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useCompositeListItem } from '../../../composite/list/useCompositeListItem';
import { useBaseCalendarDaysGridBodyContext } from '../days-grid-body/BaseCalendarDaysGridBodyContext';
import { useBaseCalendarDaysGridContext } from '../days-grid/BaseCalendarDaysGridContext';
import type { useBaseCalendarDaysGridRow } from './useBaseCalendarDaysGridRow';

export function useBaseCalendarDaysGridRowWrapper(
  parameters: useBaseCalendarDaysGridRowWrapper.Parameters,
): useBaseCalendarDaysGridRowWrapper.ReturnValue {
  const { forwardedRef, value } = parameters;
  const baseDaysGridContext = useBaseCalendarDaysGridContext();
  const baseDaysGridBodyContext = useBaseCalendarDaysGridBodyContext();
  const { ref: listItemRef, index: rowIndex } = useCompositeListItem();
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  // TODO: Improve how we pass the week to the week row components.
  const days = React.useMemo(
    () => baseDaysGridContext.daysGrid.find((week) => week[0] === value) ?? [],
    [baseDaysGridContext.daysGrid, value],
  );

  const ctx = React.useMemo(
    () => ({
      days,
      rowIndex,
      registerWeekRowCells: baseDaysGridBodyContext.registerWeekRowCells,
    }),
    [days, rowIndex, baseDaysGridBodyContext.registerWeekRowCells],
  );

  return { ref: mergedRef, ctx };
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
    ref: React.RefCallback<HTMLDivElement> | null;
    /**
     * The memoized context to forward to the memoized component so that it does not need to subscribe to any context.
     */
    ctx: useBaseCalendarDaysGridRow.Context;
  }
}
