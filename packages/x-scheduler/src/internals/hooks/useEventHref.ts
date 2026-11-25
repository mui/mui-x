import { useStore } from '@base-ui/utils/store';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { isEventOccurrence } from '@mui/x-scheduler-internals/internals';

/**
 * The URL an event occurrence renders a link to.
 * Placeholders and editable events are never links.
 */
export function useEventHref(occurrence: SchedulerRenderableEventOccurrence): string | undefined {
  const store = useSchedulerStoreContext();
  const isReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence.id);

  // An empty `href` would link to the current page.
  if (!isEventOccurrence(occurrence) || !occurrence.href || !isReadOnly) {
    return undefined;
  }

  return occurrence.href;
}
