import { clearWarningsCache } from '@mui/x-internals/warning';
import { adapter, EventBuilder } from 'test/utils/scheduler';
import { computeDayGridLanes, computeTimedLanes } from './lane-positions';
import { getDaysTheOccurrenceIsVisibleOn, getOccurrencesFromEvents } from './event-utils';
import { processDate } from '../../process-date';
import {
  SchedulerEventOccurrence,
  SchedulerOccurrencesByDay,
  SchedulerProcessedDate,
  SchedulerProcessedEvent,
} from '../../models';

function buildOccurrencesByDay(
  events: SchedulerProcessedEvent[],
  days: SchedulerProcessedDate[],
  options?: {
    previous?: {
      byKey: ReadonlyMap<string, SchedulerEventOccurrence>;
      eventByKey: ReadonlyMap<string, SchedulerProcessedEvent>;
    };
    outEventByKey?: Map<string, SchedulerProcessedEvent>;
  },
): SchedulerOccurrencesByDay {
  const start = adapter.startOfDay(days[0].value);
  const end = adapter.endOfDay(days[days.length - 1].value);
  const occurrences = getOccurrencesFromEvents({
    adapter,
    start,
    end,
    events,
    visibleResources: {},
    displayTimezone: 'default',
    plan: 'premium',
    previous: options?.previous,
    outEventByKey: options?.outEventByKey,
  });

  const byKey = new Map<string, SchedulerEventOccurrence>();
  const keysByDay = new Map<string, string[]>();
  const dayKeys: string[] = [];
  for (const day of days) {
    keysByDay.set(day.key, []);
    dayKeys.push(day.key);
  }
  for (const occurrence of occurrences) {
    byKey.set(occurrence.key, occurrence);
    for (const dayKey of getDaysTheOccurrenceIsVisibleOn(occurrence, days, adapter)) {
      keysByDay.get(dayKey)!.push(occurrence.key);
    }
  }
  return { byKey, keysByDay, dayKeys };
}

