import { warnOnce } from '@mui/x-internals/warning';
import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerEvent, SchedulerProcessedEvent } from '../models';
import { createProcessedDate } from '../process-date/processDate';
import { normalizeAllDayBounds } from '../internals/utils/plain-date-utils/date';
import { toPlainDateTime } from '../internals/utils/plain-date-utils/timeZone';
import type { SchedulerRecurringEventsPluginInterface } from '../internals/plugins/SchedulerRecurringEventsPlugin.types';
import { resolveEventTimestamp } from './resolveEventTimestamp';

export function processEvent(
  model: SchedulerEvent,
  displayTimezone: TemporalTimezone,
  recurringEventsPlugin: SchedulerRecurringEventsPluginInterface | null = null,
): SchedulerProcessedEvent {
  const dataTimezone = model.timezone ?? 'default';

  const dataStart = resolveEventTimestamp(model.start, dataTimezone, model.id);
  const dataEnd = resolveEventTimestamp(model.end, dataTimezone, model.id);
  const exDates = model.exDates?.map((exDate) =>
    toPlainDateTime(resolveEventTimestamp(exDate, dataTimezone, model.id), dataTimezone),
  );

  const displayBounds = normalizeAllDayBounds(dataStart, dataEnd, model.allDay, displayTimezone);

  if (recurringEventsPlugin == null && model.rrule != null) {
    if (process.env.NODE_ENV !== 'production') {
      warnOnce(
        [
          'MUI X Scheduler: Recurring events are not enabled. The `rrule` property will be ignored.',
          'Recurring events are a Premium feature: pass `features={{ recurringEvents: recurringEventsFeature }}`, with `recurringEventsFeature` imported from `@mui/x-scheduler-premium/recurring-events`, to <EventCalendarPremium />, to a premium standalone view or to <EventTimelinePremium />.',
          'See https://mui.com/x/react-scheduler/recurring-events/ for more details.',
        ].join('\n'),
      );
    }
  }

  const parsedDataRRule =
    recurringEventsPlugin && model.rrule
      ? recurringEventsPlugin.parseRRule(model.rrule, dataTimezone)
      : undefined;

  return {
    id: model.id,
    title: model.title,
    description: model.description,
    start: createProcessedDate(displayBounds.start, displayTimezone),
    end: createProcessedDate(displayBounds.end, displayTimezone),
    timezone: dataTimezone,
    rrule: parsedDataRRule,
    exDates,
    resource: model.resource,
    allDay: model.allDay ?? false,
    readOnly: model.readOnly ?? false,
    extractedFromId: model.extractedFromId,
    modelInBuiltInFormat: model,
    color: model.color,
    draggable: model.draggable,
    resizable: model.resizable,
    className: model.className,
    unstable_internalInfos: { displayTimezone, dataStart, dataEnd },
  };
}
