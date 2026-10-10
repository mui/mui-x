'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { useElementPositionInCollection } from '@mui/x-scheduler-internals/internals';
import type { TimelineAxis } from '@mui/x-scheduler-internals/internals';
import type { PaletteName } from '../../../utils/tokens';
import type { TimeGridEventProps } from './TimeGridEvent.types';

export interface UseTimeGridEventReturnValue {
  isRecurring: boolean;
  isDraggable: boolean;
  isStartResizable: boolean;
  isEndResizable: boolean;
  isStacked: boolean;
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
    elementPosition: useElementPositionInCollection.ReturnValue;
    style: React.CSSProperties;
  };
}

export function useTimeGridEvent(
  occurrence: TimeGridEventProps['occurrence'],
  column: TimelineAxis,
): UseTimeGridEventReturnValue {
  const store = useEventCalendarStoreContext();

  const isRecurring = useStore(store, schedulerEventSelectors.isRecurring, occurrence.id);
  const isDraggable = useStore(store, schedulerEventSelectors.isDraggable, occurrence.id);
  // While the form is open, the form owns the times, so resizing is disabled (still resizable when armed/read-only).
  const isEditedInForm = useStore(
    store,
    schedulerOtherSelectors.isEditedOccurrenceInEditMode,
    occurrence.key,
  );
  const isStartResizable =
    useStore(store, schedulerEventSelectors.isResizable, occurrence.id, 'start') && !isEditedInForm;
  const isEndResizable =
    useStore(store, schedulerEventSelectors.isResizable, occurrence.id, 'end') && !isEditedInForm;
  const palette = useStore(store, schedulerEventSelectors.color, occurrence.id, undefined);

  // Measured on the rendered part, clipped at midnight and by the visible hours.
  const elementPosition = useElementPositionInCollection({
    start: occurrence.displayTimezone.start,
    end: occurrence.displayTimezone.end,
    collection: column,
  });
  const durationMinutes = Math.round(
    elementPosition.duration * (column.dayEndMinute - column.dayStartMinute),
  );
  const isUnderHour = durationMinutes < 60;
  // Inclusive on purpose: an exactly-15-minute event gets the tightest (zero-padding) tier. See the
  // `duration thresholds` boundary tests in `DayView.test.tsx`.
  const isLessThan15Minutes = durationMinutes <= 15;

  const rootDataAttributes = React.useMemo(
    () => ({
      'data-under-hour': (isUnderHour || undefined) as true | undefined,
      'data-under-fifteen-minutes': (isLessThan15Minutes || undefined) as true | undefined,
      'data-recurrent': (isRecurring || undefined) as true | undefined,
      'data-palette': palette,
    }),
    [isUnderHour, isLessThan15Minutes, isRecurring, palette],
  );

  const rootPositionProps = React.useMemo(
    () => ({
      start: occurrence.displayTimezone.start,
      end: occurrence.displayTimezone.end,
      elementPosition,
      style: {
        '--first-index': occurrence.position.firstIndex,
        '--last-index': occurrence.position.lastIndex,
      } as React.CSSProperties,
    }),
    [
      occurrence.displayTimezone.start,
      occurrence.displayTimezone.end,
      elementPosition,
      occurrence.position.firstIndex,
      occurrence.position.lastIndex,
    ],
  );

  return {
    isRecurring,
    isDraggable,
    isStartResizable,
    isEndResizable,
    isStacked: !isUnderHour,
    rootDataAttributes,
    rootPositionProps,
  };
}