describe('lane-positions', () => {
  describe('computeDayGridLanes', () => {
    const days = [
      processDate(adapter.date('2024-01-15Z', 'default'), adapter),
      processDate(adapter.date('2024-01-16Z', 'default'), adapter),
      processDate(adapter.date('2024-01-17Z', 'default'), adapter),
    ];

    function run(
      events: SchedulerProcessedEvent[],
      rows: SchedulerProcessedDate[][] = [days],
      allDays: SchedulerProcessedDate[] = days,
    ) {
      const occurrencesByDay = buildOccurrencesByDay(events, allDays);
      return computeDayGridLanes({ adapter, rows, occurrencesByDay });
    }

    it('should set firstLane=1 for the first event on a day', () => {
      const result = run([EventBuilder.new().id('A').singleDay('2024-01-15Z').toProcessed()]);

      expect(result.maxLane).to.equal(1);
      const day0 = result.byContainer.get(days[0].key)!;
      expect(day0.orderedKeys).to.have.length(1);
      expect(day0.positionByKey.get('A')).to.deep.equal({ firstLane: 1, lastLane: 1 });
      expect(day0.cellSpanByKey.get('A')).to.equal(1);
      expect(day0.invisibleKeys.has('A')).to.equal(false);
    });

    it('should place concurrent occurrences on different lanes within the same day', () => {
      const result = run([
        EventBuilder.new().id('A').singleDay('2024-01-15Z').toProcessed(),
        EventBuilder.new().id('B').singleDay('2024-01-15Z').toProcessed(),
        EventBuilder.new().id('C').singleDay('2024-01-15Z').toProcessed(),
      ]);

      expect(result.maxLane).to.equal(3);
      const day0 = result.byContainer.get(days[0].key)!;
      expect(day0.positionByKey.get('A')).to.deep.equal({ firstLane: 1, lastLane: 1 });
      expect(day0.positionByKey.get('B')).to.deep.equal({ firstLane: 2, lastLane: 2 });
      expect(day0.positionByKey.get('C')).to.deep.equal({ firstLane: 3, lastLane: 3 });
    });

    it('should reuse the same lane on continuation cells of a multi-day occurrence and mark them invisible', () => {
      const result = run([
        EventBuilder.new().id('A').startAt('2024-01-15Z').endAt('2024-01-16Z').toProcessed(),
        EventBuilder.new().id('B').startAt('2024-01-16Z').endAt('2024-01-17Z').toProcessed(),
      ]);

      expect(result.maxLane).to.equal(2);

      const day1 = result.byContainer.get(days[1].key)!;
      expect(day1.positionByKey.get('B')).to.deep.equal({ firstLane: 2, lastLane: 2 });
      expect(day1.cellSpanByKey.get('B')).to.equal(2);
      expect(day1.invisibleKeys.has('B')).to.equal(false);

      const day2 = result.byContainer.get(days[2].key)!;
      expect(day2.positionByKey.get('B')).to.deep.equal({ firstLane: 2, lastLane: 2 });
      expect(day2.cellSpanByKey.get('B')).to.equal(1);
      expect(day2.invisibleKeys.has('B')).to.equal(true);
    });

    it('should reuse the lowest available lane when an earlier lane frees up', () => {
      const result = run([
        EventBuilder.new().id('A').startAt('2024-01-15Z').endAt('2024-01-16Z').toProcessed(),
        EventBuilder.new().id('B').startAt('2024-01-16Z').endAt('2024-01-17Z').toProcessed(),
        EventBuilder.new().id('C').singleDay('2024-01-17Z').toProcessed(),
      ]);

      // A is gone on day 3, so C should reuse lane 1 instead of stacking under B at lane 3.
      expect(result.maxLane).to.equal(2);
      const day2 = result.byContainer.get(days[2].key)!;
      expect(day2.positionByKey.get('C')).to.deep.equal({ firstLane: 1, lastLane: 1 });
    });

    it('should restart lane assignment on the first day of each row for events that cross row boundaries', () => {
      // Two-week month grid: an event spanning Sun→Wed of week 1, plus an event on the
      // first day of week 2. The week-2 event should land on lane 1 because the
      // multi-day event does NOT continue across the row boundary.
      const week1 = [
        processDate(adapter.date('2024-01-07Z', 'default'), adapter), // Sun
        processDate(adapter.date('2024-01-08Z', 'default'), adapter),
        processDate(adapter.date('2024-01-09Z', 'default'), adapter),
        processDate(adapter.date('2024-01-10Z', 'default'), adapter), // Wed
        processDate(adapter.date('2024-01-11Z', 'default'), adapter),
        processDate(adapter.date('2024-01-12Z', 'default'), adapter),
        processDate(adapter.date('2024-01-13Z', 'default'), adapter), // Sat
      ];
      const week2 = [
        processDate(adapter.date('2024-01-14Z', 'default'), adapter), // Sun
        processDate(adapter.date('2024-01-15Z', 'default'), adapter),
      ];
      const result = run(
        [
          EventBuilder.new().id('A').startAt('2024-01-07Z').endAt('2024-01-10Z').toProcessed(),
          EventBuilder.new().id('B').singleDay('2024-01-14Z').toProcessed(),
        ],
        [week1, week2],
        [...week1, ...week2],
      );

      const week1Sun = result.byContainer.get(week1[0].key)!;
      expect(week1Sun.positionByKey.get('A')).to.deep.equal({ firstLane: 1, lastLane: 1 });
      expect(week1Sun.cellSpanByKey.get('A')).to.equal(4);

      const week2Sun = result.byContainer.get(week2[0].key)!;
      expect(week2Sun.positionByKey.get('B')).to.deep.equal({ firstLane: 1, lastLane: 1 });
    });

    it('should clamp cellSpan to the remaining days in the row', () => {
      // Event spans 3 days but starts on the last day of a 3-day row → cellSpan must be 1.
      const result = run([
        EventBuilder.new().id('A').startAt('2024-01-17Z').endAt('2024-01-19Z').toProcessed(),
      ]);

      const day2 = result.byContainer.get(days[2].key)!;
      expect(day2.positionByKey.get('A')).to.deep.equal({ firstLane: 1, lastLane: 1 });
      expect(day2.cellSpanByKey.get('A')).to.equal(1);
    });

    it('should respect the `shouldAddPosition` predicate', () => {
      const occurrencesByDay = buildOccurrencesByDay(
        [
          EventBuilder.new().id('A').singleDay('2024-01-15Z').toProcessed(),
          EventBuilder.new().id('B').singleDay('2024-01-15Z').toProcessed(),
        ],
        days,
      );
      const result = computeDayGridLanes({
        adapter,
        rows: [days],
        occurrencesByDay,
        shouldAddPosition: (occurrence) => occurrence.id !== 'B',
      });

      const day0 = result.byContainer.get(days[0].key)!;
      expect(day0.positionByKey.has('A')).to.equal(true);
      expect(day0.positionByKey.has('B')).to.equal(false);
    });

    it('should warn and skip the occurrence when its key is missing from `byKey`', () => {
      clearWarningsCache();
      const occurrencesByDay: SchedulerOccurrencesByDay = {
        byKey: new Map(),
        keysByDay: new Map([[days[0].key, ['ghost']]]),
        dayKeys: [days[0].key],
      };
      let result: ReturnType<typeof computeDayGridLanes> | undefined;
      expect(() => {
        result = computeDayGridLanes({ adapter, rows: [[days[0]]], occurrencesByDay });
      }).toWarnDev('MUI X Scheduler: occurrence "ghost"');
      expect(result!.byContainer.get(days[0].key)!.orderedKeys).to.have.length(0);
    });
  });

  describe('computeTimedLanes', () => {
    const day = processDate(adapter.date('2024-01-15', 'default'), adapter);

    function run(events: SchedulerProcessedEvent[], maxSpan: number) {
      const occurrencesByDay = buildOccurrencesByDay(events, [day]);
      return computeTimedLanes({
        adapter,
        occurrencesByKey: occurrencesByDay.byKey,
        containers: [[day.key, occurrencesByDay.keysByDay.get(day.key) ?? []]],
        maxSpan,
      });
    }

    it('should put non-overlapping events on lane 1', () => {
      const result = run(
        [
          EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').toProcessed(),
          EventBuilder.new().id('B').singleDay('2024-01-15T12:00:00Z').toProcessed(),
          EventBuilder.new().id('C').singleDay('2024-01-15T13:30:00Z', 180).toProcessed(),
        ],
        1,
      );

      expect(result.maxLane).to.equal(1);
      expect(result.positionByKey.get('A')).to.deep.equal({ firstLane: 1, lastLane: 1 });
      expect(result.positionByKey.get('B')).to.deep.equal({ firstLane: 1, lastLane: 1 });
      expect(result.positionByKey.get('C')).to.deep.equal({ firstLane: 1, lastLane: 1 });
    });

    it('should place overlapping events with the same start on consecutive lanes', () => {
      const result = run(
        [
          EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z', 120).toProcessed(),
          EventBuilder.new().id('B').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        ],
        1,
      );

      expect(result.maxLane).to.equal(2);
      expect(result.positionByKey.get('A')).to.deep.equal({ firstLane: 1, lastLane: 1 });
      expect(result.positionByKey.get('B')).to.deep.equal({ firstLane: 2, lastLane: 2 });
    });

    it('should place overlapping events with different starts on consecutive lanes', () => {
      const result = run(
        [
          EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z', 120).toProcessed(),
          EventBuilder.new().id('B').singleDay('2024-01-15T10:30:00Z').toProcessed(),
        ],
        1,
      );

      expect(result.maxLane).to.equal(2);
      expect(result.positionByKey.get('A')).to.deep.equal({ firstLane: 1, lastLane: 1 });
      expect(result.positionByKey.get('B')).to.deep.equal({ firstLane: 2, lastLane: 2 });
    });

    it('should keep edge-touching events on the same lane (A ends exactly when B starts)', () => {
      const result = run(
        [
          EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z', 120).toProcessed(),
          EventBuilder.new().id('B').singleDay('2024-01-15T12:00:00Z').toProcessed(),
        ],
        1,
      );

      expect(result.maxLane).to.equal(1);
      expect(result.positionByKey.get('A')).to.deep.equal({ firstLane: 1, lastLane: 1 });
      expect(result.positionByKey.get('B')).to.deep.equal({ firstLane: 1, lastLane: 1 });
    });

    it('should reuse the lowest available lane when an earlier lane frees up', () => {
      // A finishes by 11:00, then C at 12:00 must reuse lane 1 (B occupies lane 2 for 4h).
      const result = run(
        [
          EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').toProcessed(),
          EventBuilder.new().id('B').singleDay('2024-01-15T10:30:00Z', 240).toProcessed(),
          EventBuilder.new().id('C').singleDay('2024-01-15T12:00:00Z').toProcessed(),
        ],
        1,
      );

      expect(result.maxLane).to.equal(2);
      expect(result.positionByKey.get('A')).to.deep.equal({ firstLane: 1, lastLane: 1 });
      expect(result.positionByKey.get('B')).to.deep.equal({ firstLane: 2, lastLane: 2 });
      expect(result.positionByKey.get('C')).to.deep.equal({ firstLane: 1, lastLane: 1 });
    });

    it('should not span a lane wider than 1 when maxSpan=1', () => {
      const result = run(
        [
          EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').toProcessed(),
          EventBuilder.new().id('B').singleDay('2024-01-15T10:00:00Z').toProcessed(),
          EventBuilder.new().id('C').singleDay('2024-01-15T10:00:00Z').toProcessed(),
          EventBuilder.new().id('D').singleDay('2024-01-15T15:00:00Z').toProcessed(),
        ],
        1,
      );

      expect(result.maxLane).to.equal(3);
      expect(result.positionByKey.get('D')).to.deep.equal({ firstLane: 1, lastLane: 1 });
    });

    it('should expand a lone event to all available lanes when maxSpan=Infinity', () => {
      const result = run(
        [
          EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').toProcessed(),
          EventBuilder.new().id('B').singleDay('2024-01-15T10:00:00Z').toProcessed(),
          EventBuilder.new().id('C').singleDay('2024-01-15T10:00:00Z').toProcessed(),
          EventBuilder.new().id('D').singleDay('2024-01-15T15:00:00Z').toProcessed(),
        ],
        Number.POSITIVE_INFINITY,
      );

      expect(result.maxLane).to.equal(3);
      expect(result.positionByKey.get('D')).to.deep.equal({ firstLane: 1, lastLane: 3 });
    });

    it('should cap lane expansion at maxSpan when free space is wider', () => {
      const result = run(
        [
          EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').toProcessed(),
          EventBuilder.new().id('B').singleDay('2024-01-15T10:00:00Z').toProcessed(),
          EventBuilder.new().id('C').singleDay('2024-01-15T10:00:00Z').toProcessed(),
          EventBuilder.new().id('D').singleDay('2024-01-15T15:00:00Z').toProcessed(),
        ],
        2,
      );

      expect(result.maxLane).to.equal(3);
      expect(result.positionByKey.get('D')).to.deep.equal({ firstLane: 1, lastLane: 2 });
    });

    it('should expand overlapping events into free lanes when maxSpan=Infinity', () => {
      const result = run(
        [
          EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z', 120).toProcessed(),
          EventBuilder.new().id('B').singleDay('2024-01-15T10:30:00Z', 120).toProcessed(),
          EventBuilder.new().id('C').singleDay('2024-01-15T11:00:00Z', 120).toProcessed(),
          EventBuilder.new().id('D').singleDay('2024-01-15T11:30:00Z', 420).toProcessed(),
          EventBuilder.new().id('E').singleDay('2024-01-15T15:00:00Z').toProcessed(),
        ],
        Number.POSITIVE_INFINITY,
      );

      expect(result.maxLane).to.equal(4);
      expect(result.positionByKey.get('A')).to.deep.equal({ firstLane: 1, lastLane: 1 });
      expect(result.positionByKey.get('B')).to.deep.equal({ firstLane: 2, lastLane: 2 });
      expect(result.positionByKey.get('C')).to.deep.equal({ firstLane: 3, lastLane: 3 });
      expect(result.positionByKey.get('D')).to.deep.equal({ firstLane: 4, lastLane: 4 });
      expect(result.positionByKey.get('E')).to.deep.equal({ firstLane: 1, lastLane: 3 });
    });

    it('should cap overlapping events at maxSpan when free space is wider', () => {
      const result = run(
        [
          EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z', 120).toProcessed(),
          EventBuilder.new().id('B').singleDay('2024-01-15T10:30:00Z', 120).toProcessed(),
          EventBuilder.new().id('C').singleDay('2024-01-15T11:00:00Z', 120).toProcessed(),
          EventBuilder.new().id('D').singleDay('2024-01-15T11:30:00Z', 420).toProcessed(),
          EventBuilder.new().id('E').singleDay('2024-01-15T15:00:00Z').toProcessed(),
        ],
        2,
      );

      expect(result.maxLane).to.equal(4);
      expect(result.positionByKey.get('E')).to.deep.equal({ firstLane: 1, lastLane: 2 });
    });

    it('should respect the `shouldAddPosition` predicate', () => {
      const occurrencesByDay = buildOccurrencesByDay(
        [
          EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').toProcessed(),
          EventBuilder.new().id('B').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        ],
        [day],
      );
      const result = computeTimedLanes({
        adapter,
        occurrencesByKey: occurrencesByDay.byKey,
        containers: [[day.key, occurrencesByDay.keysByDay.get(day.key) ?? []]],
        maxSpan: 1,
        shouldAddPosition: (occurrence) => occurrence.id !== 'B',
      });

      expect(result.positionByKey.has('A')).to.equal(true);
      expect(result.positionByKey.has('B')).to.equal(false);
    });

    it('should warn and skip the occurrence when its key is missing from `occurrencesByKey`', () => {
      clearWarningsCache();
      let result: ReturnType<typeof computeTimedLanes> | undefined;
      expect(() => {
        result = computeTimedLanes({
          adapter,
          occurrencesByKey: new Map(),
          containers: [[day.key, ['ghost']]],
          maxSpan: 1,
        });
      }).toWarnDev('MUI X Scheduler: occurrence "ghost"');
      expect(result!.byContainer.get(day.key)!.orderedKeys).to.have.length(0);
    });

    it('should warn and clamp to 1 when maxSpan is less than 1', () => {
      clearWarningsCache();
      const occurrencesByDay = buildOccurrencesByDay(
        [
          EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').toProcessed(),
          EventBuilder.new().id('B').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        ],
        [day],
      );

      let result: ReturnType<typeof computeTimedLanes> | undefined;
      expect(() => {
        result = computeTimedLanes({
          adapter,
          occurrencesByKey: occurrencesByDay.byKey,
          containers: [[day.key, occurrencesByDay.keysByDay.get(day.key) ?? []]],
          maxSpan: 0,
        });
      }).toWarnDev('MUI X Scheduler: `maxSpan` must be >= 1');

      // Falls back to maxSpan=1: the two overlapping events stay on their own lanes.
      expect(result!.positionByKey.get('A')).to.deep.equal({ firstLane: 1, lastLane: 1 });
      expect(result!.positionByKey.get('B')).to.deep.equal({ firstLane: 2, lastLane: 2 });
    });
  });

  describe('partial-update reference stability', () => {
    const days = [
      processDate(adapter.date('2024-01-15Z', 'default'), adapter),
      processDate(adapter.date('2024-01-16Z', 'default'), adapter),
      processDate(adapter.date('2024-01-17Z', 'default'), adapter),
    ];

    describe('computeDayGridLanes', () => {
      it('should reuse the previous OccurrenceLanePosition when an occurrence is unchanged', () => {
        const events = [EventBuilder.new().id('A').singleDay('2024-01-15Z').toProcessed()];
        const occurrencesByDay = buildOccurrencesByDay(events, days);

        const first = computeDayGridLanes({ adapter, rows: [days], occurrencesByDay });
        const second = computeDayGridLanes({
          adapter,
          rows: [days],
          occurrencesByDay,
          previous: { result: first, occurrencesByDay },
        });

        expect(second.positionByKey.get('A')).to.equal(first.positionByKey.get('A'));
      });

      it('should reuse a row layout when every day in the row is unchanged', () => {
        const events = [
          EventBuilder.new().id('A').singleDay('2024-01-15Z').toProcessed(),
          EventBuilder.new().id('B').singleDay('2024-01-16Z').toProcessed(),
        ];
        const occurrencesByDay = buildOccurrencesByDay(events, days);

        const first = computeDayGridLanes({ adapter, rows: [days], occurrencesByDay });
        const second = computeDayGridLanes({
          adapter,
          rows: [days],
          occurrencesByDay,
          previous: { result: first, occurrencesByDay },
        });

        for (const day of days) {
          expect(second.byContainer.get(day.key)).to.equal(first.byContainer.get(day.key));
        }
      });

      it('should rebuild the row when one day in it changed', () => {
        // Two rows; the second call shares unchanged events (A, B) reference-wise so
        // their occurrence objects are reused, then adds C only on day 4 (in row 2).
        // Row 1 reuses its layouts; row 2 rebuilds.
        const row1 = [
          processDate(adapter.date('2024-01-15Z', 'default'), adapter),
          processDate(adapter.date('2024-01-16Z', 'default'), adapter),
        ];
        const row2 = [
          processDate(adapter.date('2024-01-17Z', 'default'), adapter),
          processDate(adapter.date('2024-01-18Z', 'default'), adapter),
        ];
        const allDays = [...row1, ...row2];

        const eventA = EventBuilder.new().id('A').singleDay('2024-01-15Z').toProcessed();
        const eventB = EventBuilder.new().id('B').singleDay('2024-01-17Z').toProcessed();
        const eventC = EventBuilder.new().id('C').singleDay('2024-01-18Z').toProcessed();

        const eventByKeyBefore = new Map<string, SchedulerProcessedEvent>();
        const occurrencesBefore = buildOccurrencesByDay([eventA, eventB], allDays, {
          outEventByKey: eventByKeyBefore,
        });
        const occurrencesAfter = buildOccurrencesByDay([eventA, eventB, eventC], allDays, {
          previous: { byKey: occurrencesBefore.byKey, eventByKey: eventByKeyBefore },
        });

        const first = computeDayGridLanes({
          adapter,
          rows: [row1, row2],
          occurrencesByDay: occurrencesBefore,
        });
        const second = computeDayGridLanes({
          adapter,
          rows: [row1, row2],
          occurrencesByDay: occurrencesAfter,
          previous: { result: first, occurrencesByDay: occurrencesBefore },
        });

        // Row 1 layouts reused.
        for (const day of row1) {
          expect(second.byContainer.get(day.key)).to.equal(first.byContainer.get(day.key));
        }
        // Row 2 layouts rebuilt — at minimum day-18 changes (new event on it).
        expect(second.byContainer.get(row2[1].key)).not.to.equal(
          first.byContainer.get(row2[1].key),
        );
      });
    });

    describe('computeTimedLanes', () => {
      it('should reuse a per-container layout when its keys + occurrence references are unchanged', () => {
        const events = [
          EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').toProcessed(),
          EventBuilder.new().id('B').singleDay('2024-01-15T12:00:00Z').toProcessed(),
        ];
        const occurrencesByDay = buildOccurrencesByDay(events, [days[0]]);
        const keys = occurrencesByDay.keysByDay.get(days[0].key) ?? [];
        const containers: [string, readonly string[]][] = [[days[0].key, keys]];

        const first = computeTimedLanes({
          adapter,
          occurrencesByKey: occurrencesByDay.byKey,
          containers,
          maxSpan: 1,
        });
        const containerKeysByContainer = new Map<string, readonly string[]>([[days[0].key, keys]]);
        const second = computeTimedLanes({
          adapter,
          occurrencesByKey: occurrencesByDay.byKey,
          containers,
          maxSpan: 1,
          previous: {
            result: first,
            occurrencesByKey: occurrencesByDay.byKey,
            containerKeysByContainer,
          },
        });

        expect(second.byContainer.get(days[0].key)).to.equal(first.byContainer.get(days[0].key));
        expect(second.positionByKey.get('A')).to.equal(first.positionByKey.get('A'));
      });

      it('should not reuse when a referenced occurrence object changed', () => {
        const eventsBefore = [
          EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        ];
        const eventsAfter = [
          EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        ];
        // Same id/day → same key → keys-array can be shared, but occurrence object differs.
        const occurrencesBefore = buildOccurrencesByDay(eventsBefore, [days[0]]);
        const occurrencesAfter = buildOccurrencesByDay(eventsAfter, [days[0]]);
        const keysBefore = occurrencesBefore.keysByDay.get(days[0].key) ?? [];
        const keysAfter = occurrencesAfter.keysByDay.get(days[0].key) ?? [];

        const first = computeTimedLanes({
          adapter,
          occurrencesByKey: occurrencesBefore.byKey,
          containers: [[days[0].key, keysBefore]],
          maxSpan: 1,
        });
        const second = computeTimedLanes({
          adapter,
          occurrencesByKey: occurrencesAfter.byKey,
          containers: [[days[0].key, keysAfter]],
          maxSpan: 1,
          previous: {
            result: first,
            occurrencesByKey: occurrencesBefore.byKey,
            containerKeysByContainer: new Map([[days[0].key, keysBefore]]),
          },
        });

        expect(second.byContainer.get(days[0].key)).not.to.equal(
          first.byContainer.get(days[0].key),
        );
      });
    });
  });
});
