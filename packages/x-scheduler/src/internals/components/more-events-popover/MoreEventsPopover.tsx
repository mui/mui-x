'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { SchedulerEventOccurrence } from '@mui/x-scheduler-headless/models';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';
import { MoreEventsPopoverProps, MoreEventsPopoverProviderProps } from './MoreEventsPopover.types';
import { EventItem } from '../event/event-item/EventItem';
import { createModal } from '../create-modal';
import { isOccurrenceAllDayOrMultipleDay } from '../../utils/event-utils';
import { formatWeekDayMonthAndDayOfMonth } from '../../utils/date-utils';
import { EventDraggableDialogTrigger, useEventDraggableDialogContext } from '../draggable-dialog';

const MoreEventsPopoverHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const MoreEventsPopoverTitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.primary,
  lineHeight: 1.5,
  margin: 0,
}));

const MoreEventsPopoverBody = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

interface MoreEventsData {
  occurrences: SchedulerEventOccurrence[];
  count: number;
  day: useEventOccurrencesWithDayGridPosition.DayData;
}

const MoreEventsPopover = createModal<MoreEventsData>({
  contextName: 'MoreEventsPopoverContext',
});

export const MoreEventsPopoverContext = MoreEventsPopover.Context;
export const useMoreEventsPopoverContext = MoreEventsPopover.useContext;

export default function MoreEventsPopoverContent(props: MoreEventsPopoverProps) {
  const { open, anchor, occurrences, day, onClose } = props;

  // Context hooks
  const adapter = useAdapter();
  const { subscribe } = useEventDraggableDialogContext();

  React.useEffect(() => {
    subscribe('close', () => {
      onClose();
    });
  }, [subscribe, onClose]);

  return (
    <Popover open={open} anchorEl={anchor} onClose={onClose}>
      <MoreEventsPopoverHeader
        id={`PopoverHeader-${day.key}`}
        aria-label={`${formatWeekDayMonthAndDayOfMonth(day.value, adapter)}`}
      >
        <MoreEventsPopoverTitle>
          {formatWeekDayMonthAndDayOfMonth(day.value, adapter)}
        </MoreEventsPopoverTitle>
      </MoreEventsPopoverHeader>
      <MoreEventsPopoverBody>
        {occurrences.map((occurrence) => (
          <EventDraggableDialogTrigger occurrence={occurrence}>
            <EventItem
              variant={isOccurrenceAllDayOrMultipleDay(occurrence, adapter) ? 'filled' : 'compact'}
              key={occurrence.key}
              occurrence={occurrence}
              date={day}
              ariaLabelledBy={`PopoverHeader-${day.key}`}
            />
          </EventDraggableDialogTrigger>
        ))}
      </MoreEventsPopoverBody>
    </Popover>
  );
}

export function MoreEventsPopoverProvider(props: MoreEventsPopoverProviderProps) {
  const { children } = props;

  return (
    <MoreEventsPopover.Provider
      render={({ isOpen, anchorRef, data, onClose }) => (
        <MoreEventsPopoverContent
          open={isOpen}
          anchor={anchorRef.current!}
          occurrences={data.occurrences}
          count={data.count}
          day={data.day}
          onClose={onClose}
        />
      )}
    >
      {children}
    </MoreEventsPopover.Provider>
  );
}

interface MoreEventsPopoverTriggerProps extends React.HTMLAttributes<HTMLElement> {
  occurrences: SchedulerEventOccurrence[];
  day: useEventOccurrencesWithDayGridPosition.DayData;
  children: React.ReactNode;
}

export function MoreEventsPopoverTrigger(props: MoreEventsPopoverTriggerProps) {
  const { occurrences, day, ...other } = props;
  const ref = React.useRef<HTMLElement | null>(null);

  return (
    <MoreEventsPopover.Trigger
      ref={ref}
      data={{ occurrences, count: occurrences.length, day }}
      {...other}
    />
  );
}
