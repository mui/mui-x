'use client';
import * as React from 'react';
import { createSelector, useStore } from '@base-ui/utils/store';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { useCompositeListItem } from '../../base-ui-copy/composite/list/useCompositeListItem';
import { useCompositeListContext } from '../../base-ui-copy/composite/list/CompositeListContext';
import { useAdapterContext } from '../../use-adapter-context';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { SchedulerProcessedDate, TemporalSupportedObject } from '../../models';
import { getCalendarGridHeaderCellId } from '../../internals/utils/accessibility-utils';
import { getNavigationTarget } from '../../internals/utils/getNavigationTarget';
import { useCalendarGridRootContext } from '../root/CalendarGridRootContext';
import { schedulerNowSelectors } from '../../scheduler-selectors';
import type { EventCalendarState } from '../../use-event-calendar';

const selectorIsCurrentDate = createSelector(
  (
    state: EventCalendarState,
    date: TemporalSupportedObject,
    skipDataCurrent: boolean | undefined,
  ) => !skipDataCurrent && schedulerNowSelectors.isCurrentDay(state, date),
);

export const CalendarGridHeaderCell = React.forwardRef(function CalendarGridHeaderCell(
  componentProps: CalendarGridHeaderCell.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const adapter = useAdapterContext();

  const {
    // Rendering props
    className,
    render,
    style,
    // Internal props
    date,
    skipDataCurrent,
    ariaLabelFormat = adapter.formats.weekday,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const store = useEventCalendarStoreContext();
  const {
    id: rootId,
    focusedCell,
    setFocusedCell,
    rowTypes,
    rowCounts,
  } = useCalendarGridRootContext();
  const isCurrentDay = useStore(store, selectorIsCurrentDate, date.value, skipDataCurrent);

  const { ref: listItemRef, index } = useCompositeListItem();
  const { elementsRef } = useCompositeListContext();
  const id = getCalendarGridHeaderCellId(rootId, index);

  const cellRef = React.useRef<HTMLDivElement>(null);
  const hasFocus =
    focusedCell?.rowType === 'header' &&
    focusedCell?.rowIndex === 0 &&
    focusedCell?.columnIndex === index;

  // Apply DOM focus when this cell becomes the focused cell
  React.useEffect(() => {
    if (!hasFocus || !cellRef.current) {
      return;
    }
    const focusableChild = cellRef.current.querySelector<HTMLElement>('[tabindex="0"]');
    const elementToFocus = focusableChild ?? cellRef.current;
    if (!cellRef.current.contains(document.activeElement)) {
      elementToFocus.focus({ preventScroll: true });
    }
  }, [hasFocus]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = getNavigationTarget(event.key, 'header', 0, index, {
      columnCount: elementsRef.current.length,
      rowTypes,
      rowCounts,
    });
    if (target) {
      event.preventDefault();
      setFocusedCell(target.rowType, target.rowIndex, target.columnIndex);
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
      setFocusedCell('header', 0, index);
    }
  };

  const state: CalendarGridHeaderCell.State = React.useMemo(
    () => ({
      current: isCurrentDay,
    }),
    [isCurrentDay],
  );

  const keyboardProps = {
    tabIndex: focusedCell === null || hasFocus ? 0 : -1,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
  };

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, listItemRef, cellRef],
    props: [
      elementProps,
      {
        role: 'columnheader',
        id,
        'aria-label': `${adapter.formatByString(date.value, ariaLabelFormat)}`,
      },
      keyboardProps,
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
     */
    date: SchedulerProcessedDate;
    /**
     * The format used for the `aria-label` attribute.
     * @default adapter.formats.weekday
     */
    ariaLabelFormat?: string;
    /**
     * Whether to skip adding the `data-current` attribute to the root element when the header cell represents the current day.
     * This can be useful when the cells in the column are not representing a single day (e.g. in the month view).
     * @default false
     */
    skipDataCurrent?: boolean;
  }
}
