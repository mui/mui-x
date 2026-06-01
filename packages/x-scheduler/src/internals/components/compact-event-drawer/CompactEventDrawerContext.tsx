'use client';
import * as React from 'react';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { createModal } from '../create-modal';
import { CompactEventDialogProvider } from '../event-dialog';

/**
 * Dedicated modal context for the compact (mobile) editing drawer.
 *
 * It deliberately mirrors the event-dialog pattern (via the shared `createModal` factory)
 * rather than reusing the event dialog or the store's editing state. The drawer is a POC and
 * fully internal, so this small amount of duplication keeps it decoupled from the existing
 * editing architecture (no new store selectors, no coupling to `editedEventId`).
 */
const CompactEventDrawerModal = createModal<SchedulerRenderableEventOccurrence>({
  contextName: 'CompactEventDrawerContext',
});

export const useCompactEventDrawerContext = CompactEventDrawerModal.useContext;

/**
 * Sets up the compact drawer context and bridges the shared `EventDialogTrigger` (and the
 * time-grid creation flow) into it: a tap that would open the event dialog instead opens the
 * drawer, and clearing the selection also dismisses any in-progress event creation.
 */
export function CompactEventDrawerProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const store = useEventCalendarStoreContext();

  return (
    <CompactEventDrawerModal.Provider
      render={() => null}
      onClose={() => {
        // Closing the drawer also dismisses any in-progress event creation.
        store.setOccurrencePlaceholder(null);
      }}
    >
      <CompactEventDrawerBridge>{children}</CompactEventDrawerBridge>
    </CompactEventDrawerModal.Provider>
  );
}

function CompactEventDrawerBridge(props: { children: React.ReactNode }) {
  const { children } = props;
  const { onOpen, onClose } = useCompactEventDrawerContext();
  // The drawer is anchored to the view, not to the event, so no real anchor is needed.
  const anchorRef = React.useRef<HTMLElement | null>(null);

  return (
    <CompactEventDialogProvider
      onOpen={(occurrence) => onOpen(anchorRef, occurrence)}
      onClose={onClose}
    >
      {children}
    </CompactEventDialogProvider>
  );
}
