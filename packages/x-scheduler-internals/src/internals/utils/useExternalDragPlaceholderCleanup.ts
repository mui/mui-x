'use client';
import { Draggable } from '@base-ui/react/draggable';
import { schedulerExternalEventKind } from './schedulerDrag';
import { schedulerOccurrencePlaceholderSelectors } from '../../scheduler-selectors';
import type { SchedulerStoreInContext } from '../../use-scheduler-store-context';

/**
 * Clears the placeholder an external event left in the Scheduler once its drag ends, however it
 * ends: a target only hides it when the drag leaves, and the source belongs to the page.
 * Monitors run after the target handles a drop, so a drop has already turned it into an event.
 */
export function useExternalDragPlaceholderCleanup(
  store: Pick<SchedulerStoreInContext<any, any>, 'state' | 'setOccurrencePlaceholder'>,
) {
  Draggable.useMonitor({
    accept: schedulerExternalEventKind,
    onMoveEnd: () => {
      if (schedulerOccurrencePlaceholderSelectors.value(store.state)?.type === 'external-drag') {
        store.setOccurrencePlaceholder(null);
      }
    },
  });
}
