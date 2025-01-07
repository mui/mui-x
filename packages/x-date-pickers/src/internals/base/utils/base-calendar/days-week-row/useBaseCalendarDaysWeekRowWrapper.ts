import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { PickerValidDate } from '../../../../../models';
import { useCompositeListItem } from '../../../composite/list/useCompositeListItem';
import { useBaseCalendarDaysGridBodyContext } from '../days-grid-body/BaseCalendarDaysGridBodyContext';
import { useBaseCalendarDaysGridContext } from '../days-grid/BaseCalendarDaysGridContext';

export function useBaseCalendarDaysWeekRowWrapper({
  forwardedRef,
  value,
}: useBaseCalendarDaysWeekRowWrapper.Parameters) {
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

export namespace useBaseCalendarDaysWeekRowWrapper {
  export interface Parameters {
    forwardedRef: React.ForwardedRef<HTMLDivElement>;
    value: PickerValidDate;
  }
}
