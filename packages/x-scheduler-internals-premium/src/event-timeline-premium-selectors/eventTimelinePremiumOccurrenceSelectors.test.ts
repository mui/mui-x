import {
  adapter,
  getEventTimelinePremiumStateFromParameters,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { computeElementPositionInCollection } from '@mui/x-scheduler-internals/internals';
import { schedulerOccurrenceSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { describe, it, expect } from 'vitest';
import {
  addTimelinePositionsToOccurrences,
  eventTimelinePremiumOccurrenceSelectors,
} from './eventTimelinePremiumOccurrenceSelectors';
import { eventTimelinePremiumPresetSelectors } from './eventTimelinePremiumPresetSelectors';

const VISIBLE_DATE = adapter.date('2025-07-03T00:00:00Z', 'default');
const resource = ResourceBuilder.new().id('r1').build();
const at = (hours: number) => adapter.addHours(VISIBLE_DATE, hours).toISOString();

const PRESET_CONFIG = { dayAndHour: { startTime: 8, endTime: 20 } };

function buildState({
  presetConfig,
  events = [
    EventBuilder.new().id('inside').resource(resource).span(at(10), at(12)).build(),
    EventBuilder.new().id('hidden').resource(resource).span(at(21), at(23)).build(),
  ],
}: {
  presetConfig?: typeof PRESET_CONFIG;
  events?: ReturnType<typeof EventBuilder.prototype.build>[];
} = {}) {
  return getEventTimelinePremiumStateFromParameters({
    resources: [resource],
    events,
    preset: 'dayAndHour',
    visibleDate: VISIBLE_DATE,
    presetConfig,
  });
}

describe('eventTimelinePremiumOccurrenceSelectors', () => {
  describe('visibleGroupedByResourceList', () => {
    it('should return the upstream list reference on the full-day window', () => {
      const state = buildState();
      const config = eventTimelinePremiumPresetSelectors.config(state);

      expect(eventTimelinePremiumOccurrenceSelectors.visibleGroupedByResourceList(state)).to.equal(
        schedulerOccurrenceSelectors.groupedByResourceList(state, config.start, config.end),
      );
    });

    it('should filter out the occurrences hidden by the hour window', () => {
      const state = buildState({ presetConfig: PRESET_CONFIG });

      const list = eventTimelinePremiumOccurrenceSelectors.visibleGroupedByResourceList(state);
      expect(list[0].occurrences.map((occurrence) => occurrence.id)).to.deep.equal(['inside']);
    });

    it('should filter out a sub-minute occurrence straddling the window edge', () => {
      // 07:59:30 → 08:00:30 passes an ms-precision filter but renders with a zero
      // width: visibility must use the same minute-precision arithmetic as rendering.
      const state = buildState({
        presetConfig: PRESET_CONFIG,
        events: [
          EventBuilder.new()
            .id('sliver')
            .resource(resource)
            .span('2025-07-03T07:59:30Z', '2025-07-03T08:00:30Z')
            .build(),
        ],
      });

      const list = eventTimelinePremiumOccurrenceSelectors.visibleGroupedByResourceList(state);
      expect(list[0].occurrences).to.have.length(0);
    });

    it('should return the same reference when the dependencies are unchanged', () => {
      const state = buildState({ presetConfig: PRESET_CONFIG });

      const first = eventTimelinePremiumOccurrenceSelectors.visibleGroupedByResourceList(state);
      const second = eventTimelinePremiumOccurrenceSelectors.visibleGroupedByResourceList({
        ...state,
      });
      expect(second).to.equal(first);
    });
  });

  describe('visibleResourceOccurrences', () => {
    it('should return the occurrences of the resource row', () => {
      const state = buildState({ presetConfig: PRESET_CONFIG });

      const occurrences = eventTimelinePremiumOccurrenceSelectors.visibleResourceOccurrences(
        state,
        'r1',
      );
      expect(occurrences.map((occurrence) => occurrence.id)).to.deep.equal(['inside']);
    });

    it('should keep the empty-array identity for an unknown resource', () => {
      const state = buildState({ presetConfig: PRESET_CONFIG });

      const first = eventTimelinePremiumOccurrenceSelectors.visibleResourceOccurrences(
        state,
        'unknown',
      );
      const second = eventTimelinePremiumOccurrenceSelectors.visibleResourceOccurrences(
        state,
        'unknown',
      );
      expect(first).to.have.length(0);
      expect(first).to.equal(second);
    });
  });

  describe('visiblePositionByOccurrenceKey', () => {
    it('should return null on the full-day window', () => {
      const state = buildState();

      expect(
        eventTimelinePremiumOccurrenceSelectors.visiblePositionByOccurrenceKey(state),
      ).to.equal(null);
    });

    it('should expose the axis position of every visible occurrence', () => {
      const state = buildState({ presetConfig: PRESET_CONFIG });
      const config = eventTimelinePremiumPresetSelectors.config(state);

      const list = eventTimelinePremiumOccurrenceSelectors.visibleGroupedByResourceList(state);
      const positions =
        eventTimelinePremiumOccurrenceSelectors.visiblePositionByOccurrenceKey(state)!;

      const occurrence = list[0].occurrences[0];
      expect(positions.get(occurrence.key)).to.deep.equal(
        computeElementPositionInCollection(adapter, {
          start: occurrence.displayTimezone.start,
          end: occurrence.displayTimezone.end,
          collection: config,
        }),
      );
    });

    it('should not hold entries for the hidden occurrences', () => {
      const state = buildState({ presetConfig: PRESET_CONFIG });

      const positions =
        eventTimelinePremiumOccurrenceSelectors.visiblePositionByOccurrenceKey(state)!;
      expect(positions.size).to.equal(1);
    });

    it('should return the same reference when the dependencies are unchanged', () => {
      const state = buildState({ presetConfig: PRESET_CONFIG });

      const first = eventTimelinePremiumOccurrenceSelectors.visiblePositionByOccurrenceKey(state);
      const second = eventTimelinePremiumOccurrenceSelectors.visiblePositionByOccurrenceKey({
        ...state,
      });
      expect(second).to.equal(first);
    });
  });

  describe('addTimelinePositionsToOccurrences', () => {
    it('should reuse the position computed while filtering a trimmed-hour window', () => {
      const state = buildState({ presetConfig: PRESET_CONFIG });
      const config = eventTimelinePremiumPresetSelectors.config(state);
      const occurrence = eventTimelinePremiumOccurrenceSelectors.visibleResourceOccurrences(
        state,
        'r1',
      )[0];
      const positionByOccurrenceKey =
        eventTimelinePremiumOccurrenceSelectors.visiblePositionByOccurrenceKey(state)!;

      const [layoutOccurrence] = addTimelinePositionsToOccurrences({
        adapter,
        config,
        occurrences: [{ ...occurrence, position: { firstIndex: 1, lastIndex: 1 } }],
        positionByOccurrenceKey,
      });

      expect(layoutOccurrence.timelinePosition).to.equal(
        positionByOccurrenceKey.get(occurrence.key),
      );
    });

    it('should derive the position on demand for a full-day window', () => {
      const state = buildState();
      const config = eventTimelinePremiumPresetSelectors.config(state);
      const occurrence = eventTimelinePremiumOccurrenceSelectors.visibleResourceOccurrences(
        state,
        'r1',
      )[0];

      const [layoutOccurrence] = addTimelinePositionsToOccurrences({
        adapter,
        config,
        occurrences: [{ ...occurrence, position: { firstIndex: 1, lastIndex: 1 } }],
        positionByOccurrenceKey: null,
      });

      expect(layoutOccurrence.timelinePosition).to.deep.equal(
        computeElementPositionInCollection(adapter, {
          start: occurrence.displayTimezone.start,
          end: occurrence.displayTimezone.end,
          collection: config,
          durationMs: config.durationMs,
        }),
      );
    });
  });
});
