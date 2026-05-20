'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { SchedulerEventOccurrence } from '@mui/x-scheduler-internals/models';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-internals/use-event-occurrences-with-day-grid-position';
import { MoreEventsPopoverProps, MoreEventsPopoverProviderProps } from './MoreEventsPopover.types';
import { EventItem } from '../event/event-item/EventItem';
import { createModal } from '../create-modal';
import { isOccurrenceAllDayOrMultipleDay } from '../../utils/event-utils';
import { formatWeekDayMonthAndDayOfMonth } from '../../utils/date-utils';
import { EventDialogTrigger, useEventDialogContext } from '../event-dialog';
import { useEventCalendarStyledContext } from '../../../event-calendar/EventCalendarStyledContext';

const MoreEventsPopoverHeader = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MoreEventsPopoverHeader',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const MoreEventsPopoverTitle = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'MoreEventsPopoverTitle',
})(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.primary,
  lineHeight: 1.5,
  margin: 0,
}));

const MoreEventsPopoverBody = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MoreEventsPopoverBody',
})(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  width: 'fit-content',
  minWidth: 200,
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
  const adapter = useAdapterContext();
  const { schedulerId, classes } = useEventCalendarStyledContext();
  const { subscribeCloseHandler } = useEventDialogContext();

  React.useEffect(() => {
    subscribeCloseHandler(() => {
      onClose();
    });
  }, [subscribeCloseHandler, onClose]);

  return (
    <Popover className={classes.moreEventsPopover} open={open} anchorEl={anchor} onClose={onClose}>
      <MoreEventsPopoverHeader
        className={classes.moreEventsPopoverHeader}
        id={`${schedulerId}-PopoverHeader-${day.key}`}
        aria-label={`${formatWeekDayMonthAndDayOfMonth(day.value, adapter)}`}
      >
        <MoreEventsPopoverTitle className={classes.moreEventsPopoverTitle}>
          {formatWeekDayMonthAndDayOfMonth(day.value, adapter)}
        </MoreEventsPopoverTitle>
      </MoreEventsPopoverHeader>
      <MoreEventsPopoverBody className={classes.moreEventsPopoverBody}>
        {occurrences.map((occurrence) => (
          <EventDialogTrigger occurrence={occurrence} key={occurrence.key}>
            <EventItem
              variant={isOccurrenceAllDayOrMultipleDay(occurrence, adapter) ? 'filled' : 'compact'}
              occurrence={occurrence}
              date={day}
              ariaLabelledBy={`PopoverHeader-${day.key}`}
            />
          </EventDialogTrigger>
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
