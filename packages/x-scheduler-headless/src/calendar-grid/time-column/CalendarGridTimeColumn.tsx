'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { useCompositeListItem } from '../../base-ui-copy/composite/list/useCompositeListItem';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { schedulerNowSelectors } from '../../scheduler-selectors';
import { CalendarGridTimeColumnContext } from './CalendarGridTimeColumnContext';
import { useTimeDropTarget } from './useTimeDropTarget';

export const CalendarGridTimeColumn = React.forwardRef(function CalendarGridTimeColumn(
  componentProps: CalendarGridTimeColumn.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    start,
    end,
    addPropertiesToDroppedEvent,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const store = useEventCalendarStoreContext();
  const isCurrentDay = useStore(store, schedulerNowSelectors.isCurrentDay, start);
  const { ref: listItemRef, index } = useCompositeListItem();

  const { getCursorPositionInElementMs, ref: dropTargetRef } = useTimeDropTarget({
    start,
    end,
    addPropertiesToDroppedEvent,
  });

  const state: CalendarGridTimeColumn.State = React.useMemo(
    () => ({
      current: isCurrentDay,
    }),
    [isCurrentDay],
  );

  const props = { role: 'gridcell' };

  const contextValue: CalendarGridTimeColumnContext = React.useMemo(
    () => ({
      start,
      end,
      index,
      getCursorPositionInElementMs,
    }),
    [start, end, index, getCursorPositionInElementMs],
  );

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, dropTargetRef, listItemRef],
    props: [props, elementProps],
  });

  return (
    <CalendarGridTimeColumnContext.Provider value={contextValue}>
      {element}
    </CalendarGridTimeColumnContext.Provider>
  );
});

export namespace CalendarGridTimeColumn {
  export interface State {
    /**
     * Whether the column represents the current day.
     */
    current: boolean;
  }

  export interface Props extends BaseUIComponentProps<'div', State>, useTimeDropTarget.Parameters {}
}
