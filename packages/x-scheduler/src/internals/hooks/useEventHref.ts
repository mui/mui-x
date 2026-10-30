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
  const isReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence.id);

  // An empty `href` would link to the current page.
  if (!isEventOccurrence(occurrence) || !occurrence.href) {
    return undefined;
  }

  if (!isReadOnly) {
    if (process.env.NODE_ENV !== 'production') {
      warnOnce(
        [
          'MUI X Scheduler: An event has an `href` but is editable, so it is not rendered as a link.',
          'Only read-only events can be links. Editable events open the event dialog when clicked.',
          'If the event should be a link, make it read-only with its `readOnly` property, the `areEventsReadOnly` property of its resource, or the `readOnly` prop of the Event Calendar or Event Timeline.',
          'See https://mui.com/x/react-scheduler/event-calendar/events/#link',
        ].join('\n'),
      );
    }
    return undefined;
  }

  return occurrence.href;
}
