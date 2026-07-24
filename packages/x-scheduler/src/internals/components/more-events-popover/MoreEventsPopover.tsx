'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { styled } from '@mui/material/styles';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import type { SchedulerEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-internals/use-event-occurrences-with-day-grid-position';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import type {
  MoreEventsPopoverProps,
  MoreEventsPopoverProviderProps,
} from './MoreEventsPopover.types';
import { EventItem } from '../event/event-item/EventItem';
import { isOccurrenceAllDayOrMultipleDay } from '../../utils/event-utils';
import { formatWeekDayMonthAndDayOfMonth } from '../../utils/date-utils';
import { EventEditingTrigger } from '../event-editing';
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

interface MoreEventsPopoverContextValue {
  openPopover: (anchorEl: HTMLElement, data: MoreEventsData) => void;
  closePopover: () => void;
}

export const MoreEventsPopoverContext = React.createContext<
  MoreEventsPopoverContextValue | undefined
>(undefined);

export function useMoreEventsPopoverContext(): MoreEventsPopoverContextValue {
  const context = React.useContext(MoreEventsPopoverContext);
  if (!context) {
    throw new Error(
      'MUI X Scheduler: `MoreEventsPopoverContext` is missing. Hook must be placed within its Provider.',
    );
  }
  return context;
}

export default function MoreEventsPopoverContent(props: MoreEventsPopoverProps) {
  const { open, anchor, occurrences, day, onClose } = props;

  // Context hooks
  const adapter = useAdapterContext();
  const store = useSchedulerStoreContext();
  const { schedulerId, classes } = useEventCalendarStyledContext();

  // The popover stays open while an editing surface is open on top of it; close it once that surface
  // closes (editing cleared on the store). The subscription only lives while the popover is mounted.
  React.useEffect(() => {
    return store.registerStoreEffect(
      (state) => state.editingOccurrence != null,
      (wasEditing, isEditing) => {
        if (wasEditing && !isEditing) {
          onClose();
        }
      },
    );
  }, [store, onClose]);

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
          <EventEditingTrigger occurrence={occurrence} key={occurrence.key}>
            <EventItem
              variant={isOccurrenceAllDayOrMultipleDay(occurrence, adapter) ? 'filled' : 'compact'}
              occurrence={occurrence}
              date={day}
              ariaLabelledBy={`${schedulerId}-PopoverHeader-${day.key}`}
            />
          </EventEditingTrigger>
        ))}
      </MoreEventsPopoverBody>
    </Popover>
  );
}

interface MoreEventsPopoverState {
  open: boolean;
  anchorEl: HTMLElement | null;
  data: MoreEventsData | null;
}

export function MoreEventsPopoverProvider(props: MoreEventsPopoverProviderProps) {
  const { children } = props;
  const [state, setState] = React.useState<MoreEventsPopoverState>({
    open: false,
    anchorEl: null,
    data: null,
  });

  const openPopover = useStableCallback((anchorEl: HTMLElement, data: MoreEventsData) => {
    setState({ open: true, anchorEl, data });
  });

  const closePopover = useStableCallback(() => {
    setState((prev) => (prev.open ? { open: false, anchorEl: null, data: null } : prev));
  });

  const contextValue = React.useMemo<MoreEventsPopoverContextValue>(
    () => ({ openPopover, closePopover }),
    [openPopover, closePopover],
  );

  return (
    <MoreEventsPopoverContext.Provider value={contextValue}>
      {children}
      {state.data && state.anchorEl && (
        <MoreEventsPopoverContent
          open={state.open}
          anchor={state.anchorEl}
          occurrences={state.data.occurrences}
          count={state.data.count}
          day={state.data.day}
          onClose={closePopover}
        />
      )}
    </MoreEventsPopoverContext.Provider>
  );
}

interface MoreEventsPopoverTriggerProps extends React.HTMLAttributes<HTMLElement> {
  occurrences: SchedulerEventOccurrence[];
  day: useEventOccurrencesWithDayGridPosition.DayData;
  children: React.ReactNode;
}

export function MoreEventsPopoverTrigger(props: MoreEventsPopoverTriggerProps) {
  const { occurrences, day, onClick, children } = props;
  const { openPopover } = useMoreEventsPopoverContext();

  return React.cloneElement(children as React.ReactElement<any>, {
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      openPopover(event.currentTarget, { occurrences, count: occurrences.length, day });
    },
  });
}
