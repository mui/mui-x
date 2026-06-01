import type { SchedulerRecurringEventsPluginInterface } from '@mui/x-scheduler-internals/internals';
import { parseRRule, isSameRRule } from '../utils/recurring-events/rRuleString';
import { projectRRuleToTimezone } from '../utils/recurring-events/projectRRuleToTimezone';
import { getRecurringEventOccurrencesForVisibleDays } from '../utils/recurring-events/getRecurringEventOccurrencesForVisibleDays';
import { updateRecurringEvent } from '../utils/recurring-events/updateRecurringEvent';
import { applyDataTimezoneToEventUpdate } from '../utils/recurring-events/applyDataTimezoneToEventUpdate';
import {
  computePresets,
  getDefaultPresetKey,
  getWeeklyDays,
  getMonthlyReference,
} from '../utils/recurring-events/presets';

export const schedulerRecurringEventsPlugin = {
  parseRRule,
  projectRRuleToTimezone,
  getOccurrencesForVisibleDays: getRecurringEventOccurrencesForVisibleDays,
  updateRecurringEvent,
  applyDataTimezoneToEventUpdate,
  computePresets,
  getDefaultPresetKey,
  isSameRRule,
  getWeeklyDays,
  getMonthlyReference,
} as const satisfies SchedulerRecurringEventsPluginInterface;
