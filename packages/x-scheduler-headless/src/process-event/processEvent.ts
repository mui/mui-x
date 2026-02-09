import { SchedulerEvent, SchedulerProcessedEvent } from '../models';
import { processDate } from '../process-date';
import { Adapter } from '../use-adapter';
import { parseRRule, projectRRuleToTimezone } from '../internals/utils/recurring-events';
import { TemporalTimezone } from '../base-ui-copy/types';

export function processEvent(
  model: SchedulerEvent,
  displayTimezone: TemporalTimezone,
  adapter: Adapter,
): SchedulerProcessedEvent {
  const dataTimezone = model.timezone ?? 'default';

  // TODO: Support wall-time events by reinterpreting instants in `dataTimezone`.
  const startInstant = model.start;
  const endInstant = model.end;

  const startInDisplayTz = adapter.setTimezone(startInstant, displayTimezone);
  const endInDisplayTz = adapter.setTimezone(endInstant, displayTimezone);
  const exDatesInDisplayTz = model.exDates
    ? model.exDates.map((exDate) => adapter.setTimezone(exDate, displayTimezone))
    : undefined;

  const parsedDataRRule = model.rrule ? parseRRule(adapter, model.rrule, dataTimezone) : undefined;

  const displayTimezoneRRule = parsedDataRRule
    ? projectRRuleToTimezone(adapter, parsedDataRRule, displayTimezone, model.start)
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
      exDates: model.exDates,
    },
    displayTimezone: {
      start: processDate(startInDisplayTz, adapter),
      end: processDate(endInDisplayTz, adapter),
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
