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

// Collapsed ("peek") drawer height as a fraction of the view; tapping expands it to full height.
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
  ...theme.applyStyles('dark', {
    backgroundColor: (theme.vars || theme).palette.grey[900],
  }),
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

// Scrolls the editing content; relaxes the reused dialog's fixed desktop width to fill the drawer.
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
 * peeks the read-only summary; tapping the drawer expands to full height and swaps in the form
 * (read-only events keep the summary).
 *
 * Reuses the shared `FormContent`, `CompactReadonlyContent` summary, and `recurringScopeDialog`
 * renderer so the editing experience matches across platforms.
 */
export function CompactEventDrawer() {
  const store = useEventCalendarStoreContext();
  // Open/close state comes from the shared editing surface.
  const { isOpen, onClose } = useEventEditingContext();
  // During a touch resize this reflects the live placeholder times, previewing the new start/end before commit.
  const occurrence = useStore(store, schedulerOtherSelectors.editingOccurrenceWithResizePreview);
  // When closed there's no occurrence; the empty id resolves to `false`.
  const isReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence?.id ?? '');

  // The scope confirmation reads its own open state and renders its own centered-dialog shell.
  const { recurringScopeDialog: RecurringScopeDialogRenderer } = useEventEditingOptionalRenderers();

  // Driven by the shared editing mode, so peek resets on each newly armed occurrence (`startEditing(..., 'readonly')`).
  const editingMode = useStore(store, schedulerOtherSelectors.editingMode);
  const expanded = editingMode === 'edit';

  // The reused dialog content needs a drag handle ref; the drawer doesn't drag, so pass a throwaway ref + `isDraggable={false}`.
  const dragHandlerRef = React.useRef<HTMLElement | null>(null);

  // Expanding swaps in the form unless read-only, where the summary stays.
  const showForm = expanded && !isReadOnly;

  return (
    <CompactEventDrawerRoot
      data-open={isOpen || undefined}
      data-expanded={(isOpen && expanded) || undefined}
      aria-hidden={!isOpen}
      onClick={() => {
        if (isOpen && !expanded && !isReadOnly) {
          store.setEditingMode('edit');
        }
      }}
    >
      {isOpen && occurrence && (
        <CompactEventDrawerContent>
          {showForm ? (
            <FormContent
              key={occurrence.key}
              occurrence={occurrence}
              onClose={onClose}
              dragHandlerRef={dragHandlerRef}
              isDraggable={false}
            />
          ) : (
            <CompactReadonlyContent occurrence={occurrence} onClose={onClose} />
          )}
        </CompactEventDrawerContent>
      )}
      {RecurringScopeDialogRenderer && <RecurringScopeDialogRenderer />}
    </CompactEventDrawerRoot>
  );
}
