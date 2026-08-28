import type {
  SchedulerOccurrencePlaceholder,
  SchedulerResourceId,
} from '@mui/x-scheduler-internals/models';
import {
  getEventResourceIds,
  isInternalDragOrResizePlaceholder,
} from '@mui/x-scheduler-internals/internals';
import type { EventTimelinePremiumState as State } from '../use-event-timeline-premium';
import { eventTimelinePremiumPresetSelectors } from './eventTimelinePremiumPresetSelectors';

/**
 * Whether `resourceId`'s row should show the (solid) placeholder.
 *
 * For plain creation/external-drag placeholders this is just the destination
 * row. For an internal drag or resize of a (possibly multi-resource) event,
 * the placeholder previews in every row the event will occupy after the drop:
 * its current rows, with the dragged row (if any) swapped for the
 * destination. A resize or same-row drag has `sourceResourceId ===
 * resourceId` (the destination), so the swap is a no-op and the set collapses
 * back to "every current row" — which is exactly what should preview the new
 * times together. Dropping onto a row that already holds the event dedupes
 * naturally since we only check set membership, not the exact list.
 */
function isResourceInPlaceholderTargetSet(
  placeholder: SchedulerOccurrencePlaceholder,
  resourceId: SchedulerResourceId,
): boolean {
  if (!isInternalDragOrResizePlaceholder(placeholder)) {
    return placeholder.resourceId === resourceId;
  }

  const currentResourceIds = getEventResourceIds(placeholder.originalOccurrence.resource);
  const targetResourceIds =
    placeholder.sourceResourceId == null
      ? currentResourceIds
      : currentResourceIds.map((id) =>
          id === placeholder.sourceResourceId ? (placeholder.resourceId ?? id) : id,
        );

  return targetResourceIds.includes(resourceId);
}

export const timelineOccurrencePlaceholderSelectors = {
  placeholderInResource: (state: State, resourceId: SchedulerResourceId | null) => {
    const placeholder = state.occurrencePlaceholder;
    if (
      placeholder === null ||
      placeholder.surfaceType !== 'timeline' ||
      placeholder.isHidden ||
      resourceId === null ||
      !isResourceInPlaceholderTargetSet(placeholder, resourceId)
    ) {
      return null;
    }

    const config = eventTimelinePremiumPresetSelectors.config(state);
    if (
      state.adapter.isBefore(placeholder.end, config.start) ||
      state.adapter.isAfter(placeholder.start, config.end)
    ) {
      return null;
    }

    return placeholder;
  },
  isCreatingInResource: (state: State, resourceId: SchedulerResourceId | null) => {
    const placeholder = state.occurrencePlaceholder;
    if (
      placeholder === null ||
      placeholder.surfaceType !== 'timeline' ||
      placeholder.type !== 'creation' ||
      placeholder.resourceId !== resourceId
    ) {
      return false;
    }
    return true;
  },
};
