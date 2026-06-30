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
    height: '95%',
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
  // Open/close state comes from the shared editing surface.
  const { onClose } = useEventEditingContext();

  const occurrence = useStore(store, schedulerOtherSelectors.editingOccurrence);
  const editingMode = useStore(store, schedulerOtherSelectors.editingMode);
  // When closed there's no occurrence; the empty id resolves to `false`.
  const isReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence?.id ?? '');

  // The scope confirmation reads its own open state and renders its own centered-dialog shell.
  const { recurringScopeDialog: RecurringScopeDialogRenderer } = useEventEditingOptionalRenderers();

  // The drawer is only shown while editing; arming shows the bottom toolbar instead (see CompactDayTimeGrid).
  const open = editingMode === 'edit';

  const dragHandlerRef = React.useRef<HTMLElement | null>(null);

  return (
    <React.Fragment>
      <CompactEventDrawerRoot
        anchor="bottom"
        open={open}
        // Swipe-down, backdrop press, and escape all close the drawer; mirror that on the store.
        onClose={() => onClose()}
        // The drawer is opened programmatically (from the toolbar), never by an edge swipe.
        onOpen={() => {}}
        disableSwipeToOpen
        ModalProps={{
          container: () => containerRef.current,
          disableScrollLock: true,
        }}
      >
        {occurrence && (
          <CompactEventDrawerContent>
            {isReadOnly ? (
              <CompactReadonlyContent occurrence={occurrence} onClose={onClose} />
            ) : (
              <FormContent
                key={occurrence.key}
                occurrence={occurrence}
                onClose={onClose}
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
