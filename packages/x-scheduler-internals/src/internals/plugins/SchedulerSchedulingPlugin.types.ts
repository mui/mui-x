import type { SchedulerEventUpdatedProperties } from '../../models';
import type {
  SchedulerUserFacingErrorDescriptor,
  UpdateEventsParameters,
} from '../utils/SchedulerStore/SchedulerStore.types';

/**
 * Interface of the scheduling plugin (dependencies and auto-scheduling).
 * Implemented in `@mui/x-scheduler-internals-premium`.
 */
export interface SchedulerSchedulingPluginInterface {
  /**
   * Reacts to event mutations.
   * Called inside `updateEvents` before the batch is merged: the returned entries (`id` plus
   * whichever of `start` / `end` it actually moves — omit a bound that doesn't change, the same
   * way a direct caller would) fold into the same update and the same `onEventsChange` emission,
   * overriding only the bound(s) present on an entry already in the batch. `rejected` vetoes
   * the whole batch: nothing is applied or emitted, and the caller surfaces `rejection`.
   *
   * `updateEvents` can still refuse the merged batch afterward (e.g. a date
   * `eventModelStructure` can't write back) for a reason this hook has no way to predict, so any
   * of its own side effects (such as dropping dependencies that reference a deleted event) must
   * not happen here — return them from `commit` instead, called only once the batch is confirmed
   * to go ahead.
   */
  handleEventsUpdate: (
    parameters: UpdateEventsParameters,
  ) =>
    | { updated?: SchedulerEventUpdatedProperties[]; commit?: () => void }
    | { rejected: true; rejection: SchedulerUserFacingErrorDescriptor }
    | void;
}
