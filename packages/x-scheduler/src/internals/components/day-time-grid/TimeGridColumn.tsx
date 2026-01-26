'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import { EVENT_CREATION_PRECISION_MINUTE } from '@mui/x-scheduler-headless/constants';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { useAdapter, isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';
import { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-timeline-position';
import { eventCalendarOccurrencePlaceholderSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { TimeGridEvent } from '../event/time-grid-event/TimeGridEvent';
import {
  EventPopoverTrigger,
  useEventPopoverContext,
} from '../../../internals/components/event-popover/EventPopover';
import { useEventCreationProps } from '../../hooks/useEventCreationProps';
import { useEventCalendarClasses } from '../../../event-calendar/EventCalendarClassesContext';

const DayTimeGridColumn = styled(CalendarGrid.TimeColumn, {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridColumn',
})(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 0,
  minWidth: 0,
  position: 'relative',
  '&:first-of-type': {
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
  '&[data-weekend]': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DayTimeGridColumnInteractiveLayer = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridColumnInteractiveLayer',
})({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

const DayTimeGridCurrentTimeIndicator = styled(CalendarGrid.CurrentTimeIndicator, {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridCurrentTimeIndicator',
})(({ theme }) => ({
  position: 'absolute',
  top: 'var(--y-position)',
  left: 0,
  right: -1,
  height: 0,
  borderTop: `2px solid ${theme.palette.primary.main}`,
}));

const DayTimeGridCurrentTimeIndicatorCircle = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridCurrentTimeIndicatorCircle',
})(({ theme }) => ({
  position: 'absolute',
  zIndex: 1,
  left: -5,
  top: -5,
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
}));

export function TimeGridColumn(props: TimeGridColumnProps) {
  const { day, showCurrentTimeIndicator, index } = props;

  const adapter = useAdapter();
  const classes = useEventCalendarClasses();
  const start = React.useMemo(() => adapter.startOfDay(day.value), [adapter, day]);
  const end = React.useMemo(() => adapter.endOfDay(day.value), [adapter, day]);
  const { occurrences, maxIndex } = useEventOccurrencesWithTimelinePosition({
    occurrences: day.withoutPosition,
    maxSpan: Infinity,
  });

  return (
    <DayTimeGridColumn
      className={classes.dayTimeGridColumn}
      start={start}
      end={end}
      addPropertiesToDroppedEvent={addPropertiesToDroppedEvent}
      data-weekend={isWeekend(adapter, day.value) || undefined}
      style={{ '--columns-count': maxIndex } as React.CSSProperties}
    >
      <ColumnInteractiveLayer
        start={start}
        end={end}
        showCurrentTimeIndicator={showCurrentTimeIndicator}
        index={index}
        occurrences={occurrences}
        maxIndex={maxIndex}
      />
    </DayTimeGridColumn>
  );
}

function ColumnInteractiveLayer({
  start,
  end,
  showCurrentTimeIndicator,
  index,
  occurrences,
  maxIndex,
}: {
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
  showCurrentTimeIndicator: boolean;
  index: number;
  occurrences: useEventOccurrencesWithTimelinePosition.EventOccurrenceWithPosition[];
  maxIndex: number;
}) {
  // Context hooks
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const classes = useEventCalendarClasses();
  const { open: startEditing } = useEventPopoverContext();

  // Ref hooks
  const columnRef = React.useRef<HTMLDivElement | null>(null);

  // Selector hooks
  const isCreatingAnEvent = useStore(
    store,
    eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange,
    start,
    end,
  );
  const placeholder = CalendarGrid.usePlaceholderInRange({ start, end, occurrences, maxIndex });

  // Feature hooks
  const getDateFromPosition = CalendarGrid.useGetDateFromPositionInColumn({
    elementRef: columnRef,
    snapMinutes: EVENT_CREATION_PRECISION_MINUTE,
  });

  const eventCreationProps = useEventCreationProps(({ event, creationConfig }) => {
    const startDateFromPosition = getDateFromPosition(event.clientY);
    const draftRange = {
      start: startDateFromPosition,
      end: adapter.addMinutes(startDateFromPosition, creationConfig.duration),
    };

    store.setOccurrencePlaceholder({
      type: 'creation',
      surfaceType: 'time-grid',
      start: draftRange.start,
      end: draftRange.end,
      resourceId: null,
    });
  });

  React.useEffect(() => {
    if (!isCreatingAnEvent || !placeholder || !columnRef.current) {
      return;
    }
    startEditing(columnRef.current, placeholder);
  }, [isCreatingAnEvent, placeholder, startEditing]);

  return (
    <DayTimeGridColumnInteractiveLayer
      className={classes.dayTimeGridColumnInteractiveLayer}
      ref={columnRef}
      {...eventCreationProps}
    >
      {occurrences.map((occurrence) => (
        <EventPopoverTrigger
          key={occurrence.key}
          occurrence={occurrence}
          render={<TimeGridEvent occurrence={occurrence} variant="regular" />}
        />
      ))}
      {placeholder != null && <TimeGridEvent occurrence={placeholder} variant="placeholder" />}
      {showCurrentTimeIndicator ? (
        <DayTimeGridCurrentTimeIndicator className={classes.dayTimeGridCurrentTimeIndicator}>
          {index === 0 && (
            <DayTimeGridCurrentTimeIndicatorCircle
              className={classes.dayTimeGridCurrentTimeIndicatorCircle}
            />
          )}
        </DayTimeGridCurrentTimeIndicator>
      ) : null}
    </DayTimeGridColumnInteractiveLayer>
  );
}

interface TimeGridColumnProps {
  day: useEventOccurrencesWithDayGridPosition.DayData;
  index: number;
  showCurrentTimeIndicator: boolean;
}

/**
 * Makes sure any event dropped in the time grid column is turned into an non all-day event.
 */
function addPropertiesToDroppedEvent() {
  return {
    allDay: false,
  };
}
