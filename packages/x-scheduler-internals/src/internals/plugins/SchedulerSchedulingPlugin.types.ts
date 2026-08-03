import type { UpdateEventsParameters } from '../utils/SchedulerStore/SchedulerStore.types';

/**
 * Interface of the scheduling plugin (dependencies and auto-scheduling).
 * Implemented in `@mui/x-scheduler-internals-premium`.
 */
export interface SchedulerSchedulingPluginInterface {
  /**
   * Reacts to event mutations.
   * Called inside `updateEvents`, before `onEventsChange` is emitted, so the plugin
   * reactions are part of the same update.
   */
  handleEventsUpdate: (parameters: UpdateEventsParameters) => void;
}
