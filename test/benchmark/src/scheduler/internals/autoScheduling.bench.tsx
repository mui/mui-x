// The builders of the Scheduler tests live outside of this package.
/* eslint-disable import/no-relative-packages */
import {
  computeAutoSchedulingCascade,
  groupByEventId,
} from '@mui/x-scheduler-internals-premium/internals';
import type { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import { addDays } from '../../../../utils/scheduler/dates';
import { EventBuilder } from '../../../../utils/scheduler/event-builder';
import { lazy, timeBenchmark } from '../../utils/timeBenchmark';

for (const [timezone, allDay] of [
  ['default', false],
  ['America/New_York', false],
  ['America/New_York', true],
] as const) {
  const getParameters = lazy(() => {
    // A chain of 300 tasks, each finishing one day before the next starts.
    const count = 300;
    const events = Array.from({ length: count }, (_, index) => {
      const builder = EventBuilder.new().id(index);
      const withTimezone = timezone === 'default' ? builder : builder.withDataTimezone(timezone);
      if (allDay) {
        // Every other day: the next task starts right after the lag.
        const dayStart = Date.UTC(2026, 0, 5) + index * 2 * 86_400_000;
        const day = new Date(dayStart).toISOString().slice(0, 10);
        const nextDay = new Date(dayStart + 86_400_000).toISOString().slice(0, 10);
        return withTimezone.span(day, nextDay, { allDay: true }).toProcessed();
      }
      // 8-hour tasks, each starting one day after the previous one ends.
      const start = new Date(Date.UTC(2026, 0, 5, 9) + index * 32 * 3_600_000);
      const end = new Date(start.getTime() + 8 * 3_600_000);
      return withTimezone
        .span(start.toISOString().slice(0, 19), end.toISOString().slice(0, 19))
        .toProcessed();
    });
    const dependencies: SchedulerDependency[] = events.slice(1).map((event, index) => ({
      id: `dep-${index}`,
      source: index,
      target: index + 1,
      type: 'FinishToStart',
      lag: 1,
      lagUnit: 'day',
    }));
    return {
      processedEventLookup: new Map(events.map((event) => [event.id, event])),
      activeDependenciesBySource: groupByEventId(dependencies, 'source'),
      activeDependenciesByTarget: groupByEventId(dependencies, 'target'),
      isEventReadOnly: () => false,
      deleted: new Set<number>(),
      displayTimezone: 'default',
      // Moving the first task 3 days later pushes the whole chain.
      updated: [
        {
          id: 0,
          start: addDays(new Date(events[0].start.epochMilliseconds), 3),
          end: addDays(new Date(events[0].end.epochMilliseconds), 3),
        },
      ],
    };
  });

  timeBenchmark(
    `Auto-scheduling - push a chain of 300 tasks (data timezone ${timezone}, all-day ${allDay})`,
    () => computeAutoSchedulingCascade(getParameters()),
  );
}
