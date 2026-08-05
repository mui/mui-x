'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { DragLocationHistory, ElementDragType } from '@atlaskit/pragmatic-drag-and-drop/types';
import type { SchedulerEventId, SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { isDependencyHandleDrag } from '../../timeline-grid/event-dependency-handler/TimelineGridEventDependencyHandler';
import { eventTimelinePremiumDependencySelectors } from '../../event-timeline-premium-selectors';
import type { SchedulerDependencyRejectionReason } from '../../models';

interface DependencyDropTargetData {
  targetEventId: SchedulerEventId;
  targetOccurrenceKey: string | null;
  targetResourceId: SchedulerResourceId | null;
  /**
   * `false` for a recurring or read-only event: hovering it gives no highlight or
   * snap, but a drop still goes through `addDependency` so its rejection reaches the
   * user.
   */
  isValid: boolean;
}

function getDependencyDropTarget(
  dropTargets: DragLocationHistory['current']['dropTargets'],
): DependencyDropTargetData | null {
  for (const dropTarget of dropTargets) {
    const eventId = dropTarget.data.dependencyTargetEventId;
    if (typeof eventId === 'string' || typeof eventId === 'number') {
      const occurrenceKey = dropTarget.data.dependencyTargetOccurrenceKey;
      const resourceId = dropTarget.data.dependencyTargetResourceId;
      return {
        targetEventId: eventId,
        targetOccurrenceKey: typeof occurrenceKey === 'string' ? occurrenceKey : null,
        targetResourceId: typeof resourceId === 'string' ? resourceId : null,
        isValid: dropTarget.data.dependencyTargetIsValid === true,
      };
    }
  }
  return null;
}

// TODO(dependencies public flip): source these messages from the locale text so the
// feedback is translatable.
// The `Record` is exhaustive on the rejection union: a new reason (e.g. the cycle
// guard of #22858) fails to compile until it brings a message.
const REJECTION_MESSAGES: Record<SchedulerDependencyRejectionReason, string> = {
  duplicateDependency: 'This dependency already exists between these two events.',
  recurringEvent: 'Dependencies cannot involve recurring events.',
  readOnlyEvent: 'Dependencies cannot involve read-only events.',
  unknownEvent: 'This dependency cannot be created because one of its events no longer exists.',
};

/**
 * Handles the whole create-dependency drag gesture, from any terminal to any event.
 * A global monitor mounted by the grid root (rather than callbacks on the terminal's
 * draggable) so the gesture survives the source element being unmounted by
 * virtualization mid-drag; `canMonitor` scopes it back to this timeline's gestures.
 */
export function useDependencyCreationMonitor() {
  const store = useEventTimelinePremiumStoreContext();
  const enabled = useStore(store, eventTimelinePremiumDependencySelectors.enabled);

  React.useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const updateCreation = ({
      source,
      location,
    }: {
      source: ElementDragType['payload'];
      location: DragLocationHistory;
    }) => {
      if (!isDependencyHandleDrag(source.data)) {
        return;
      }
      // Invalid targets (recurring or read-only events) never highlight or snap the
      // rubber band.
      const target = getDependencyDropTarget(location.current.dropTargets);
      const validTarget = target?.isValid ? target : null;
      store.setDependencyCreation({
        sourceEventId: source.data.eventId,
        sourceOccurrenceKey: source.data.occurrenceKey,
        sourceResourceId: source.data.resourceId,
        sourceSide: source.data.sourceSide,
        targetEventId: validTarget?.targetEventId ?? null,
        targetOccurrenceKey: validTarget?.targetOccurrenceKey ?? null,
        targetResourceId: validTarget?.targetResourceId ?? null,
      });
    };

    const cleanupMonitor = monitorForElements({
      canMonitor: ({ source }) =>
        isDependencyHandleDrag(source.data) && source.data.storeContext === store,
      onDragStart: updateCreation,
      // Only target changes touch the state: the cursor never enters it, the arrows
      // layer follows the pointer through the DOM.
      onDropTargetChange: updateCreation,
      onDrop: ({ source, location }) => {
        // Canceling the drag (e.g. with Escape) fires `onDrop` with no drop target,
        // so the gesture is discarded on the same path.
        store.setDependencyCreation(null);

        if (!isDependencyHandleDrag(source.data)) {
          return;
        }
        const target = getDependencyDropTarget(location.current.dropTargets);
        if (target === null) {
          return;
        }

        const result = store.addDependency({
          source: source.data.eventId,
          target: target.targetEventId,
          type: 'FinishToStart',
        });

        if (result.status === 'rejected') {
          // A duplicate selects the existing arrow: the feedback points at the link
          // that already covers the attempted connection.
          if (result.reason === 'duplicateDependency') {
            store.setSelectedDependencyId(result.dependencyId);
          }
          store.pushError(
            /* minify-error-disabled */ new Error(REJECTION_MESSAGES[result.reason]),
            {
              transient: true,
            },
          );
        }
      },
    });

    return () => {
      cleanupMonitor();
      // A teardown mid-gesture (feature disabled, grid unmounted on a view switch)
      // would otherwise freeze the rubber band and the drag-source highlight.
      store.setDependencyCreation(null);
    };
  }, [store, enabled]);
}
