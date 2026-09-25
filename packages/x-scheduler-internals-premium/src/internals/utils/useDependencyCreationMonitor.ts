'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { Draggable } from '@base-ui/react/draggable';
import {
  schedulerDependencyKind,
  schedulerDependencyTargetKind,
} from '@mui/x-scheduler-internals/internals';
import type { SchedulerDependencyDragPayload } from '@mui/x-scheduler-internals/internals';
import type {
  SchedulerEventId,
  SchedulerEventSide,
  SchedulerResourceId,
} from '@mui/x-scheduler-internals/models';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
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
  targets: Draggable.Location['targets'],
): DependencyDropTargetData | null {
  for (const target of targets) {
    if (!schedulerDependencyTargetKind.matches(target)) {
      continue;
    }
    const data = target.payload;
    return {
      targetEventId: data.dependencyTargetEventId,
      targetOccurrenceKey: data.dependencyTargetOccurrenceKey,
      targetResourceId: data.dependencyTargetResourceId,
      targetSide: data.dependencyTargetSide,
      isValid: data.dependencyTargetIsValid,
    };
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

  const updateCreation = (
    { source }: { source: Draggable.Root.Record<SchedulerDependencyDragPayload> },
    { location }: { location: Draggable.LocationHistory },
  ) => {
    if (!enabled || source.payload.storeContext !== store) {
      return;
    }
    // Invalid targets (recurring or read-only events) never highlight or snap the
    // rubber band.
    const target = getDependencyDropTarget(location.current.targets);
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

  Draggable.useMonitor({
    accept: schedulerDependencyKind,
    onMoveStart: updateCreation,
    // Only target changes touch the state: the cursor never enters it, the arrows
    // layer follows the pointer through the DOM.
    onTargetChange: updateCreation,
    onMoveEnd: ({ source }, { location, canceled }) => {
      if (!enabled || source.payload.storeContext !== store) {
        return;
      }
      store.setDependencyCreation(null);
      const target = canceled ? null : getDependencyDropTarget(location.current.targets);
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
