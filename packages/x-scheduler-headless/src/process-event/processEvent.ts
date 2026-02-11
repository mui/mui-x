import { SchedulerEvent, SchedulerProcessedEvent } from '../models';
import { processDate } from '../process-date';
import { Adapter } from '../use-adapter';
import { parseRRule, projectRRuleToTimezone } from '../internals/utils/recurring-events';
import { TemporalTimezone } from '../base-ui-copy/types';
import { resolveEventDate } from './resolveEventDate';

export function processEvent(
  model: SchedulerEvent,
  displayTimezone: TemporalTimezone,
  adapter: Adapter,
): SchedulerProcessedEvent {
  const dataTimezone = model.timezone ?? 'default';

  const startInstant = resolveEventDate(model.start, dataTimezone, adapter);
  const endInstant = resolveEventDate(model.end, dataTimezone, adapter);
  const resolvedExDates = model.exDates
    ? model.exDates.map((exDate) => resolveEventDate(exDate, dataTimezone, adapter))
    : undefined;

  const startInDisplayTz = adapter.setTimezone(startInstant, displayTimezone);
  const endInDisplayTz = adapter.setTimezone(endInstant, displayTimezone);
  const exDatesInDisplayTz = resolvedExDates
    ? resolvedExDates.map((exDate) => adapter.setTimezone(exDate, displayTimezone))
    : undefined;

  const parsedDataRRule = model.rrule ? parseRRule(adapter, model.rrule, dataTimezone) : undefined;

  const displayTimezoneRRule = parsedDataRRule
    ? projectRRuleToTimezone(adapter, parsedDataRRule, displayTimezone, startInstant)
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
      start: model.allDay
        ? processDate(adapter.startOfDay(startInDisplayTz), adapter)
        : processDate(startInDisplayTz, adapter),
      end: model.allDay
        ? processDate(adapter.endOfDay(endInDisplayTz), adapter)
        : processDate(endInDisplayTz, adapter),
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
