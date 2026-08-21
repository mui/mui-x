'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { styled } from '@mui/material/styles';
import getActiveElement from '@mui/utils/getActiveElement';
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
import { EventContextMenuTrigger } from '../event-context-menu';
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

  // The popover stays open behind the editing surface, so close it when that surface closes.
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

  // Editing an event can unmount the "+N more" button, so remember the cell as a focus fallback.
  const fallbackFocusRef = React.useRef<HTMLElement | null>(null);
  useIsoLayoutEffect(() => {
    if (open && anchor) {
      fallbackFocusRef.current = anchor.closest<HTMLElement>('[role="gridcell"]');
    }
  }, [open, anchor]);

  // Restore focus when it is about to be lost with the closing popover: on the document, or on
  // something unmounting with the popover. Focus already moved elsewhere is preserved.
  const restoreFocusOnExit = useStableCallback((paper: HTMLElement) => {
    const ownerDocument = paper.ownerDocument;
    // `getActiveElement` pierces shadow roots, where `document.activeElement` stops at the host.
    const activeElement = getActiveElement(ownerDocument);
    const focusIsAboutToBeLost =
      activeElement === null ||
      activeElement === ownerDocument.body ||
      paper.contains(activeElement);
    if (!focusIsAboutToBeLost) {
      return;
    }
    const target = anchor?.isConnected ? anchor : fallbackFocusRef.current;
    target?.focus({ preventScroll: true });
  });

  return (
    <Popover
      className={classes.moreEventsPopover}
      open={open}
      anchorEl={anchor}
      onClose={onClose}
      slotProps={{ transition: { onExited: restoreFocusOnExit } }}
    >
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
          <EventEditingTrigger
            occurrence={occurrence}
            key={occurrence.key}
            onEditingCanceled={onClose}
            // A cancellation closes this popover and unmounts the clicked item.
            stableAnchor={anchor}
          >
            <EventItem
              variant={isOccurrenceAllDayOrMultipleDay(occurrence, adapter) ? 'filled' : 'compact'}
              occurrence={occurrence}
              date={day}
              ariaLabelledBy={`${schedulerId}-PopoverHeader-${day.key}`}
            />
          </EventContextMenuTrigger>
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

  // Keep the anchor and data, else the popover unmounts before its exit transition can play.
  const closePopover = useStableCallback(() => {
    setState((prev) => (prev.open ? { ...prev, open: false } : prev));
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

interface MoreEventsPopoverTriggerProps {
  occurrences: SchedulerEventOccurrence[];
  day: useEventOccurrencesWithDayGridPosition.DayData;
  /** A single element. The trigger clones it to attach its own `onClick`. */
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
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
