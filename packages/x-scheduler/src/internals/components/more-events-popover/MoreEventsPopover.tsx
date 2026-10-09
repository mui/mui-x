'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
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
import { EventContextMenuTrigger } from '../event-context-menu';
import { useEventCalendarStyledContext } from '../../../event-calendar/EventCalendarStyledContext';
import { isFocusLostWith, isFocusOnDocument } from '../../utils/focus-utils';

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
  day: useEventOccurrencesWithDayGridPosition.DayData;
}

interface MoreEventsPopoverContextValue {
  openPopover: (anchorEl: HTMLElement, data: MoreEventsData) => void;
  updatePopover: (data: MoreEventsData) => void;
  closePopoverForDay: (dayKey: string) => void;
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
  const { open, anchor, cell, occurrences, day, onClose } = props;

  // Context hooks
  const adapter = useAdapterContext();
  const store = useSchedulerStoreContext();
  const { classes } = useEventCalendarStyledContext();

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

  // Where focus goes when it would be lost: the item replacing a removed one, else the "+N more"
  // button, else the cell.
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const replacementRef = React.useRef<HTMLElement | null>(null);
  const getFocusFallback = useStableCallback((): HTMLElement | null => {
    if (replacementRef.current?.isConnected) {
      return replacementRef.current;
    }
    return anchor.isConnected ? anchor : cell;
  });

  // The item last focused or right-clicked, which is the one an open context menu belongs to.
  const lastItemKeyRef = React.useRef<string | null>(null);
  const handleItemInteraction = (event: React.SyntheticEvent<HTMLDivElement>) => {
    const index = Array.from(event.currentTarget.children).findIndex((child) =>
      child.contains(event.target as Node),
    );
    lastItemKeyRef.current = occurrences[index]?.key ?? null;
  };

  // Remember which item replaces a removed one. Focus left on the document moves there now; focus
  // in the item's context menu moves there when the menu closes.
  const previousRef = React.useRef({ open, occurrences });
  useIsoLayoutEffect(() => {
    const previous = previousRef.current;
    previousRef.current = { open, occurrences };
    // Only an update of the list on screen removes items, not a reopen.
    if (!open || !previous.open) {
      replacementRef.current = null;
      return;
    }
    const isListed = (key: string) => occurrences.some((occurrence) => occurrence.key === key);
    const lastItemIndex = previous.occurrences.findIndex(
      (occurrence) => occurrence.key === lastItemKeyRef.current,
    );
    // Prefer the item the user was on, else the first removed one.
    const removedIndex =
      lastItemIndex !== -1 && !isListed(previous.occurrences[lastItemIndex].key)
        ? lastItemIndex
        : previous.occurrences.findIndex((occurrence) => !isListed(occurrence.key));
    const body = bodyRef.current;
    if (removedIndex === -1 || !body) {
      return;
    }
    // The next item still listed, else the previous one.
    const replacement =
      previous.occurrences.slice(removedIndex).find((occurrence) => isListed(occurrence.key)) ??
      previous.occurrences
        .slice(0, removedIndex)
        .findLast((occurrence) => isListed(occurrence.key));
    const replacementIndex = occurrences.findIndex(
      (occurrence) => occurrence.key === replacement?.key,
    );
    replacementRef.current = (body.children[replacementIndex] as HTMLElement | undefined) ?? null;
    if (isFocusOnDocument(body.ownerDocument)) {
      getFocusFallback()?.focus({ preventScroll: true });
    }
  }, [open, occurrences, getFocusFallback]);

  // Keeps the closing popover where the "+N more" button was, not in the top-left corner, once the
  // button unmounts.
  const anchorRectRef = React.useRef<DOMRect | null>(null);
  const anchorEl = React.useMemo(
    () => ({
      // Popover reads these to treat it as an element and to portal into the right document.
      nodeType: 1 as const,
      ownerDocument: anchor.ownerDocument,
      getBoundingClientRect: () => {
        if (anchor.isConnected || anchorRectRef.current === null) {
          anchorRectRef.current = anchor.getBoundingClientRect();
        }
        return anchorRectRef.current;
      },
    }),
    [anchor],
  );

