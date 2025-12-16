import { SchedulerEvent, SchedulerProcessedEvent } from '../models';
import { processDate } from '../process-date';
import { Adapter } from '../use-adapter';
import { parseRRuleString } from '../utils/recurring-events';
import { TemporalSupportedObject, TemporalTimezone } from '../base-ui-copy/types';

export function processEvent(
  model: SchedulerEvent,
  displayTimezone: TemporalTimezone,
  adapter: Adapter,
): SchedulerProcessedEvent {
  const startTimezone = adapter.getTimezone(model.start);
  const endTimezone = adapter.getTimezone(model.end);

  if (startTimezone !== endTimezone) {
    throw new Error(
      `Scheduler: The event with id "${model.id}" has different timezones for its start ("${startTimezone}") and end ("${endTimezone}") dates. ` +
        `This is not supported and may lead to unexpected behaviors.`,
    );
  }

  const startInDisplayTz = adapter.setTimezone(model.start, displayTimezone);
  const endInDisplayTz = adapter.setTimezone(model.end, displayTimezone);

  const exDatesInDisplayTz: TemporalSupportedObject[] | undefined = model.exDates
    ? model.exDates.map((exDate) => adapter.setTimezone(exDate, displayTimezone))
    : undefined;

  return {
    id: model.id,
    title: model.title,
    description: model.description,
    dataTimezone: {
      start: model.start,
      end: model.end,
      timezone: startTimezone,
      rrule:
        typeof model.rrule === 'string'
          ? parseRRuleString(adapter, model.rrule, startTimezone)
          : model.rrule,
      exDates: model.exDates,
    },
    displayTimezone: {
      start: processDate(startInDisplayTz, adapter),
      end: processDate(endInDisplayTz, adapter),
      timezone: displayTimezone,
      rrule: model.rrule ? parseRRuleString(adapter, model.rrule, displayTimezone) : undefined,
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
