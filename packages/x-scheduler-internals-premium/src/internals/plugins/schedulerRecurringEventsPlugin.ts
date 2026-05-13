import type { SchedulerRecurringEventsPluginInterface } from '@mui/x-scheduler-internals/internals';
import { parseRRule, serializeRRule, isSameRRule } from '../utils/recurring-events/rRuleString';
import { projectRRuleToTimezone } from '../utils/recurring-events/projectRRuleToTimezone';
import { getRecurringEventOccurrencesForVisibleDays } from '../utils/recurring-events/getRecurringEventOccurrencesForVisibleDays';
import { updateRecurringEvent } from '../utils/recurring-events/updateRecurringEvent';
import { createEventFromRecurringEvent } from '../utils/recurring-events/createEventFromRecurringEvent';
import { applyDataTimezoneToEventUpdate } from '../utils/recurring-events/applyDataTimezoneToEventUpdate';
import {
  computePresets,
  getDefaultPresetKey,
  getWeeklyDays,
  getMonthlyReference,
} from '../utils/recurring-events/presets';

/**
 * Premium implementation of the recurring-events plugin.
 *
 * Stateless singleton that gathers the RRULE / occurrence / scope-update
 * helpers under a single object so the community scheduler can delegate
 * through `state.recurringEventsPlugin` without depending on the premium
 * implementation directly.
 *
 * The companion `SchedulerLazyLoadingPlugin` is a class because it owns a
 * cache, a data manager, and store subscriptions per instance. This plugin
 * has no per-instance state — a plain object literal makes that explicit.
 */
export const schedulerRecurringEventsPlugin: SchedulerRecurringEventsPluginInterface = {
  parseRRule,
  serializeRRule,
  projectRRuleToTimezone,
  getOccurrencesForVisibleDays: getRecurringEventOccurrencesForVisibleDays,
  updateRecurringEvent,
  createEventFromRecurringEvent,
  applyDataTimezoneToEventUpdate,
  computePresets,
  getDefaultPresetKey,
  isSameRRule,
  getWeeklyDays,
  getMonthlyReference,
};
