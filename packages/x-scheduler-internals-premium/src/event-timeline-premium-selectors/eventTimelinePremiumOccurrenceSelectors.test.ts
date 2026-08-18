import {
  adapter,
  getEventTimelinePremiumStateFromParameters,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { computeElementPositionInCollection } from '@mui/x-scheduler-internals/internals';
import { schedulerOccurrenceSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { eventTimelinePremiumOccurrenceSelectors } from './eventTimelinePremiumOccurrenceSelectors';
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

  describe('visibleResourceLayout', () => {
    it('should derive lanes and timeline positions once per resource', () => {
      const state = buildState({
        events: [
          EventBuilder.new().id('first').resource(resource).span(at(10), at(12)).build(),
          EventBuilder.new().id('second').resource(resource).span(at(11), at(13)).build(),
        ],
      });
      const config = eventTimelinePremiumPresetSelectors.config(state);

      const layout = eventTimelinePremiumOccurrenceSelectors.visibleResourceLayout(state, 'r1');

      expect(layout.maxIndex).to.equal(2);
      expect(layout.occurrences.map(({ id, position }) => ({ id, position }))).to.deep.equal([
        { id: 'first', position: { firstIndex: 1, lastIndex: 1 } },
        { id: 'second', position: { firstIndex: 2, lastIndex: 2 } },
      ]);
      expect(layout.occurrences[0].timelinePosition).to.deep.equal(
        computeElementPositionInCollection(adapter, {
          start: layout.occurrences[0].displayTimezone.start,
          end: layout.occurrences[0].displayTimezone.end,
          collection: config,
          durationMs: config.durationMs,
        }),
      );
    });

    it('should reuse the layout while its inputs are unchanged', () => {
      const state = buildState({ presetConfig: PRESET_CONFIG });

      const first = eventTimelinePremiumOccurrenceSelectors.visibleResourceLayout(state, 'r1');
      const second = eventTimelinePremiumOccurrenceSelectors.visibleResourceLayout(
        { ...state },
        'r1',
      );

      expect(second).to.equal(first);
    });

    it('should share an occurrence position between resource rows', () => {
      const secondResource = ResourceBuilder.new().id('r2').build();
      const state = getEventTimelinePremiumStateFromParameters({
        resources: [resource, secondResource],
        events: [
          EventBuilder.new()
            .id('shared')
            .resources([resource, secondResource])
            .span(at(10), at(12))
            .build(),
        ],
        preset: 'dayAndHour',
        visibleDate: VISIBLE_DATE,
      });

      const layouts = eventTimelinePremiumOccurrenceSelectors.visibleGroupedByResourceLayout(state);
      expect(layouts[0].occurrences[0].timelinePosition).to.equal(
        layouts[1].occurrences[0].timelinePosition,
      );
    });

    it('should keep the empty layout identity for an unknown resource', () => {
      const state = buildState();

      const first = eventTimelinePremiumOccurrenceSelectors.visibleResourceLayout(state, 'unknown');
      const second = eventTimelinePremiumOccurrenceSelectors.visibleResourceLayout(
        state,
        'unknown',
      );

      expect(first.occurrences).to.have.length(0);
      expect(second).to.equal(first);
    });
  });
});
