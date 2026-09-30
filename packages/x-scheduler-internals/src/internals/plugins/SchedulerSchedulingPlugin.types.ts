import type { SchedulerEventUpdatedProperties } from '../../models';
import type { UpdateEventsParameters } from '../utils/SchedulerStore/SchedulerStore.types';

/**
 * Interface of the scheduling plugin (dependencies and auto-scheduling).
 * Implemented in `@mui/x-scheduler-internals-premium`.
 */
export interface SchedulerSchedulingPluginInterface {
  /**
   * Reacts to event mutations.
   * Called inside `updateEvents` before the batch is merged: the returned entries
   * (`{ id, start, end }` only) fold into the same update and the same `onEventsChange`
   * emission, overriding the dates of an entry already in the batch. `rejected` vetoes
   * the whole batch: nothing is applied or emitted, and the caller surfaces `error`.
   */
  handleEventsUpdate: (
    parameters: UpdateEventsParameters,
  ) => { updated: SchedulerEventUpdatedProperties[] } | { rejected: true; error: Error } | void;
}
