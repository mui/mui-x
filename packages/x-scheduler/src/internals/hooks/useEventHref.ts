import { useStore } from '@base-ui/utils/store';
import { warnOnce } from '@mui/x-internals/warning';
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
  const href = useStore(store, schedulerEventSelectors.href, occurrence.id);

  if (!isEventOccurrence(occurrence)) {
    return undefined;
  }

  if (process.env.NODE_ENV !== 'production' && occurrence.href != null && href == null) {
    warnOnce(
      [
        'MUI X Scheduler: An editable event has an `href`, so the `href` is ignored.',
        'An event can only be a link when it is read-only, otherwise clicking it would both navigate and open the event dialog.',
        'Make the event read-only with its `readOnly` property, the `areEventsReadOnly` property of its resource, or the `readOnly` prop of the component.',
      ].join('\n'),
    );
  }

  return href;
}
