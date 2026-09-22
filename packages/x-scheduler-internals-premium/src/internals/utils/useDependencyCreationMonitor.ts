'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { Draggable } from '@base-ui/react/draggable';
import { schedulerDragKind, schedulerDropTargetKind } from '@mui/x-scheduler-internals/internals';
import type { DragLocationHistory, DragSource } from '@base-ui/react/draggable';
import type {
  SchedulerEventId,
  SchedulerEventSide,
  SchedulerResourceId,
} from '@mui/x-scheduler-internals/models';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { isDependencyTerminalDrag } from '../../timeline-grid/event-dependency-terminal/dependencyTerminalDragData';
import { eventTimelinePremiumDependencySelectors } from '../../event-timeline-premium-selectors';
import type { SchedulerDependencyRejectionReason } from '../../models';
import { getDependencyType } from './dependency-utils';

interface DependencyDropTargetData {
  targetEventId: SchedulerEventId;
  targetOccurrenceKey: string | null;
  targetResourceId: SchedulerResourceId | null;
  /**
   * The edge of the target the drop lands on: the hovered terminal's, or the start
   * edge on the event body.
   */
  targetSide: SchedulerEventSide;
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
    if (!schedulerDropTargetKind.matches(dropTarget)) {
      continue;
    }
    const eventId = dropTarget.payload.dependencyTargetEventId;
    if (typeof eventId === 'string' || typeof eventId === 'number') {
      const occurrenceKey = dropTarget.payload.dependencyTargetOccurrenceKey;
      const resourceId = dropTarget.payload.dependencyTargetResourceId;
      return {
        targetEventId: eventId,
        targetOccurrenceKey: typeof occurrenceKey === 'string' ? occurrenceKey : null,
        targetResourceId: typeof resourceId === 'string' ? resourceId : null,
        // The event body registers the start edge; only a terminal can target the end.
        targetSide: dropTarget.payload.dependencyTargetSide === 'end' ? 'end' : 'start',
        isValid: dropTarget.payload.dependencyTargetIsValid === true,
      };
    }
  }
  return null;
}

// TODO(dependencies public flip, #23420): source these messages from the locale text so the
// feedback is translatable.
// The `Record` is exhaustive on the rejection union: a new reason fails to compile
// until it brings a message.
const REJECTION_MESSAGES: Record<SchedulerDependencyRejectionReason, string> = {
  cyclicDependency: 'This dependency would create a cycle between events.',
  duplicateDependency: 'A dependency of this type already exists between these two events.',
  recurringEvent: 'Dependencies cannot involve recurring events.',
  readOnlyEvent: 'Dependencies cannot involve read-only events.',
  unknownEvent: 'This dependency cannot be created because one of its events no longer exists.',
};

/**
 * Handles the whole create-dependency drag gesture, from any terminal to any event or
 * terminal.
 * A global monitor mounted by the grid root (rather than callbacks on the terminal's
 * draggable) so the gesture survives the source element being unmounted by
 * virtualization mid-drag. The source store scopes it to this timeline's gestures.
 */
export function useDependencyCreationMonitor() {
  const store = useEventTimelinePremiumStoreContext();
  const enabled = useStore(store, eventTimelinePremiumDependencySelectors.enabled);

  const updateCreation = ({
    source,
    location,
  }: {
    source: DragSource<Record<string, unknown>>;
    location: DragLocationHistory;
  }) => {
    if (
      !enabled ||
      !isDependencyTerminalDrag(source.payload) ||
      source.payload.storeContext !== store
    ) {
      return;
    }
    // Invalid targets (recurring or read-only events) never highlight or snap the
    // rubber band.
    const target = getDependencyDropTarget(location.current.dropTargets);
    const validTarget = target?.isValid ? target : null;
    store.setDependencyCreation({
      sourceEventId: source.payload.eventId,
      sourceOccurrenceKey: source.payload.occurrenceKey,
      sourceResourceId: source.payload.resourceId,
      sourceSide: source.payload.sourceSide,
      targetEventId: validTarget?.targetEventId ?? null,
      targetOccurrenceKey: validTarget?.targetOccurrenceKey ?? null,
      targetResourceId: validTarget?.targetResourceId ?? null,
      targetSide: validTarget?.targetSide ?? null,
    });
  };

  Draggable.useDragMonitor({
    accept: schedulerDragKind,
    onMoveStart: updateCreation,
    // Only target changes touch the state: the cursor never enters it, the arrows
    // layer follows the pointer through the DOM.
    onTargetChange: updateCreation,
    onMoveEnd: ({ source, location, canceled }) => {
      if (
        !enabled ||
        !isDependencyTerminalDrag(source.payload) ||
        source.payload.storeContext !== store
      ) {
        return;
      }
      store.setDependencyCreation(null);
      const target = canceled ? null : getDependencyDropTarget(location.current.dropTargets);
      if (target === null) {
        return;
      }

      const result = store.addDependency({
        source: source.payload.eventId,
        target: target.targetEventId,
        type: getDependencyType(source.payload.sourceSide, target.targetSide),
      });

      if (result.status === 'rejected') {
        // A duplicate selects the existing arrow: the feedback points at the link
        // that already covers the attempted connection.
        if (result.reason === 'duplicateDependency') {
          store.setSelectedDependencyId(result.dependencyId);
        }
        store.pushError(/* minify-error-disabled */ new Error(REJECTION_MESSAGES[result.reason]), {
          transient: true,
        });
      }
    },
  });

  React.useEffect(() => {
    return () => {
      // A teardown mid-gesture (feature disabled, grid unmounted on a view switch)
      // would otherwise freeze the rubber band and the drag-source highlight.
      store.setDependencyCreation(null);
    };
  }, [store, enabled]);
}
