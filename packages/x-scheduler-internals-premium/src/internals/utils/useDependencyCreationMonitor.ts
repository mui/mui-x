'use client';
import * as React from 'react';
import { warn } from '@base-ui/utils/warn';
import { useStore } from '@base-ui/utils/store';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { SchedulerEventId } from '@mui/x-scheduler-internals/models';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '../../event-timeline-premium-selectors';
import type { SchedulerAddDependencyResult } from '../../models';

interface DependencyDropTargetData {
  targetEventId: SchedulerEventId;
  targetOccurrenceKey: string | null;
  /**
   * `false` for a recurring event: hovering it gives no highlight or snap, but a drop
   * still goes through `addDependency` so its rejection reaches the user.
   */
  isValid: boolean;
}

function getDependencyDropTarget(
  dropTargets: readonly { data: Record<string | symbol, unknown> }[],
): DependencyDropTargetData | null {
  for (const dropTarget of dropTargets) {
    const eventId = dropTarget.data.dependencyTargetEventId;
    if (typeof eventId === 'string' || typeof eventId === 'number') {
      const occurrenceKey = dropTarget.data.dependencyTargetOccurrenceKey;
      return {
        targetEventId: eventId,
        targetOccurrenceKey: typeof occurrenceKey === 'string' ? occurrenceKey : null,
        isValid: dropTarget.data.dependencyTargetIsValid === true,
      };
    }
  }
  return null;
}

// TODO(dependencies public flip): source these messages from the locale text so the
// feedback is translatable.
// Exhaustive on purpose: every rejection must tell the user why it happened, so a new
// reason (e.g. the cycle guard of #22858) fails to compile until it brings a message.
function getRejectionMessage(
  result: Extract<SchedulerAddDependencyResult, { status: 'rejected' }>,
): string {
  switch (result.reason) {
    case 'duplicateDependency':
      return 'This dependency already exists between these two events.';
    case 'recurringEvent':
      return 'Dependencies cannot involve recurring events.';
    case 'unknownEvent':
      return 'This dependency cannot be created because one of its events no longer exists.';
    default:
      return unreachableRejection(result);
  }
}

function unreachableRejection(result: never): string {
  if (process.env.NODE_ENV !== 'production') {
    warn(`MUI X Scheduler: Unhandled dependency rejection ${JSON.stringify(result)}.`);
  }
  return 'This dependency cannot be created.';
}

/**
 * Handles the whole create-dependency drag gesture, from any terminal to any event.
 * A monitor (rather than callbacks on the terminal's draggable) so the gesture
 * survives the source element being unmounted by virtualization mid-drag.
 */
export function useDependencyCreationMonitor() {
  const store = useEventTimelinePremiumStoreContext();
  const enabled = useStore(store, eventTimelinePremiumDependencySelectors.enabled);

  React.useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const updateCreation = (
      source: { data: Record<string | symbol, unknown> },
      location: {
        current: {
          input: { clientX: number; clientY: number };
          dropTargets: readonly { data: Record<string | symbol, unknown> }[];
        };
      },
    ) => {
      // Invalid targets (recurring events) never highlight or snap the rubber band.
      const target = getDependencyDropTarget(location.current.dropTargets);
      const validTarget = target?.isValid ? target : null;
      store.setDependencyCreation({
        sourceEventId: source.data.eventId as SchedulerEventId,
        sourceOccurrenceKey: source.data.occurrenceKey as string,
        targetEventId: validTarget?.targetEventId ?? null,
        targetOccurrenceKey: validTarget?.targetOccurrenceKey ?? null,
        cursor: {
          clientX: location.current.input.clientX,
          clientY: location.current.input.clientY,
        },
      });
    };

    return monitorForElements({
      canMonitor: ({ source }) => source.data.source === 'TimelineGridEventDependencyHandle',
      onDragStart: ({ source, location }) => {
        updateCreation(source, location);
      },
      // `onDropTargetChange` reacts to entering/leaving a target immediately;
      // `onDrag` keeps the cursor up to date between target changes.
      onDropTargetChange: ({ source, location }) => {
        updateCreation(source, location);
      },
      onDrag: ({ source, location }) => {
        updateCreation(source, location);
      },
      onDrop: ({ source, location }) => {
        // Canceling the drag (e.g. with Escape) fires `onDrop` with no drop target,
        // so the gesture is discarded on the same path.
        store.setDependencyCreation(null);

        const target = getDependencyDropTarget(location.current.dropTargets);
        if (target === null) {
          return;
        }

        const result = store.addDependency({
          source: source.data.eventId as SchedulerEventId,
          target: target.targetEventId,
          type: 'FinishToStart',
        });

        if (result.status === 'rejected') {
          // A duplicate selects the existing arrow: the feedback points at the link
          // that already covers the attempted connection.
          if (result.reason === 'duplicateDependency') {
            store.setSelectedDependency(result.dependencyId);
          }
          store.pushError(/* minify-error-disabled */ new Error(getRejectionMessage(result)));
        }
      },
    });
  }, [store, enabled]);
}
