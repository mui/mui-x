'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { grey } from '@mui/material/colors';
import { useStore } from '@base-ui/utils/store';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { useEventEditingContext } from '../event-editing';

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
  backgroundColor: grey[50],
  height: 0,
  transition: theme.transitions.create('height', {
    duration: theme.transitions.duration.shorter,
  }),
  '&[data-open]': {
    height: PEEK_HEIGHT,
    padding: theme.spacing(1.5, 2, 2, 2),
  },
  '&[data-expanded]': {
    height: '100%',
  },
}));

const CompactEventDrawerHandle = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'CompactEventDrawerHandle',
})(({ theme }) => ({
  alignSelf: 'center',
  width: 36,
  height: 4,
  flexShrink: 0,
  borderRadius: 2,
  backgroundColor: (theme.vars || theme).palette.divider,
}));

const CompactEventDrawerHeader = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'CompactEventDrawerHeader',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));

const CompactEventDrawerTitle = styled('h2', {
  name: 'MuiEventCalendar',
  slot: 'CompactEventDrawerTitle',
})(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.subtitle1.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.primary,
}));

/**
 * A mock editing drawer for the compact (mobile) day/time grid.
 *
 * Rendered below the grid and driven by the dedicated `CompactEventDrawer` context: when an
 * event is armed (selected via a single tap) it expands to a peek height — shrinking the grid
 * above it rather than overlaying it. Tapping the drawer expands it to full height; the close
 * button (or tapping the empty grid) disarms and closes it.
 *
 * The content is a placeholder only — wiring it to real event editing is intentionally out of
 * scope and will be handled in a follow-up.
 */
export function CompactEventDrawer() {
  const store = useEventCalendarStoreContext();
  // Concept 2 — the surface lifecycle (open/close) comes from the shared editing-surface modal.
  const { isOpen, onClose } = useEventEditingContext();
  // Concept 1 — *what* is being edited comes from the store (the single source of truth).
  const occurrence = useStore(store, schedulerOtherSelectors.editingOccurrence)?.occurrence;
  // When the drawer is closed there is no occurrence, so the value is unused — an empty id
  // simply resolves to `false`.
  const isReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence?.id ?? '');

  const [expanded, setExpanded] = React.useState(false);

  // Start collapsed each time the drawer opens or switches to a different occurrence.
  React.useEffect(() => {
    setExpanded(false);
  }, [occurrence?.key]);

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
      <CompactEventDrawerHandle aria-hidden />
      <CompactEventDrawerHeader>
        <CompactEventDrawerTitle>
          {isReadOnly ? 'This is non editable' : 'This is editable'}
        </CompactEventDrawerTitle>
        <IconButton
          aria-label="Close"
          size="small"
          edge="end"
          onClick={(event) => {
            // Don't let the click bubble to the drawer's expand handler.
            event.stopPropagation();
            onClose();
          }}
        >
          <CloseRounded fontSize="small" />
        </IconButton>
      </CompactEventDrawerHeader>
    </CompactEventDrawerRoot>
  );
}
