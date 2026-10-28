'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { useCompositeListItem } from '@base-ui/react/internals/composite';
import { useDirection } from '@base-ui/react/direction-provider';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import type { SchedulerProcessedDay } from '../../models';
import { getCalendarGridHeaderCellId } from '../../internals/utils/accessibility-utils';
import { getNavigationTarget } from '../../internals/utils/getNavigationTarget';
import { useCalendarGridCellsRefsContext } from '../../internals/utils/CalendarGridCellsRefsContext';
import { useCalendarGridRootContext } from '../root/CalendarGridRootContext';
import { schedulerNowSelectors, schedulerOtherSelectors } from '../../scheduler-selectors';
import { formatWeekday } from '../../internals/utils/date-locale';
import type { EventCalendarState } from '../../use-event-calendar';

const selectorIsCurrentDate = (
  state: EventCalendarState,
  timestamp: number,
  skipDataCurrent: boolean | undefined,
) => !skipDataCurrent && schedulerNowSelectors.isCurrentDay(state, timestamp);

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
  const {
    id: rootId,
    focusedCell,
    setFocusedCell,
    rowTypes,
    rowsPerType,
  } = useCalendarGridRootContext();
  const isRtl = useDirection() === 'rtl';
  const isCurrentDay = useStore(store, selectorIsCurrentDate, date.timestamp, skipDataCurrent);
  const locale = useStore(store, schedulerOtherSelectors.dateLocale);

  const { ref: listItemRef, index } = useCompositeListItem();
  const cellsRefs = useCalendarGridCellsRefsContext();
  const id = getCalendarGridHeaderCellId(rootId, index);

  const cellRef = React.useRef<HTMLDivElement>(null);
  const hasFocus =
    focusedCell?.rowType === 'header' &&
    focusedCell?.rowIndex === 0 &&
    focusedCell?.columnIndex === index;

  // Apply DOM focus when this cell becomes the focused cell
  React.useEffect(() => {
    if (hasFocus && cellRef.current && !cellRef.current.contains(document.activeElement)) {
      cellRef.current.focus({ preventScroll: true });
    }
  }, [hasFocus]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = getNavigationTarget(event.key, 'header', 0, index, {
      columnCount: cellsRefs.current.length,
      rowTypes,
      rowsPerType,
      isRtl,
    });
    if (target) {
      event.preventDefault();
      setFocusedCell(target);
      return;
    }

    if (event.key === 'Enter' && event.target === event.currentTarget) {
      const button = event.currentTarget.querySelector('button');
      if (button) {
        button.click();
      }
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setFocusedCell({ rowType: 'header', rowIndex: 0, columnIndex: index });
    }
  };

  const state: CalendarGridHeaderCell.State = React.useMemo(
    () => ({
      current: isCurrentDay,
    }),
    [isCurrentDay],
  );

  const keyboardProps = {
    tabIndex: 0,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
  };

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, listItemRef, cellRef],
    props: [
      {
        role: 'columnheader',
        id,
        'aria-label': formatWeekday(locale, date.plainDate),
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
    date: SchedulerProcessedDay;
    /**
     * Whether to skip adding the `data-current` and `aria-current` attributes to the root element when the header cell represents the current day.
     * This can be useful when the cells in the column are not representing a single day (e.g. in the month view).
     * @default false
     */
    skipDataCurrent?: boolean;
  }
}
