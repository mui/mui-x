'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { eventCalendarClasses } from '../../../event-calendar/eventCalendarClasses';
import {
  useEventEditingContext,
  useEventEditingOptionalRenderers,
  FormContent,
} from '../event-editing';
import { CompactReadonlyContent } from './CompactReadonlyContent';

// Height of the collapsed ("peek") drawer as a fraction of the compact view. The grid above
// shrinks to make room for it; tapping the drawer expands it to the full height.
const PEEK_HEIGHT = '35%';

const CompactEventDrawerRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'CompactEventDrawer',
})(({ theme }) => ({
  flexShrink: 0,
  boxSizing: 'border-box',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  backgroundColor: (theme.vars || theme).palette.grey[50],
  height: 0,
  transition: theme.transitions.create('height', {
    duration: theme.transitions.duration.shorter,
  }),
  '&[data-open]': {
    height: PEEK_HEIGHT,
    paddingTop: theme.spacing(1),
  },
  '&[data-expanded]': {
    height: '100%',
  },
}));

// Scrolls the editing content within the drawer. The reused dialog content is sized for the desktop
// dialog (a fixed width), so we relax that constraint to let it fill the drawer's width instead.
const CompactEventDrawerContent = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'CompactEventDrawerContent',
})({
  flex: '1 1 0',
  minHeight: 0,
  overflowY: 'auto',
  [`& .${eventCalendarClasses.eventDialogContent}`]: {
    width: '100%',
    minWidth: 0,
  },
});

/**
 * The editing drawer for the compact (mobile) day/time grid.
 *
 * Rendered below the grid and driven by the shared editing surface (`EventEditingContext`): when an
 * event is armed (selected via a single tap) it expands to a peek height — shrinking the grid above
 * it rather than overlaying it — and shows the read-only summary. Tapping the drawer expands it to
 * full height and swaps in the editing form (or keeps the read-only summary for read-only events).
 *
 * It reuses the exact same `FormContent` / `ReadonlyContent` as the desktop dialog (including their
 * own header, close button and actions), so the editing experience matches across platforms, and
 * stacks the recurring scope confirmation by rendering the shared `recurringScope` renderer.
 */
export function CompactEventDrawer() {
  const store = useEventCalendarStoreContext();
  // Concept 2 — the surface lifecycle (open/close) comes from the shared editing surface.
  const { isOpen, onClose } = useEventEditingContext();
  // Concept 1 — *what* is being edited comes from the store (the single source of truth). While a
  // touch resize is in progress, this reflects the live placeholder times so the drawer previews
  // the new start/end before the resize is committed.
  const occurrence = useStore(store, schedulerOtherSelectors.editingOccurrenceWithResizePreview);
  // When the drawer is closed there is no occurrence, so the value is unused — an empty id
  // simply resolves to `false`.
  const isReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence?.id ?? '');

  // The recurring scope confirmation renders itself: it reads its open state from the store and
  // renders its own shell (a centered dialog).
  const { recurringScope: RecurringScopeRenderer } = useEventEditingOptionalRenderers();

  const [expanded, setExpanded] = React.useState(false);

  // Reused dialog content expects a drag handle ref (used to drag the desktop dialog). The drawer
  // does not drag, so a throwaway ref keeps the shared content components happy.
  const dragHandlerRef = React.useRef<HTMLElement | null>(null);

  // Start collapsed each time the drawer opens or switches to a different occurrence.
  React.useEffect(() => {
    setExpanded(false);
  }, [occurrence?.key]);

  // Peek shows the read-only summary; expanding swaps in the form, unless the event (or the whole
  // calendar) is read-only, in which case the summary stays.
  const showForm = expanded && !isReadOnly;

  return (
    <CompactEventDrawerRoot
      data-open={isOpen || undefined}
      data-expanded={(isOpen && expanded) || undefined}
      aria-hidden={!isOpen}
      onClick={() => {
        if (isOpen && !expanded) {
          setExpanded(true);
        }
      }}
    >
      {isOpen && occurrence && (
        <CompactEventDrawerContent>
          {showForm ? (
            <FormContent
              occurrence={occurrence}
              onClose={onClose}
              dragHandlerRef={dragHandlerRef}
            />
          ) : (
            <CompactReadonlyContent occurrence={occurrence} onClose={onClose} />
          )}
        </CompactEventDrawerContent>
      )}
      {RecurringScopeRenderer && <RecurringScopeRenderer />}
    </CompactEventDrawerRoot>
  );
}
