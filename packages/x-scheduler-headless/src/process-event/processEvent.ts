import { SchedulerEvent, SchedulerProcessedEvent } from '../models';
import { processDate } from '../process-date';
import { Adapter } from '../use-adapter';
import { parseRRuleString } from '../utils/recurring-event-utils';

export function processEvent(model: SchedulerEvent, adapter: Adapter): SchedulerProcessedEvent {
  return {
    id: model.id,
    title: model.title,
    description: model.description,
    start: processDate(model.start, adapter),
    end: processDate(model.end, adapter),
    resource: model.resource,
    rrule: model.rrule ? parseRRuleString(adapter, model.rrule) : undefined,
    exDates: model.exDates,
    allDay: model.allDay ?? false,
    readOnly: model.readOnly ?? false,
    extractedFromId: model.extractedFromId,
    modelInBuiltInFormat: model,
    color: model.color,
  };
}