  const restoreFocusOnExit = useStableCallback((paper: HTMLElement) => {
    if (isFocusLostWith(paper)) {
      getFocusFallback()?.focus({ preventScroll: true });
    }
  });

  return (
    <Popover
      className={classes.moreEventsPopover}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{ transition: { onExited: restoreFocusOnExit } }}
    >
      <MoreEventsPopoverHeader className={classes.moreEventsPopoverHeader}>
        <MoreEventsPopoverTitle className={classes.moreEventsPopoverTitle}>
          {formatWeekDayMonthAndDayOfMonth(day.value, adapter)}
        </MoreEventsPopoverTitle>
      </MoreEventsPopoverHeader>
      <MoreEventsPopoverBody
        ref={bodyRef}
        className={classes.moreEventsPopoverBody}
        onFocus={handleItemInteraction}
        onContextMenu={handleItemInteraction}
      >
        {occurrences.map((occurrence) => (
          <EventContextMenuTrigger
            occurrence={occurrence}
            key={occurrence.key}
            onEditingCanceled={onClose}
            // A cancellation closes this popover and unmounts the clicked item.
            stableAnchor={anchor}
            getFocusFallback={getFocusFallback}
          >
            <EventItem
              variant={isOccurrenceAllDayOrMultipleDay(occurrence, adapter) ? 'filled' : 'compact'}
              occurrence={occurrence}
              date={day}
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
  cell: HTMLElement | null;
  data: MoreEventsData | null;
}

export function MoreEventsPopoverProvider(props: MoreEventsPopoverProviderProps) {
  const { children } = props;
  const [state, setState] = React.useState<MoreEventsPopoverState>({
    open: false,
    anchorEl: null,
    cell: null,
    data: null,
  });

  const openPopover = useStableCallback((anchorEl: HTMLElement, data: MoreEventsData) => {
    setState({
      open: true,
      anchorEl,
      cell: anchorEl.closest<HTMLElement>('[role="gridcell"]'),
      data,
    });
  });

  // Keep the anchor and data, else the popover unmounts before its exit transition can play.
  const closePopover = useStableCallback(() => {
    setState((prev) => (prev.open ? { ...prev, open: false } : prev));
  });

  // The day's occurrences are laid out by the view, not stored, so the trigger pushes them.
  const updatePopover = useStableCallback((data: MoreEventsData) => {
    if (state.open && state.data?.day.key === data.day.key) {
      setState((prev) => ({ ...prev, data }));
    }
  });

  // The trigger unmounts once every event fits in the cell, taking the popover's anchor with it.
  const closePopoverForDay = useStableCallback((dayKey: string) => {
    if (state.open && state.data?.day.key === dayKey) {
      closePopover();
    }
  });

  const contextValue = React.useMemo<MoreEventsPopoverContextValue>(
    () => ({ openPopover, updatePopover, closePopoverForDay }),
    [openPopover, updatePopover, closePopoverForDay],
  );

  return (
    <MoreEventsPopoverContext.Provider value={contextValue}>
      {children}
      {state.data && state.anchorEl && (
        <MoreEventsPopoverContent
          open={state.open}
          anchor={state.anchorEl}
          cell={state.cell}
          occurrences={state.data.occurrences}
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
  const { openPopover, updatePopover, closePopoverForDay } = useMoreEventsPopoverContext();

  useIsoLayoutEffect(() => {
    updatePopover({ occurrences, day });
  }, [occurrences, day, updatePopover]);

  useIsoLayoutEffect(() => {
    return () => closePopoverForDay(day.key);
  }, [day.key, closePopoverForDay]);

  return React.cloneElement(children as React.ReactElement<any>, {
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      openPopover(event.currentTarget, { occurrences, day });
    },
  });
}
