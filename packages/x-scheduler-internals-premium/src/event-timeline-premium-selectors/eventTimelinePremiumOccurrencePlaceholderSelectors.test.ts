import {
  adapter,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
  getEventTimelinePremiumStateFromParameters,
  ResourceBuilder,
} from 'test/utils/scheduler';
import type { SchedulerOccurrencePlaceholderInternalDragOrResize } from '@mui/x-scheduler-internals/models';
import type { EventTimelinePremiumState } from '../use-event-timeline-premium';
import { timelineOccurrencePlaceholderSelectors } from './eventTimelinePremiumOccurrencePlaceholderSelectors';

const resourceA = ResourceBuilder.new().build();
const resourceB = ResourceBuilder.new().build();
const resourceC = ResourceBuilder.new().build();
const resourceD = ResourceBuilder.new().build();

function getState(
  occurrencePlaceholder: EventTimelinePremiumState['occurrencePlaceholder'],
): EventTimelinePremiumState {
  const state = getEventTimelinePremiumStateFromParameters({
    resources: [resourceA, resourceB, resourceC, resourceD],
    events: [],
    visibleDate: DEFAULT_TESTING_VISIBLE_DATE,
  });
  return { ...state, occurrencePlaceholder };
}

function buildPlaceholder(
  overrides: Partial<SchedulerOccurrencePlaceholderInternalDragOrResize> = {},
): SchedulerOccurrencePlaceholderInternalDragOrResize {
  return {
    type: 'internal-drag',
    surfaceType: 'timeline',
    start: adapter.date('2025-07-03T10:00:00Z', 'default'),
    end: adapter.date('2025-07-03T11:00:00Z', 'default'),
    eventId: 'event-1',
    occurrenceKey: 'event-1',
    resourceId: resourceB.id,
    sourceResourceId: resourceA.id,
    originalOccurrence: EventBuilder.new()
      .id('event-1')
      .resources([resourceA, resourceC])
      .singleDay('2025-07-03T09:00:00Z', 60)
      .toOccurrence(),
    ...overrides,
  };
}

describe('timelineOccurrencePlaceholderSelectors', () => {
  describe('placeholderInResource', () => {
    it('previews in every row a multi-resource event will occupy after a cross-row drag, not just the destination', () => {
      // Event is currently on [A, C]. Dragged from A onto B: target set is [B, C].
      const placeholder = buildPlaceholder();
      const state = getState(placeholder);

      expect(
        timelineOccurrencePlaceholderSelectors.placeholderInResource(state, resourceA.id),
      ).to.equal(null);
      expect(
        timelineOccurrencePlaceholderSelectors.placeholderInResource(state, resourceB.id),
      ).to.equal(placeholder);
      expect(
        timelineOccurrencePlaceholderSelectors.placeholderInResource(state, resourceC.id),
      ).to.equal(placeholder);
      expect(
        timelineOccurrencePlaceholderSelectors.placeholderInResource(state, resourceD.id),
      ).to.equal(null);
    });

    it('previews in every current row for a resize/time-only change (source === destination)', () => {
      // Event is currently on [A, C]; resized in place on A, so source === destination.
      const placeholder = buildPlaceholder({
        type: 'internal-resize',
        resourceId: resourceA.id,
        sourceResourceId: resourceA.id,
      });
      const state = getState(placeholder);

      expect(
        timelineOccurrencePlaceholderSelectors.placeholderInResource(state, resourceA.id),
      ).to.equal(placeholder);
      expect(
        timelineOccurrencePlaceholderSelectors.placeholderInResource(state, resourceC.id),
      ).to.equal(placeholder);
      expect(
        timelineOccurrencePlaceholderSelectors.placeholderInResource(state, resourceB.id),
      ).to.equal(null);
    });

    it('dedupes when dropping onto a row the event already occupies', () => {
      // Event is currently on [A, C]; dragged from A onto C, which is already in the set.
      const placeholder = buildPlaceholder({ resourceId: resourceC.id });
      const state = getState(placeholder);

      expect(
        timelineOccurrencePlaceholderSelectors.placeholderInResource(state, resourceC.id),
      ).to.equal(placeholder);
      expect(
        timelineOccurrencePlaceholderSelectors.placeholderInResource(state, resourceA.id),
      ).to.equal(null);
    });

    it('keeps the single-row behavior for single-resource events', () => {
      const placeholder = buildPlaceholder({
        originalOccurrence: EventBuilder.new()
          .id('event-1')
          .resource(resourceA)
          .singleDay('2025-07-03T09:00:00Z', 60)
          .toOccurrence(),
      });
      const state = getState(placeholder);

      expect(
        timelineOccurrencePlaceholderSelectors.placeholderInResource(state, resourceB.id),
      ).to.equal(placeholder);
      expect(
        timelineOccurrencePlaceholderSelectors.placeholderInResource(state, resourceA.id),
      ).to.equal(null);
      expect(
        timelineOccurrencePlaceholderSelectors.placeholderInResource(state, resourceC.id),
      ).to.equal(null);
    });

    it('returns null when the row is not in the target set', () => {
      const placeholder = buildPlaceholder();
      const state = getState(placeholder);

      expect(
        timelineOccurrencePlaceholderSelectors.placeholderInResource(state, 'unknown-resource'),
      ).to.equal(null);
    });

    it('returns null outside the timeline surface, when hidden, or outside the visible range', () => {
      const placeholder = buildPlaceholder();

      expect(
        timelineOccurrencePlaceholderSelectors.placeholderInResource(
          getState({ ...placeholder, surfaceType: 'day-grid' }),
          resourceB.id,
        ),
      ).to.equal(null);
      expect(
        timelineOccurrencePlaceholderSelectors.placeholderInResource(
          getState({ ...placeholder, isHidden: true }),
          resourceB.id,
        ),
      ).to.equal(null);
      expect(
        timelineOccurrencePlaceholderSelectors.placeholderInResource(getState(null), resourceB.id),
      ).to.equal(null);
    });
  });
});
