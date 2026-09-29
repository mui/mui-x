'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { Draggable } from '@base-ui/react/draggable';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '../../event-timeline-premium-selectors';
import type { SchedulerDependencyRejectionReason } from '../../models';
import { getDependencyType } from './dependency-utils';
import { schedulerDependencyTargetKind } from './schedulerTimelineDrag';
import type { SchedulerDependencyDragPayload } from './schedulerTimelineDrag';

function getDependencyTargetPayload(target: Draggable.Target.Record | null) {
  return target !== null && schedulerDependencyTargetKind.matches(target) ? target.payload : null;
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
 * A monitor mounted by the grid root rather than callbacks on the terminal's draggable:
 * virtualization can unmount the terminal mid-drag, and its cleanup would reset the gesture.
 * The store's own drag kind scopes the monitor to this timeline's gestures.
 */
export function useDependencyCreationMonitor() {
  const store = useEventTimelinePremiumStoreContext();
  const enabled = useStore(store, eventTimelinePremiumDependencySelectors.enabled);

  const updateCreation = ({
    source,
    target,
  }: {
    source: Draggable.Root.Record<SchedulerDependencyDragPayload>;
    target: Draggable.Target.Record | null;
  }) => {
    if (!enabled) {
      return;
    }
    // Invalid targets (recurring or read-only events) never highlight or snap the
    // rubber band.
    const targetPayload = getDependencyTargetPayload(target);
    const validTarget = targetPayload?.isValid ? targetPayload : null;
    store.setDependencyCreation({
      sourceEventId: source.payload.eventId,
      sourceOccurrenceKey: source.payload.occurrenceKey,
      sourceResourceId: source.payload.resourceId,
      sourceSide: source.payload.sourceSide,
      targetEventId: validTarget?.eventId ?? null,
      targetOccurrenceKey: validTarget?.occurrenceKey ?? null,
      targetResourceId: validTarget?.resourceId ?? null,
      targetSide: validTarget?.side ?? null,
    });
  };

  Draggable.useMonitor({
    accept: store.dependencyDragKind,
    onMoveStart: updateCreation,
    // Only target changes touch the state: the cursor never enters it, the arrows
    // layer follows the pointer through the DOM.
    onTargetChange: updateCreation,
    onMoveEnd: ({ source, target }) => {
      if (!enabled) {
        return;
      }
      store.setDependencyCreation(null);
      // The target is null when the drag was canceled or released outside every target.
      const targetPayload = getDependencyTargetPayload(target);
      if (targetPayload === null) {
        return;
      }

      const result = store.addDependency({
        source: source.payload.eventId,
        target: targetPayload.eventId,
        type: getDependencyType(source.payload.sourceSide, targetPayload.side),
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
