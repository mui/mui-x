'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import type { PaletteName } from '../../../utils/tokens';
import type { TimeGridEventProps } from './TimeGridEvent.types';

export interface UseTimeGridEventReturnValue {
  isRecurring: boolean;
  isDraggable: boolean;
  isStartResizable: boolean;
  isEndResizable: boolean;
  palette: PaletteName | undefined;
  isLessThan15Minutes: boolean;
  isLessThan30Minutes: boolean;
  isBetween30and60Minutes: boolean;
  /**
   * Data attributes shared by both variants. Spread on the root of the styled wrapper.
   */
  rootDataAttributes: {
    'data-under-hour': true | undefined;
    'data-under-fifteen-minutes': true | undefined;
    'data-recurrent': true | undefined;
    'data-palette': PaletteName | undefined;
  };
  /**
   * Start / end of the occurrence, plus the CSS variables used to position
   * the event inside the time-grid column. Spread on the styled wrapper.
   */
  rootPositionProps: {
    start: TimeGridEventProps['occurrence']['displayTimezone']['start'];
    end: TimeGridEventProps['occurrence']['displayTimezone']['end'];
    style: React.CSSProperties;
  };
}

export function useTimeGridEvent(
  occurrence: TimeGridEventProps['occurrence'],
): UseTimeGridEventReturnValue {
  const store = useEventCalendarStoreContext();

  const isRecurring = useStore(store, schedulerEventSelectors.isRecurring, occurrence.id);
  const isDraggable = useStore(store, schedulerEventSelectors.isDraggable, occurrence.id);
  const isStartResizable = useStore(
    store,
    schedulerEventSelectors.isResizable,
    occurrence.id,
    'start',
  );
  const isEndResizable = useStore(store, schedulerEventSelectors.isResizable, occurrence.id, 'end');
  const palette = useStore(store, schedulerEventSelectors.color, occurrence.id);

  const durationMs =
    occurrence.displayTimezone.end.timestamp - occurrence.displayTimezone.start.timestamp;
  const durationMinutes = durationMs / 60000;
  const isBetween30and60Minutes = durationMinutes >= 30 && durationMinutes < 60;
  const isLessThan30Minutes = durationMinutes < 30;
  const isLessThan15Minutes = durationMinutes <= 15;

  const rootDataAttributes = React.useMemo(
    () => ({
      'data-under-hour': (isLessThan30Minutes || isBetween30and60Minutes || undefined) as
        true | undefined,
      'data-under-fifteen-minutes': (isLessThan15Minutes || undefined) as true | undefined,
      'data-recurrent': (isRecurring || undefined) as true | undefined,
      'data-palette': palette,
    }),
    [isLessThan30Minutes, isBetween30and60Minutes, isLessThan15Minutes, isRecurring, palette],
  );

  const rootPositionProps = React.useMemo(
    () => ({
      start: occurrence.displayTimezone.start,
      end: occurrence.displayTimezone.end,
      style: {
        '--first-index': occurrence.position.firstIndex,
        '--last-index': occurrence.position.lastIndex,
      } as React.CSSProperties,
    }),
    [
      occurrence.displayTimezone.start,
      occurrence.displayTimezone.end,
      occurrence.position.firstIndex,
      occurrence.position.lastIndex,
    ],
  );

  return {
    isRecurring,
    isDraggable,
    isStartResizable,
    isEndResizable,
    palette,
    isLessThan15Minutes,
    isLessThan30Minutes,
    isBetween30and60Minutes,
    rootDataAttributes,
    rootPositionProps,
  };
}
