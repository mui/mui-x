'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { drawerClasses } from '@mui/material/Drawer';
import { backdropClasses } from '@mui/material/Backdrop';
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
  useEventEditingStyledContext,
  FormContent,
} from '../event-editing';
import { CompactReadonlyContent } from './CompactReadonlyContent';

const CompactEventDrawerRoot = styled(SwipeableDrawer, {
  name: 'MuiEventCalendar',
  slot: 'CompactEventDrawer',
})(({ theme }) => ({
  position: 'absolute',
  [`& .${backdropClasses.root}`]: {
    position: 'absolute',
  },
  [`& .${drawerClasses.paper}`]: {
    position: 'absolute',
    height: 'calc(95% - 56px)',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
    borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
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

interface CompactEventDrawerProps {
  /** The compact view root; the drawer is constrained to it so it stays inside the view, not the viewport. */
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * The editing drawer for the compact (mobile) day/time grid.
 **/
export function CompactEventDrawer(props: CompactEventDrawerProps) {
  const { containerRef } = props;

  const store = useEventCalendarStoreContext();
  const { classes } = useEventEditingStyledContext();
  // Closing the drawer clears the store editing state via the shared editing context.
  const { stopEditing } = useEventEditingContext();

  const occurrence = useStore(store, schedulerOtherSelectors.editingOccurrence);
  const editingMode = useStore(store, schedulerOtherSelectors.editingMode);
  // When closed there's no occurrence; the empty id resolves to `false`.
  const isReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence?.id ?? '');

  // The scope confirmation reads its own open state and renders its own centered-dialog shell.
  const { recurringScopeDialog: RecurringScopeDialogRenderer } = useEventEditingOptionalRenderers();

  const open = editingMode === 'edit';

  const dragHandlerRef = React.useRef<HTMLElement | null>(null);
  const paperRef = React.useRef<HTMLDivElement>(null);

  return (
    <React.Fragment>
      <CompactEventDrawerRoot
        className={classes.compactEventDrawer}
        anchor="bottom"
        open={open}
        // Swipe-down, backdrop press, and escape all close the drawer; mirror that on the store.
        onClose={() => stopEditing()}
        // The drawer is opened programmatically (from the toolbar), never by an edge swipe.
        onOpen={() => {}}
        disableSwipeToOpen
        container={() => containerRef.current}
        // The focus trap would otherwise focus the paper while it's still slid off-screen, making
        // the browser scroll it into view and shove the grid up. Skip the auto-focus: the editable
        // form focuses its own title field (with `preventScroll`), and read-only content has no
        // field, so we move focus to the paper once it has slid into place.
        disableAutoFocus
        slotProps={{
          transition: {
            onEntered: isReadOnly
              ? () => paperRef.current?.focus({ preventScroll: true })
              : undefined,
          },
          paper: { ref: paperRef },
        }}
        ModalProps={{
          disableScrollLock: true,
        }}
      >
        {/* `SwipeableDrawer` keeps its children mounted even while closed, so the content is only
            rendered once the drawer is actually open. Otherwise the form mounts while the event is
            merely armed and freezes its initial times; a subsequent armed resize would then be
            discarded on save because the form never re-reads the updated occurrence. */}
        {open && occurrence && (
          <CompactEventDrawerContent className={classes.compactEventDrawerContent}>
            {isReadOnly ? (
              <CompactReadonlyContent occurrence={occurrence} onClose={stopEditing} />
            ) : (
              <FormContent
                key={occurrence.key}
                occurrence={occurrence}
                onClose={stopEditing}
                dragHandlerRef={dragHandlerRef}
                isDraggable={false}
              />
            )}
          </CompactEventDrawerContent>
        )}
      </CompactEventDrawerRoot>
      {RecurringScopeDialogRenderer && <RecurringScopeDialogRenderer />}
    </React.Fragment>
  );
}
