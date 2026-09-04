import { describe, expect, it } from 'vitest';
import { adapter, EventBuilder } from 'test/utils/scheduler';
import type { SchedulerEventId, SchedulerProcessedEvent } from '@mui/x-scheduler-internals/models';
import type { TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import type { SchedulerDependency } from '../../models';
import { groupByEventId } from './dependency-utils';
import { computeAutoSchedulingCascade } from './auto-scheduling';

const date = (value: string): TemporalSupportedObject => adapter.date(value, 'default');
// `Z` strings resolve to the machine timezone, so the all-day fixtures use wall-time
// strings with an explicit zone to stay machine-independent.
const utcDate = (value: string): TemporalSupportedObject => adapter.date(value, 'UTC');

function buildLookup(events: SchedulerProcessedEvent[]) {
  return new Map(events.map((event) => [event.id, event]));
}

let dependencyCount = 0;
function fsDependency(source: SchedulerEventId, target: SchedulerEventId): SchedulerDependency {
  dependencyCount += 1;
  return { id: `dep-${dependencyCount}`, source, target, type: 'FinishToStart' };
}

interface CascadeOverrides {
  isEventReadOnly?: (eventId: SchedulerEventId) => boolean;
  deleted?: ReadonlySet<SchedulerEventId>;
}

function runCascadeResult(
  events: SchedulerProcessedEvent[],
  dependencies: SchedulerDependency[],
  updated: Parameters<typeof computeAutoSchedulingCascade>[0]['updated'],
  overrides: CascadeOverrides = {},
) {
  return computeAutoSchedulingCascade({
    adapter,
    processedEventLookup: buildLookup(events),
    activeDependenciesBySource: groupByEventId(dependencies, 'source'),
    activeDependenciesByTarget: groupByEventId(dependencies, 'target'),
    isEventReadOnly: overrides.isEventReadOnly ?? (() => false),
    updated,
    deleted: overrides.deleted ?? new Set(),
  });
}

function runCascade(
  events: SchedulerProcessedEvent[],
  dependencies: SchedulerDependency[],
  updated: Parameters<typeof computeAutoSchedulingCascade>[0]['updated'],
  overrides: CascadeOverrides = {},
) {
  return runCascadeResult(events, dependencies, updated, overrides).updated;
}

function expectDates(
  entry: { start?: TemporalSupportedObject; end?: TemporalSupportedObject },
  start: string,
  end: string,
) {
  expect(adapter.getTime(entry.start!)).to.equal(adapter.getTime(date(start)));
  expect(adapter.getTime(entry.end!)).to.equal(adapter.getTime(date(end)));
}

describe('computeAutoSchedulingCascade', () => {
  it("should push a violated FS successor to the predecessor's new end", () => {
    const predecessor = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const successor = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:30:00Z', '2025-07-03T11:30:00Z')
      .toProcessed();

    const result = runCascade(
      [predecessor, successor],
      [fsDependency('a', 'b')],
      [{ id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') }],
    );

    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('b');
    expectDates(result[0], '2025-07-03T12:00:00Z', '2025-07-03T13:00:00Z');
  });

  it('should mirror the store when a cross-timezone all-day resend stretches the event', () => {
    const newYorkDate = (value: string) => adapter.date(value, 'America/New_York');
    const eventA = EventBuilder.new()
      .id('a')
      .withDataTimezone('UTC')
      .span('2025-07-04T00:00:00', '2025-07-04T23:59:59.999', { allDay: true })
      .toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-05T01:00:00Z', '2025-07-05T02:00:00Z')
      .toProcessed();

    // The dialog resends "the same day" as display-zone bounds (computeRange builds
    // them with the display timezone). Applied in the data timezone those stretch the
    // event to a second day — the engine mirrors the store's effective result. The
    // stretch itself is an upstream dialog issue, not an engine choice.
    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [
        {
          id: 'a',
          title: 'Renamed',
          start: newYorkDate('2025-07-04T00:00:00'),
          end: newYorkDate('2025-07-04T23:59:59.999'),
          allDay: true,
        },
      ],
    );

    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('b');
    expect(adapter.getTime(result[0].start!)).to.equal(
      adapter.getTime(utcDate('2025-07-06T00:00:00')),
    );
  });

  it('should cascade a cross-timezone all-day move from its data-zone bounds', () => {
    const newYorkDate = (value: string) => adapter.date(value, 'America/New_York');
    const eventA = EventBuilder.new()
      .id('a')
      .withDataTimezone('UTC')
      .span('2025-07-04T00:00:00', '2025-07-04T23:59:59.999', { allDay: true })
      .toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-05T01:00:00Z', '2025-07-05T02:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [
        {
          id: 'a',
          start: newYorkDate('2025-07-05T00:00:00'),
          end: newYorkDate('2025-07-05T23:59:59.999'),
          allDay: true,
        },
      ],
    );

    // The display-zone day bounds resolve to the 05→06 data-zone span (same
    // upstream stretch as above): b lands after its effective end.
    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('b');
    expect(adapter.getTime(result[0].start!)).to.equal(
      adapter.getTime(utcDate('2025-07-07T00:00:00')),
    );
  });

  it('should skip a cascade target missing from the lookup', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'ghost'), fsDependency('a', 'b')],
      [{ id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') }],
    );

    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('b');
  });

  it('should not clamp a pre-violated event whose entry resends its start with a new end', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T08:00:00Z', '2025-07-03T09:00:00Z')
      .toProcessed();

    // The dialog's end resize: `start` resent unchanged alongside the new end.
    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [
        {
          id: 'b',
          start: date('2025-07-03T08:00:00Z'),
          end: date('2025-07-03T09:30:00Z'),
        },
      ],
    );

    expect(result).to.deep.equal([]);
  });

  it('should report every blocked read-only successor', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .readOnly()
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();
    const eventC = EventBuilder.new()
      .id('c')
      .readOnly()
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();

    const result = runCascadeResult(
      [eventA, eventB, eventC],
      [fsDependency('a', 'b'), fsDependency('a', 'c')],
      [{ id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') }],
      { isEventReadOnly: (eventId) => eventId !== 'a' },
    );

    expect(result.updated).to.deep.equal([]);
    expect(result.blocked).to.have.members(['b', 'c']);
  });

  it('should let a later recurring entry win over an earlier dated one', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [
        { id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') },
        { id: 'a', rrule: { freq: 'DAILY', interval: 1 } },
      ],
    );

    expect(result).to.deep.equal([]);
  });

  it('should drive the cascade from the last of two dated entries', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [
        { id: 'a', start: date('2025-07-03T13:00:00Z'), end: date('2025-07-03T14:00:00Z') },
        { id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') },
      ],
    );

    expect(result).to.have.length(1);
    expectDates(result[0], '2025-07-03T12:00:00Z', '2025-07-03T13:00:00Z');
  });

  it('should ignore an allDay resend that does not change the bounds', () => {
    const eventA = EventBuilder.new()
      .id('a')
      .withDataTimezone('UTC')
      .span('2025-07-03T00:00:00', '2025-07-03T23:59:59.999', { allDay: true })
      .toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-04T01:00:00Z', '2025-07-04T02:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [{ id: 'a', allDay: true }],
    );

    expect(result).to.deep.equal([]);
  });

  it('should clamp a start-only reposition', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T11:00:00Z', '2025-07-03T12:00:00Z')
      .toProcessed();

    // `end` omitted: resolves from the current model and stays put, the event shrinks.
    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [{ id: 'b', start: date('2025-07-03T09:30:00Z') }],
    );

    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('b');
    expectDates(result[0], '2025-07-03T10:00:00Z', '2025-07-03T12:00:00Z');
  });

  it('should keep the end of a start-resized event clamped against its predecessor', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T11:00:00Z', '2025-07-03T12:00:00Z')
      .toProcessed();

    // A start resize resends the unchanged end (drag-and-drop and the dialog both do).
    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [{ id: 'b', start: date('2025-07-03T09:30:00Z'), end: date('2025-07-03T12:00:00Z') }],
    );

    expect(result).to.have.length(1);
    expectDates(result[0], '2025-07-03T10:00:00Z', '2025-07-03T12:00:00Z');
  });

  it('should keep the duration of a start-resized event whose end would not survive the clamp', () => {
    const eventA = EventBuilder.new()
      .id('a')
      .span('2025-07-03T12:00:00Z', '2025-07-03T13:00:00Z')
      .toProcessed();
    // Pre-existing violation: B already ends before A does.
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T12:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [{ id: 'b', start: date('2025-07-03T09:30:00Z'), end: date('2025-07-03T12:00:00Z') }],
    );

    expect(result).to.have.length(1);
    expectDates(result[0], '2025-07-03T13:00:00Z', '2025-07-03T15:30:00Z');
  });

  it('should keep the end of a start-resized all-day event clamped by whole days', () => {
    const predecessor = EventBuilder.new().id('a').singleDay('2025-07-04T09:00:00Z').toProcessed();
    const successor = EventBuilder.new()
      .id('b')
      .withDataTimezone('UTC')
      .span('2025-07-10T00:00:00', '2025-07-12T23:59:59.999', { allDay: true })
      .toProcessed();

    const result = runCascade(
      [predecessor, successor],
      [fsDependency('a', 'b')],
      [
        {
          id: 'b',
          start: utcDate('2025-07-04T00:00:00'),
          end: utcDate('2025-07-12T23:59:59.999'),
          allDay: true,
        },
      ],
    );

    expect(result).to.have.length(1);
    expect(adapter.getTime(result[0].start!)).to.equal(
      adapter.getTime(utcDate('2025-07-05T00:00:00')),
    );
    expect(adapter.getTime(result[0].end!)).to.equal(
      adapter.getTime(utcDate('2025-07-12T23:59:59.999')),
    );
  });

  it('should not report blocked events on an unobstructed cascade', () => {
    const predecessor = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const successor = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:30:00Z', '2025-07-03T11:30:00Z')
      .toProcessed();

    const result = runCascadeResult(
      [predecessor, successor],
      [fsDependency('a', 'b')],
      [{ id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') }],
    );

    expect(result.blocked).to.deep.equal([]);
  });

  it('should not move a successor whose slack absorbs the change', () => {
    const predecessor = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const successor = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:30:00Z', '2025-07-03T11:30:00Z')
      .toProcessed();

    const result = runCascade(
      [predecessor, successor],
      [fsDependency('a', 'b')],
      [{ id: 'a', start: date('2025-07-03T09:15:00Z'), end: date('2025-07-03T10:15:00Z') }],
    );

    expect(result).to.deep.equal([]);
  });

  it('should not move a successor when the predecessor moves earlier', () => {
    const predecessor = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const successor = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();

    const result = runCascade(
      [predecessor, successor],
      [fsDependency('a', 'b')],
      [{ id: 'a', start: date('2025-07-03T08:00:00Z'), end: date('2025-07-03T09:00:00Z') }],
    );

    expect(result).to.deep.equal([]);
  });

  it('should cascade through a chain', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();
    const eventC = EventBuilder.new()
      .id('c')
      .span('2025-07-03T11:00:00Z', '2025-07-03T12:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB, eventC],
      [fsDependency('a', 'b'), fsDependency('b', 'c')],
      [{ id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') }],
    );

    expect(result).to.have.length(2);
    const byId = new Map(result.map((entry) => [entry.id, entry]));
    expectDates(byId.get('b')!, '2025-07-03T12:00:00Z', '2025-07-03T13:00:00Z');
    expectDates(byId.get('c')!, '2025-07-03T13:00:00Z', '2025-07-03T14:00:00Z');
  });

  it('should settle a diamond at the max of both predecessors without double-shifting', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    // b is long (3h), c is short (1h): d must land after b, the later parent.
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T13:00:00Z')
      .toProcessed();
    const eventC = EventBuilder.new()
      .id('c')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();
    const eventD = EventBuilder.new()
      .id('d')
      .span('2025-07-03T13:00:00Z', '2025-07-03T14:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB, eventC, eventD],
      [
        fsDependency('a', 'b'),
        fsDependency('a', 'c'),
        fsDependency('b', 'd'),
        fsDependency('c', 'd'),
      ],
      [{ id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') }],
    );

    expect(result).to.have.length(3);
    const byId = new Map(result.map((entry) => [entry.id, entry]));
    expectDates(byId.get('b')!, '2025-07-03T12:00:00Z', '2025-07-03T15:00:00Z');
    expectDates(byId.get('c')!, '2025-07-03T12:00:00Z', '2025-07-03T13:00:00Z');
    // d follows b (ends 15:00), not c (ends 13:00), and is shifted exactly once.
    expectDates(byId.get('d')!, '2025-07-03T15:00:00Z', '2025-07-03T16:00:00Z');
  });

  it('should apply the max rule over multiple moved predecessors', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new().id('b').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventC = EventBuilder.new()
      .id('c')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB, eventC],
      [fsDependency('a', 'c'), fsDependency('b', 'c')],
      [
        { id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') },
        { id: 'b', start: date('2025-07-03T13:00:00Z'), end: date('2025-07-03T14:00:00Z') },
      ],
    );

    expect(result).to.have.length(1);
    expectDates(result[0], '2025-07-03T14:00:00Z', '2025-07-03T15:00:00Z');
  });

  it('should preserve timed duration in absolute milliseconds across a DST transition', () => {
    // America/New_York springs forward on 2025-03-09: 02:00 → 03:00.
    const predecessor = EventBuilder.new()
      .id('a')
      .withDataTimezone('America/New_York')
      .singleDay('2025-03-08T20:00:00')
      .toProcessed();
    const successor = EventBuilder.new()
      .id('b')
      .withDataTimezone('America/New_York')
      .span('2025-03-08T22:00:00', '2025-03-08T23:00:00')
      .toProcessed();

    const newYorkDate = (value: string) => adapter.date(value, 'America/New_York');
    const result = runCascade(
      [predecessor, successor],
      [fsDependency('a', 'b')],
      [
        {
          id: 'a',
          start: newYorkDate('2025-03-09T00:30:00'),
          end: newYorkDate('2025-03-09T01:30:00'),
        },
      ],
    );

    expect(result).to.have.length(1);
    // 1h in absolute milliseconds: the wall-clock end lands at 03:30 (02:30 does not
    // exist that night).
    expect(adapter.getTime(result[0].end!) - adapter.getTime(result[0].start!)).to.equal(
      60 * 60 * 1000,
    );
    expect(adapter.getTime(result[0].start!)).to.equal(
      adapter.getTime(newYorkDate('2025-03-09T01:30:00')),
    );
  });

  it('should push a violated all-day successor by the minimal whole number of days', () => {
    const predecessor = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const successor = EventBuilder.new()
      .id('b')
      .withDataTimezone('UTC')
      .span('2025-07-03T00:00:00', '2025-07-03T23:59:59.999', { allDay: true })
      .toProcessed();

    const result = runCascade(
      [predecessor, successor],
      [fsDependency('a', 'b')],
      [{ id: 'a', start: date('2025-07-04T09:00:00Z'), end: date('2025-07-04T10:00:00Z') }],
    );

    expect(result).to.have.length(1);
    // One day forward would still start before the required 07-04T10:00: the minimal
    // whole-day shift is two days.
    expect(adapter.getTime(result[0].start!)).to.equal(
      adapter.getTime(utcDate('2025-07-05T00:00:00')),
    );
    expect(adapter.getTime(result[0].end!)).to.equal(
      adapter.getTime(utcDate('2025-07-05T23:59:59.999')),
    );
  });

  it('should start a timed successor on the day after an all-day predecessor', () => {
    const predecessor = EventBuilder.new()
      .id('a')
      .withDataTimezone('UTC')
      .span('2025-07-03T00:00:00', '2025-07-03T23:59:59.999', { allDay: true })
      .toProcessed();
    const successor = EventBuilder.new()
      .id('b')
      .span('2025-07-04T09:00:00Z', '2025-07-04T10:00:00Z')
      .toProcessed();

    const result = runCascade(
      [predecessor, successor],
      [fsDependency('a', 'b')],
      [
        {
          id: 'a',
          start: utcDate('2025-07-04T00:00:00'),
          end: utcDate('2025-07-04T23:59:59.999'),
          allDay: true,
        },
      ],
    );

    expect(result).to.have.length(1);
    // Starts at the next day's first instant, not the inclusive 23:59:59.999 end —
    // wall-time serialization has second resolution and would truncate the .999.
    expect(adapter.getTime(result[0].start!)).to.equal(
      adapter.getTime(utcDate('2025-07-05T00:00:00')),
    );
    expect(adapter.getTime(result[0].end!)).to.equal(
      adapter.getTime(utcDate('2025-07-05T01:00:00')),
    );
  });

  it('should preserve the day span of an all-day successor pushed by an all-day predecessor', () => {
    const predecessor = EventBuilder.new()
      .id('a')
      .withDataTimezone('UTC')
      .span('2025-07-01T00:00:00', '2025-07-01T23:59:59.999', { allDay: true })
      .toProcessed();
    const successor = EventBuilder.new()
      .id('b')
      .withDataTimezone('UTC')
      .span('2025-07-03T00:00:00', '2025-07-04T23:59:59.999', { allDay: true })
      .toProcessed();

    const result = runCascade(
      [predecessor, successor],
      [fsDependency('a', 'b')],
      [
        {
          id: 'a',
          start: utcDate('2025-07-03T00:00:00'),
          end: utcDate('2025-07-03T23:59:59.999'),
          allDay: true,
        },
      ],
    );

    expect(result).to.have.length(1);
    // Pushed by one day, still spanning two days.
    expect(adapter.getTime(result[0].start!)).to.equal(
      adapter.getTime(utcDate('2025-07-04T00:00:00')),
    );
    expect(adapter.getTime(result[0].end!)).to.equal(
      adapter.getTime(utcDate('2025-07-05T23:59:59.999')),
    );
  });

  it('should shift an all-day successor by whole days across a DST transition', () => {
    // America/New_York springs forward on 2025-03-09, making that day 23h long.
    const predecessor = EventBuilder.new()
      .id('a')
      .withDataTimezone('America/New_York')
      .span('2025-03-08T00:00:00', '2025-03-08T23:59:59.999', { allDay: true })
      .toProcessed();
    const successor = EventBuilder.new()
      .id('b')
      .withDataTimezone('America/New_York')
      .span('2025-03-08T00:00:00', '2025-03-08T23:59:59.999', { allDay: true })
      .toProcessed();

    const newYorkDate = (value: string) => adapter.date(value, 'America/New_York');
    const result = runCascade(
      [predecessor, successor],
      [fsDependency('a', 'b')],
      [
        {
          id: 'a',
          start: newYorkDate('2025-03-09T00:00:00'),
          end: newYorkDate('2025-03-09T23:59:59.999'),
          allDay: true,
        },
      ],
    );

    expect(result).to.have.length(1);
    // The shift crosses the 23h day but still lands day-aligned on 03-10.
    expect(adapter.getTime(result[0].start!)).to.equal(
      adapter.getTime(newYorkDate('2025-03-10T00:00:00')),
    );
    expect(adapter.getTime(result[0].end!)).to.equal(
      adapter.getTime(newYorkDate('2025-03-10T23:59:59.999')),
    );
  });

  it('should leave a read-only successor in place and stop the cascade through it', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .readOnly()
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();
    const eventC = EventBuilder.new()
      .id('c')
      .span('2025-07-03T11:00:00Z', '2025-07-03T12:00:00Z')
      .toProcessed();

    const result = runCascadeResult(
      [eventA, eventB, eventC],
      [fsDependency('a', 'b'), fsDependency('b', 'c')],
      [{ id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') }],
      { isEventReadOnly: (eventId) => eventId === 'b' },
    );

    // b cannot restore the constraint: the batch is reported as blocked so the
    // caller rejects it; c has no moved predecessor either way.
    expect(result.updated).to.deep.equal([]);
    expect(result.blocked).to.deep.equal(['b']);
  });

  it('should report a transitively blocked read-only successor', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();
    const eventC = EventBuilder.new()
      .id('c')
      .readOnly()
      .span('2025-07-03T11:00:00Z', '2025-07-03T12:00:00Z')
      .toProcessed();

    const result = runCascadeResult(
      [eventA, eventB, eventC],
      [fsDependency('a', 'b'), fsDependency('b', 'c')],
      [{ id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') }],
      { isEventReadOnly: (eventId) => eventId === 'c' },
    );

    // b's push would in turn need to move the read-only c.
    expect(result.blocked).to.deep.equal(['c']);
  });

  it('should not cascade into an event deleted in the same batch', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [{ id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') }],
      { deleted: new Set(['b']) },
    );

    expect(result).to.deep.equal([]);
  });

  it("should clamp an updated successor dropped before a moved predecessor's new end", () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [
        { id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') },
        // The user also placed b themselves, still violating: b is clamped forward.
        { id: 'b', start: date('2025-07-03T11:30:00Z'), end: date('2025-07-03T12:30:00Z') },
      ],
    );

    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('b');
    expectDates(result[0], '2025-07-03T12:00:00Z', '2025-07-03T13:00:00Z');
  });

  it('should clamp an updated successor dropped before the end of an unmoved predecessor', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T11:00:00Z', '2025-07-03T12:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [{ id: 'b', start: date('2025-07-03T09:30:00Z'), end: date('2025-07-03T10:30:00Z') }],
    );

    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('b');
    expectDates(result[0], '2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z');
  });

  it('should not clamp an updated successor dropped at a valid position', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T12:00:00Z', '2025-07-03T13:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [{ id: 'b', start: date('2025-07-03T10:00:00Z'), end: date('2025-07-03T11:00:00Z') }],
    );

    expect(result).to.deep.equal([]);
  });

  it('should cascade from the clamped position of a dropped successor', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T11:00:00Z', '2025-07-03T12:00:00Z')
      .toProcessed();
    const eventC = EventBuilder.new()
      .id('c')
      .span('2025-07-03T10:30:00Z', '2025-07-03T11:30:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB, eventC],
      [fsDependency('a', 'b'), fsDependency('b', 'c')],
      [{ id: 'b', start: date('2025-07-03T09:00:00Z'), end: date('2025-07-03T10:00:00Z') }],
    );

    expect(result).to.have.length(2);
    const byId = new Map(result.map((entry) => [entry.id, entry]));
    // b clamps to a's end, and c is pushed from b's clamped end, not its dropped one.
    expectDates(byId.get('b')!, '2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z');
    expectDates(byId.get('c')!, '2025-07-03T11:00:00Z', '2025-07-03T12:00:00Z');
  });

  it("should clamp a dropped successor against a cascaded predecessor's new end", () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();
    const eventC = EventBuilder.new()
      .id('c')
      .span('2025-07-03T13:00:00Z', '2025-07-03T14:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB, eventC],
      [fsDependency('a', 'b'), fsDependency('b', 'c')],
      [
        { id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') },
        // c is dropped where b's *pushed* position (12:00–13:00) still overlaps it.
        { id: 'c', start: date('2025-07-03T10:00:00Z'), end: date('2025-07-03T11:00:00Z') },
      ],
    );

    expect(result).to.have.length(2);
    const byId = new Map(result.map((entry) => [entry.id, entry]));
    expectDates(byId.get('b')!, '2025-07-03T12:00:00Z', '2025-07-03T13:00:00Z');
    expectDates(byId.get('c')!, '2025-07-03T13:00:00Z', '2025-07-03T14:00:00Z');
  });

  it('should not reposition an event whose entry resends its current dates', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    // b arrived already violating; the dialog resends start/end on every save.
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T08:00:00Z', '2025-07-03T09:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [
        {
          id: 'b',
          title: 'Renamed',
          start: date('2025-07-03T08:00:00Z'),
          end: date('2025-07-03T09:00:00Z'),
        },
      ],
    );

    expect(result).to.deep.equal([]);
  });

  it('should not push a pre-violated successor when its predecessor resends its dates', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T08:00:00Z', '2025-07-03T09:00:00Z')
      .toProcessed();

    // A dialog save of a resends unchanged dates: a did not move, so b's pre-existing
    // violation stays as-is.
    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [
        {
          id: 'a',
          title: 'Renamed',
          start: date('2025-07-03T09:00:00Z'),
          end: date('2025-07-03T10:00:00Z'),
        },
      ],
    );

    expect(result).to.deep.equal([]);
  });

  it('should push an end-resized event violated by the same batch', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [
        { id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') },
        // The violation is created by this batch, not pre-existing: b is pushed from
        // its resized bounds, keeping the new 2h30 duration.
        { id: 'b', end: date('2025-07-03T12:30:00Z') },
      ],
    );

    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('b');
    expectDates(result[0], '2025-07-03T12:00:00Z', '2025-07-03T14:30:00Z');
  });

  it('should apply only the last entry of an id, like the store', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();

    // The store folds with whole-entry last-wins: the dateless second entry is the
    // one applied, so a never moves and nothing cascades.
    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [
        { id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') },
        { id: 'a', title: 'Renamed' },
      ],
    );

    expect(result).to.deep.equal([]);
  });

  it('should let a later dated entry replace an earlier recurring one', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [
        { id: 'a', rrule: { freq: 'DAILY', interval: 1 } },
        { id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') },
      ],
    );

    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('b');
  });

  it('should cascade an all-day-only update that moves the effective end', () => {
    const eventA = EventBuilder.new()
      .id('a')
      .withDataTimezone('UTC')
      .span('2025-07-03T09:00:00', '2025-07-03T10:00:00')
      .toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .withDataTimezone('UTC')
      .span('2025-07-03T11:00:00', '2025-07-03T12:00:00')
      .toProcessed();

    // Flipping a to all-day moves its effective end to the end of the day.
    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [{ id: 'a', allDay: true }],
    );

    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('b');
    expect(adapter.getTime(result[0].start!)).to.equal(
      adapter.getTime(utcDate('2025-07-04T00:00:00')),
    );
    expect(adapter.getTime(result[0].end!)).to.equal(
      adapter.getTime(utcDate('2025-07-04T01:00:00')),
    );
  });

  it('should clamp a timed event dropped onto an all-day predecessor to the next day', () => {
    const predecessor = EventBuilder.new()
      .id('a')
      .withDataTimezone('UTC')
      .span('2025-07-04T00:00:00', '2025-07-04T23:59:59.999', { allDay: true })
      .toProcessed();
    const successor = EventBuilder.new()
      .id('b')
      .span('2025-07-10T09:00:00Z', '2025-07-10T10:00:00Z')
      .toProcessed();

    const result = runCascade(
      [predecessor, successor],
      [fsDependency('a', 'b')],
      [{ id: 'b', start: utcDate('2025-07-04T10:00:00'), end: utcDate('2025-07-04T11:00:00') }],
    );

    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('b');
    expect(adapter.getTime(result[0].start!)).to.equal(
      adapter.getTime(utcDate('2025-07-05T00:00:00')),
    );
  });

  it('should clamp a dropped event against a read-only predecessor', () => {
    // Read-only stops an event from being moved, not from constraining others.
    const eventA = EventBuilder.new()
      .id('a')
      .readOnly()
      .singleDay('2025-07-03T09:00:00Z')
      .toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T11:00:00Z', '2025-07-03T12:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [{ id: 'b', start: date('2025-07-03T09:00:00Z'), end: date('2025-07-03T10:00:00Z') }],
      { isEventReadOnly: (eventId) => eventId === 'a' },
    );

    expect(result).to.have.length(1);
    expectDates(result[0], '2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z');
  });

  it('should push an all-day successor by whole days across a fall-back transition', () => {
    // America/New_York falls back on 2025-11-02: the day is 25h long, so the ms
    // estimate overshoots and the correction loops must settle on one day.
    const newYorkDate = (value: string) => adapter.date(value, 'America/New_York');
    const predecessor = EventBuilder.new()
      .id('a')
      .withDataTimezone('America/New_York')
      .span('2025-11-01T00:00:00', '2025-11-01T23:59:59.999', { allDay: true })
      .toProcessed();
    const successor = EventBuilder.new()
      .id('b')
      .withDataTimezone('America/New_York')
      .span('2025-11-02T00:00:00', '2025-11-02T23:59:59.999', { allDay: true })
      .toProcessed();

    const result = runCascade(
      [predecessor, successor],
      [fsDependency('a', 'b')],
      [
        {
          id: 'a',
          start: newYorkDate('2025-11-02T00:00:00'),
          end: newYorkDate('2025-11-02T23:59:59.999'),
          allDay: true,
        },
      ],
    );

    expect(result).to.have.length(1);
    expect(adapter.getTime(result[0].start!)).to.equal(
      adapter.getTime(newYorkDate('2025-11-03T00:00:00')),
    );
    expect(adapter.getTime(result[0].end!)).to.equal(
      adapter.getTime(newYorkDate('2025-11-03T23:59:59.999')),
    );
  });

  it('should push a successor once through duplicate parallel edges', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b'), fsDependency('a', 'b')],
      [{ id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') }],
    );

    expect(result).to.have.length(1);
    expectDates(result[0], '2025-07-03T12:00:00Z', '2025-07-03T13:00:00Z');
  });

  it('should clamp a dropped event against a predecessor in another data timezone', () => {
    const predecessor = EventBuilder.new()
      .id('a')
      .withDataTimezone('America/New_York')
      .span('2025-07-03T05:00:00', '2025-07-03T06:00:00')
      .toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T11:00:00Z', '2025-07-03T12:00:00Z')
      .toProcessed();

    // a ends 06:00 New York = 10:00 UTC; the drop at 09:30 UTC violates by instant.
    const result = runCascade(
      [predecessor, eventB],
      [fsDependency('a', 'b')],
      [{ id: 'b', start: date('2025-07-03T09:30:00Z'), end: date('2025-07-03T10:30:00Z') }],
    );

    expect(result).to.have.length(1);
    expectDates(result[0], '2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z');
  });

  it('should skip an unloaded predecessor when clamping a dropped event', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T11:00:00Z', '2025-07-03T12:00:00Z')
      .toProcessed();

    // The 'ghost' edge references an event missing from the lookup (lazy loading):
    // only the loaded predecessor constrains, and nothing crashes.
    const result = runCascade(
      [eventA, eventB],
      [fsDependency('ghost', 'b'), fsDependency('a', 'b')],
      [{ id: 'b', start: date('2025-07-03T09:00:00Z'), end: date('2025-07-03T10:00:00Z') }],
    );

    expect(result).to.have.length(1);
    expectDates(result[0], '2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z');
  });

  it('should not clamp an updated event whose start is unchanged', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    // b arrived already violating; resizing its end does not re-position it.
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T08:00:00Z', '2025-07-03T09:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [{ id: 'b', end: date('2025-07-03T09:30:00Z') }],
    );

    expect(result).to.deep.equal([]);
  });

  it('should clamp an all-day successor dropped before its predecessor by whole days', () => {
    const predecessor = EventBuilder.new().id('a').singleDay('2025-07-04T09:00:00Z').toProcessed();
    const successor = EventBuilder.new()
      .id('b')
      .withDataTimezone('UTC')
      .span('2025-07-10T00:00:00', '2025-07-10T23:59:59.999', { allDay: true })
      .toProcessed();

    const result = runCascade(
      [predecessor, successor],
      [fsDependency('a', 'b')],
      [
        {
          id: 'b',
          start: utcDate('2025-07-04T00:00:00'),
          end: utcDate('2025-07-04T23:59:59.999'),
          allDay: true,
        },
      ],
    );

    expect(result).to.have.length(1);
    // The dropped day starts before the predecessor's 10:00 end: minimal whole-day
    // clamp from the dropped position is one day.
    expect(adapter.getTime(result[0].start!)).to.equal(
      adapter.getTime(utcDate('2025-07-05T00:00:00')),
    );
    expect(adapter.getTime(result[0].end!)).to.equal(
      adapter.getTime(utcDate('2025-07-05T23:59:59.999')),
    );
  });

  it('should report a read-only updated event dropped into violation as blocked', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .readOnly()
      .span('2025-07-03T11:00:00Z', '2025-07-03T12:00:00Z')
      .toProcessed();

    const result = runCascadeResult(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [{ id: 'b', start: date('2025-07-03T09:00:00Z'), end: date('2025-07-03T10:00:00Z') }],
      { isEventReadOnly: (eventId) => eventId === 'b' },
    );

    expect(result.updated).to.deep.equal([]);
    expect(result.blocked).to.deep.equal(['b']);
  });

  it('should not clamp against a predecessor deleted in the same batch', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T11:00:00Z', '2025-07-03T12:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [{ id: 'b', start: date('2025-07-03T09:00:00Z'), end: date('2025-07-03T10:00:00Z') }],
      { deleted: new Set(['a']) },
    );

    expect(result).to.deep.equal([]);
  });

  it('should not clamp against a predecessor turning recurring in the same batch', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T11:00:00Z', '2025-07-03T12:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [
        { id: 'a', rrule: { freq: 'DAILY', interval: 1 } },
        { id: 'b', start: date('2025-07-03T09:00:00Z'), end: date('2025-07-03T10:00:00Z') },
      ],
    );

    expect(result).to.deep.equal([]);
  });

  it('should skip an event whose update makes it recurring in the same batch', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [
        { id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') },
        { id: 'b', rrule: { freq: 'DAILY', interval: 1 } },
      ],
    );

    expect(result).to.deep.equal([]);
  });

  it('should ignore an update that does not change the dates', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T08:00:00Z', '2025-07-03T09:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB],
      [fsDependency('a', 'b')],
      [{ id: 'a', title: 'Renamed' }],
    );

    expect(result).to.deep.equal([]);
  });

  it('should leave a pre-existing violation on an untouched chain as-is', () => {
    // a→b arrived already violating; moving c only cascades to d.
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T08:00:00Z', '2025-07-03T09:00:00Z')
      .toProcessed();
    const eventC = EventBuilder.new().id('c').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventD = EventBuilder.new()
      .id('d')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();

    const result = runCascade(
      [eventA, eventB, eventC, eventD],
      [fsDependency('a', 'b'), fsDependency('c', 'd')],
      [{ id: 'c', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') }],
    );

    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('d');
  });

  it('should push the successors of a seed sitting on a cycle, with a dev warning', () => {
    // The cycle is broken at the seed, so b is still pushed — and the bad data warns.
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();

    let result;
    expect(() => {
      result = runCascade(
        [eventA, eventB],
        [fsDependency('a', 'b'), fsDependency('b', 'a')],
        [{ id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') }],
      );
    }).toWarnDev([
      'MUI X Scheduler: The dependencies provided via props contain a cycle through an updated event.',
    ]);

    expect(result).to.have.length(1);
    expectDates(result![0], '2025-07-03T12:00:00Z', '2025-07-03T13:00:00Z');
  });

  it('should terminate and skip the cycle members on cyclic props data', () => {
    const eventA = EventBuilder.new().id('a').singleDay('2025-07-03T09:00:00Z').toProcessed();
    const eventB = EventBuilder.new()
      .id('b')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .toProcessed();
    const eventC = EventBuilder.new()
      .id('c')
      .span('2025-07-03T11:00:00Z', '2025-07-03T12:00:00Z')
      .toProcessed();
    const eventD = EventBuilder.new()
      .id('d')
      .span('2025-07-03T12:00:00Z', '2025-07-03T13:00:00Z')
      .toProcessed();

    let result;
    expect(() => {
      result = runCascade(
        [eventA, eventB, eventC, eventD],
        [
          fsDependency('a', 'b'),
          fsDependency('b', 'c'),
          fsDependency('c', 'b'),
          fsDependency('c', 'd'),
        ],
        [{ id: 'a', start: date('2025-07-03T11:00:00Z'), end: date('2025-07-03T12:00:00Z') }],
      );
    }).toWarnDev(['MUI X Scheduler: The dependencies provided via props contain a cycle.']);

    // b and c sit on the cycle and d behind it: all left unmoved instead of looping.
    expect(result).to.deep.equal([]);
  });
});
