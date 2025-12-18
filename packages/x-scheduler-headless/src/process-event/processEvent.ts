import { SchedulerEvent, SchedulerProcessedEvent } from '../models';
import { processDate } from '../process-date';
import { Adapter } from '../use-adapter';
import { parseRRule, projectRRuleToTimezone } from '../utils/recurring-events';
import { TemporalTimezone } from '../base-ui-copy/types';

export function processEvent(
  model: SchedulerEvent,
  displayTimezone: TemporalTimezone,
  adapter: Adapter,
): SchedulerProcessedEvent {
  const dataTimezone = model.timezone ?? 'default';

  const startInDataTz = model.start;
  const endInDataTz = model.end;

  const startInDisplayTz = adapter.setTimezone(startInDataTz, displayTimezone);
  const endInDisplayTz = adapter.setTimezone(endInDataTz, displayTimezone);

  const exDatesInDisplayTz = model.exDates
    ? model.exDates.map((d) => adapter.setTimezone(d, displayTimezone))
    : undefined;

  const parsedDataRRule = model.rrule ? parseRRule(adapter, model.rrule, dataTimezone) : undefined;

  const displayTimezoneRRule = parsedDataRRule
    ? projectRRuleToTimezone(adapter, parsedDataRRule, displayTimezone)
    : undefined;

  return {
    id: model.id,
    title: model.title,
    description: model.description,
    dataTimezone: {
      start: processDate(startInDataTz, adapter),
      end: processDate(endInDataTz, adapter),
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
