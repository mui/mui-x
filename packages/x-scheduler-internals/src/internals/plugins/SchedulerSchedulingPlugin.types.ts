import type { SchedulerEventUpdatedProperties } from '../../models';
import type { UpdateEventsParameters } from '../utils/SchedulerStore/SchedulerStore.types';

/**
 * Interface of the scheduling plugin (dependencies and auto-scheduling).
 * Implemented in `@mui/x-scheduler-internals-premium`.
 */
export interface SchedulerSchedulingPluginInterface {
  /**
   * Reacts to event mutations.
   * Called inside `updateEvents` before the batch is merged, so the returned entries
   * (the auto-scheduling cascade, `{ id, start, end }` only) fold into the same update
   * and the same `onEventsChange` emission. An entry for an id already in the batch
   * overrides that entry's dates (a dropped event clamped forward). `{ rejected: true }`
   * vetoes the whole batch: nothing is applied or emitted.
   */
  handleEventsUpdate: (
    parameters: UpdateEventsParameters,
  ) => { updated: SchedulerEventUpdatedProperties[] } | { rejected: true } | void;
}
