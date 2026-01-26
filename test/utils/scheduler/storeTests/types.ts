import type { TemporalAdapter } from '@mui/x-scheduler-headless/base-ui-copy';

/**
 * Descriptor for a store class to be tested with the shared SchedulerStore tests.
 */
export interface SchedulerStoreClassDescriptor {
  /**
   * Display name for the store (used in test descriptions)
   */
  name: string;
  /**
   * The store class constructor
   */
  Value: new (
    parameters: any,
    adapter: TemporalAdapter,
  ) => {
    state: any;
    updateStateFromParameters: (parameters: any, adapter: TemporalAdapter) => void;
    // Event methods
    updateEvent: (properties: any) => void;
    deleteEvent: (id: any) => void;
    createEvent: (properties: any) => any;
    duplicateEventOccurrence: (eventId: any, start: any, end: any) => any;
    copyEvent: (id: any) => void;
    cutEvent: (id: any) => void;
    pasteEvent: (properties: any) => any;
    // Resource methods
    setVisibleResources: (visibleResources: any, event: Event) => void;
    // Date methods
    goToToday: (event: any) => void;
    // Data source methods
    queueDataFetchForRange?: (start: any, end: any) => void;
  };
}
