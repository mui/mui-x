'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { warnOnce } from '@mui/x-internals/warning';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { SchedulerEventOccurrence, SchedulerProcessedDate } from '@mui/x-scheduler-headless/models';
import { useAdapterContext } from '@mui/x-scheduler-headless/use-adapter-context';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { eventCalendarOccurrencePositionSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
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
  day: SchedulerProcessedDate;
}

const MoreEventsPopover = createModal<MoreEventsData>({
  contextName: 'MoreEventsPopoverContext',
});

export const MoreEventsPopoverContext = MoreEventsPopover.Context;
export const useMoreEventsPopoverContext = MoreEventsPopover.useContext;

export default function MoreEventsPopoverContent(props: MoreEventsPopoverProps) {
  const { open, anchor, day, onClose } = props;

  // Context hooks
  const adapter = useAdapterContext();
  const store = useEventCalendarStoreContext();
  const { schedulerId, classes } = useEventCalendarStyledContext();
  const { subscribeCloseHandler } = useEventDialogContext();

  // The popover content only mounts when the user clicks the trigger, so the
  // occurrences list is materialized lazily on open instead of eagerly per cell.
  const dayOccurrenceKeys = useStore(
    store,
    eventCalendarOccurrencePositionSelectors.occurrenceKeysForDay,
    day.key,
  );
  const visibleOccurrences = useStore(
    store,
    eventCalendarOccurrencePositionSelectors.visibleOccurrences,
  );
  const occurrences = React.useMemo(() => {
    const result: SchedulerEventOccurrence[] = [];
    for (const key of dayOccurrenceKeys) {
      const occurrence = visibleOccurrences.byKey.get(key);
      if (!occurrence) {
        if (process.env.NODE_ENV !== 'production') {
          warnOnce(
            `MUI X Scheduler: occurrence "${key}" is referenced by day "${day.key}" but missing ` +
              "from the occurrence index. It won't appear in the popover. " +
              'This is an internal bug — please file an issue.',
          );
        }
        continue;
      }
      result.push(occurrence);
    }
    return result;
  }, [dayOccurrenceKeys, visibleOccurrences, day.key]);

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
  day: SchedulerProcessedDate;
  children: React.ReactNode;
}

export function MoreEventsPopoverTrigger(props: MoreEventsPopoverTriggerProps) {
  const { day, ...other } = props;
  const ref = React.useRef<HTMLElement | null>(null);

  return <MoreEventsPopover.Trigger ref={ref} data={{ day }} {...other} />;
}
