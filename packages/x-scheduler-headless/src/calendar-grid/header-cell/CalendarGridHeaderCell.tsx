'use client';
import * as React from 'react';
import { createSelector, useStore } from '@base-ui/utils/store';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { useCompositeListItem } from '../../base-ui-copy/composite/list/useCompositeListItem';
import { useAdapter } from '../../use-adapter';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { SchedulerProcessedDate, TemporalSupportedObject } from '../../models';
import { getCalendarGridHeaderCellId } from '../../internals/utils/accessibility-utils';
import { useCalendarGridRootContext } from '../root/CalendarGridRootContext';
import { schedulerNowSelectors } from '../../scheduler-selectors';
import { EventCalendarState as State } from '../../use-event-calendar';

const selectorIsCurrentDate = createSelector(
  (state: State, date: TemporalSupportedObject, skipDataCurrent: boolean | undefined) =>
    !skipDataCurrent && schedulerNowSelectors.isCurrentDay(state, date),
);

export const CalendarGridHeaderCell = React.forwardRef(function CalendarGridHeaderCell(
  componentProps: CalendarGridHeaderCell.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const adapter = useAdapter();

  const {
    // Rendering props
    className,
    render,
    // Internal props
    date,
    skipDataCurrent,
    ariaLabelFormat = adapter.formats.weekday,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const store = useEventCalendarStoreContext();
  const { id: rootId } = useCalendarGridRootContext();
  const isCurrentDay = useStore(store, selectorIsCurrentDate, date.value, skipDataCurrent);

  const { ref: listItemRef, index } = useCompositeListItem();
  const id = getCalendarGridHeaderCellId(rootId, index);

  const props = {
    role: 'columnheader',
    id,
    'aria-label': `${adapter.formatByString(date.value, ariaLabelFormat)}`,
  };

  const state: CalendarGridHeaderCell.State = React.useMemo(
    () => ({
      current: isCurrentDay,
    }),
    [isCurrentDay],
  );

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, listItemRef],
    props: [props, elementProps],
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
