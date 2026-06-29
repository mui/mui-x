import { warnOnce } from '@mui/x-internals/warning';
import { TemporalTimezone } from '@base-ui/react/internals/temporal';
import { SchedulerEvent, SchedulerProcessedEvent } from '../models';
import { processDate } from '../process-date';
import { normalizeAllDayBounds } from '../internals/utils/date-utils';
import { Adapter } from '../use-adapter';
import { SchedulerRecurringEventsPluginInterface } from '../internals/plugins/SchedulerRecurringEventsPlugin.types';
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

  const startInDisplayTz = adapter.setTimezone(startInstant, displayTimezone);
  const endInDisplayTz = adapter.setTimezone(endInstant, displayTimezone);
  const displayBounds = normalizeAllDayBounds(
    adapter,
    startInDisplayTz,
    endInDisplayTz,
    model.allDay,
  );
  const exDatesInDisplayTz = resolvedExDates
    ? resolvedExDates.map((exDate) => adapter.setTimezone(exDate, displayTimezone))
    : undefined;

  if (recurringEventsPlugin == null && model.rrule != null) {
    if (process.env.NODE_ENV !== 'production') {
      warnOnce([
        'MUI X Scheduler: Recurring events are a premium feature. The `rrule` property will be ignored.',
        'Use <EventCalendarPremium /> or <EventTimelinePremium /> to enable recurring events.',
      ]);
    }
  }

  const parsedDataRRule =
    recurringEventsPlugin && model.rrule
      ? recurringEventsPlugin.parseRRule(adapter, model.rrule, dataTimezone)
      : undefined;

  const displayTimezoneRRule =
    recurringEventsPlugin && parsedDataRRule
      ? recurringEventsPlugin.projectRRuleToTimezone(
          adapter,
          parsedDataRRule,
          displayTimezone,
          startInstant,
        )
      : undefined;

  return {
    id: model.id,
    title: model.title,
    description: model.description,
    dataTimezone: {
      start: processDate(startInstant, adapter),
      end: processDate(endInstant, adapter),
      timezone: dataTimezone,
      rrule: parsedDataRRule,
      exDates: resolvedExDates,
    },
    displayTimezone: {
      start: processDate(displayBounds.start, adapter),
      end: processDate(displayBounds.end, adapter),
      timezone: displayTimezone,
      rrule: displayTimezoneRRule,
      exDates: exDatesInDisplayTz,
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
