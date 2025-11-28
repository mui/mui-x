import { SchedulerEvent, SchedulerProcessedEvent } from '../models';
import { processDate } from '../process-date';
import { Adapter } from '../use-adapter';
import { parseRRuleString } from '../utils/recurring-events';
import { TemporalSupportedObject, TemporalTimezone } from '../base-ui-copy/types';

export function processEvent(
  model: SchedulerEvent,
  uiTimezone: TemporalTimezone,
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

  const startInUITz = adapter.setTimezone(model.start, uiTimezone);
  const endInUITz = adapter.setTimezone(model.end, uiTimezone);

  const processededExDates: TemporalSupportedObject[] | undefined = model.exDates
    ? model.exDates.map((exDate) => adapter.setTimezone(exDate, uiTimezone))
    : undefined;

  return {
    id: model.id,
    title: model.title,
    description: model.description,
    start: processDate(startInUITz, adapter),
    end: processDate(endInUITz, adapter),
    resource: model.resource,
    rrule: model.rrule ? parseRRuleString(adapter, model.rrule, uiTimezone) : undefined,
    exDates: processededExDates,
    allDay: model.allDay ?? false,
    readOnly: model.readOnly ?? false,
    extractedFromId: model.extractedFromId,
    modelInBuiltInFormat: model,
    color: model.color,
    draggable: model.draggable,
    resizable: model.resizable,
  };
}
