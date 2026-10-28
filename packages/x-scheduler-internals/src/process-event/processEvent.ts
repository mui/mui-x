import { warnOnce } from '@mui/x-internals/warning';
import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerEvent, SchedulerProcessedEvent } from '../models';
import { processDate } from '../process-date';
import { normalizeAllDayBounds } from '../internals/utils/plain-date-utils/adapter';
import type { Adapter } from '../use-adapter';
import type { SchedulerRecurringEventsPluginInterface } from '../internals/plugins/SchedulerRecurringEventsPlugin.types';
import { resolveEventDate } from './resolveEventDate';

export function processEvent(
  model: SchedulerEvent,
  displayTimezone: TemporalTimezone,
  adapter: Adapter,
  recurringEventsPlugin: SchedulerRecurringEventsPluginInterface | null = null,
): SchedulerProcessedEvent {
  const dataTimezone = model.timezone ?? 'default';

  const startInstant = resolveEventDate(model.start, dataTimezone, adapter, model.id);
  const endInstant = resolveEventDate(model.end, dataTimezone, adapter, model.id);
  const resolvedExDates = model.exDates
    ? model.exDates.map((exDate) => resolveEventDate(exDate, dataTimezone, adapter, model.id))
    : undefined;

  const displayBounds = normalizeAllDayBounds(
    adapter,
    startInstant,
    endInstant,
    model.allDay,
    displayTimezone,
  );

  if (recurringEventsPlugin == null && model.rrule != null) {
    if (process.env.NODE_ENV !== 'production') {
      warnOnce(
        [
          'MUI X Scheduler: Recurring events are a premium feature. The `rrule` property will be ignored.',
          'Use <EventCalendarPremium />, or <EventTimelinePremium /> with the `recurringEvents` feature from `@mui/x-scheduler-premium/recurring-events`, to enable recurring events.',
        ].join('\n'),
      );
    }
  }

  const parsedDataRRule =
    recurringEventsPlugin && model.rrule
      ? recurringEventsPlugin.parseRRule(adapter, model.rrule, dataTimezone)
      : undefined;

  return {
    id: model.id,
    title: model.title,
    description: model.description,
    dataTimezone: {
      start: processDate(startInstant, adapter, dataTimezone),
      end: processDate(endInstant, adapter, dataTimezone),
      timezone: dataTimezone,
      rrule: parsedDataRRule,
      exDates: resolvedExDates,
    },
    displayTimezone: {
      start: processDate(displayBounds.start, adapter, displayTimezone),
      end: processDate(displayBounds.end, adapter, displayTimezone),
      timezone: displayTimezone,
      exDates: resolvedExDates,
    },
    resource: model.resource,
    allDay: model.allDay ?? false,
    readOnly: model.readOnly ?? false,
    extractedFromId: model.extractedFromId,
    modelInBuiltInFormat: model,
    color: model.color,
    draggable: model.draggable,
    resizable: model.resizable,
    className: model.className,
  };
}
