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
 * Rendered below the grid and driven by the shared editing surface: arming an event (single tap)
 * expands it to a peek height showing the read-only summary; tapping the drawer expands it to full
 * height and swaps in the editing form (read-only events keep the summary).
 *
 * It reuses the desktop dialog's `FormContent` / `ReadonlyContent` so the editing experience matches
 * across platforms, and renders the shared `recurringScope` renderer for the scope confirmation.
 */
export function CompactEventDrawer() {
  const store = useEventCalendarStoreContext();
  // The drawer's open/close state comes from the shared editing surface.
  const { isOpen, onClose } = useEventEditingContext();
  // What is being edited comes from the store. During a touch resize this reflects the live
  // placeholder times, so the drawer previews the new start/end before the resize is committed.
  const occurrence = useStore(store, schedulerOtherSelectors.editingOccurrenceWithResizePreview);
  // When the drawer is closed there is no occurrence; the empty id then resolves to `false`.
  const isReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence?.id ?? '');

  // The recurring scope confirmation reads its own open state from the store and renders its own
  // shell (a centered dialog).
  const { recurringScope: RecurringScopeRenderer } = useEventEditingOptionalRenderers();

  const [expanded, setExpanded] = React.useState(false);

  // The reused dialog content expects a drag handle ref (for dragging the desktop dialog). The
  // drawer does not drag, so we pass a throwaway ref.
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
