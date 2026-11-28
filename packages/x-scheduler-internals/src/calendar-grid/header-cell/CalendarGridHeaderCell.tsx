'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { useCompositeListItem } from '@base-ui/react/internals/composite';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import type { BaseTemporal } from '../../internals/utils/base-temporal';
import { getDayNumber } from '../../internals/utils/plain-date-utils/plainDate';
import { getCalendarGridHeaderCellId } from '../../internals/utils/accessibility-utils';
import { useCalendarGridCellKeyboard } from '../../internals/utils/useCalendarGridCellKeyboard';
import { useCalendarGridRootContext } from '../root/CalendarGridRootContext';
import { schedulerNowSelectors, schedulerOtherSelectors } from '../../scheduler-selectors';
import { formatWeekday } from '../../internals/utils/date-locale';

export const CalendarGridHeaderCell = React.forwardRef(function CalendarGridHeaderCell(
  componentProps: CalendarGridHeaderCell.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    // Internal props
    date,
    skipDataCurrent,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const store = useEventCalendarStoreContext();
  const { id: rootId } = useCalendarGridRootContext();
  const nowDayNumber = useStore(store, schedulerNowSelectors.nowDayNumber);
  const isCurrentDay = !skipDataCurrent && nowDayNumber === getDayNumber(date);
  const locale = useStore(store, schedulerOtherSelectors.dateLocale);

  const { ref: listItemRef, index } = useCompositeListItem();
  const id = getCalendarGridHeaderCellId(rootId, index);

  const cellRef = React.useRef<HTMLDivElement>(null);

  const keyboardProps = useCalendarGridCellKeyboard({
    rowType: 'header',
    rowIndex: 0,
    columnIndex: index,
    cellRef,
    // The header has no items to move through, Enter activates its button instead.
    onEnter: (event) => {
      if (event.key === 'Enter') {
        event.currentTarget.querySelector('button')?.click();
      }
    },
  });

  const state: CalendarGridHeaderCell.State = React.useMemo(
    () => ({
      current: isCurrentDay,
    }),
    [isCurrentDay],
  );

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, listItemRef, cellRef],
    props: [
      {
        role: 'columnheader',
        id,
        // The `aria-label` of the caller wins, so the weekday is only formatted without one.
        'aria-label': elementProps['aria-label'] ?? formatWeekday(locale, date),
        'aria-colindex': index + 1,
        'aria-current': isCurrentDay ? 'date' : undefined,
      },
      keyboardProps,
      elementProps,
    ],
  });
});

export namespace CalendarGridHeaderCell {
  export interface State {
    /**
     * Whether the header cell represents the current day.
     */
    current: boolean;
  }

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The date of the events rendered in the same column as this header cell.
     * Its weekday is the `aria-label` of the cell, unless the `aria-label` prop is set.
     */
    date: BaseTemporal.PlainDate;
    /**
     * Whether to skip adding the `data-current` and `aria-current` attributes to the root element when the header cell represents the current day.
     * This can be useful when the cells in the column are not representing a single day (e.g. in the month view).
     * @default false
     */
    skipDataCurrent?: boolean;
  }
}
