import type {
  SchedulerDependencyLagUnit,
  SchedulerDependencyType,
  SchedulerResolvedDependencyLag,
  SchedulerUpdateDependencyResult,
} from '@mui/x-scheduler-internals-premium/models';
import { getDependencyLagIssue } from '@mui/x-scheduler-internals-premium/internals';
import type { EventTimelineLocaleText } from '@mui/x-scheduler/models';

export const DEPENDENCY_LAG_UNITS: SchedulerDependencyLagUnit[] = ['minute', 'hour', 'day', 'week'];

export const DEPENDENCY_TYPES: SchedulerDependencyType[] = [
  'FinishToStart',
  'StartToStart',
  'FinishToFinish',
  'StartToFinish',
];

export function getDependencyLagUnitLabel(
  localeText: EventTimelineLocaleText,
  unit: SchedulerDependencyLagUnit,
) {
  switch (unit) {
    case 'minute':
      return localeText.dependencyLagUnitMinutes;
    case 'hour':
      return localeText.dependencyLagUnitHours;
    case 'day':
      return localeText.dependencyLagUnitDays;
    default:
      return localeText.dependencyLagUnitWeeks;
  }
}

export function getDependencyTypeLabel(
  localeText: EventTimelineLocaleText,
  type: SchedulerDependencyType,
) {
  switch (type) {
    case 'FinishToStart':
      return localeText.dependencyTypeFinishToStart;
    case 'StartToStart':
      return localeText.dependencyTypeStartToStart;
    case 'FinishToFinish':
      return localeText.dependencyTypeFinishToFinish;
    default:
      return localeText.dependencyTypeStartToFinish;
  }
}

/**
 * The message of a rejected dependency update.
 * `featureDisabled` can't happen here: the dialog only exists when the dependencies feature is provided.
 */
export function getDependencyUpdateRejectionMessage(
  localeText: EventTimelineLocaleText,
  reason: Exclude<
    Extract<SchedulerUpdateDependencyResult, { status: 'rejected' }>['reason'],
    'featureDisabled'
  >,
) {
  switch (reason) {
    case 'cascadeBlocked':
      return localeText.dependencyUpdateCascadeBlockedError;
    case 'duplicateDependency':
      return localeText.dependencyDuplicateError;
    case 'readOnly':
      return localeText.dependencyReadOnlyError;
    default:
      return localeText.dependencyNotFoundError;
  }
}

export function formatLag(
  localeText: EventTimelineLocaleText,
  lag: SchedulerResolvedDependencyLag,
) {
  return localeText.dependencyLag(lag.amount, lag.unit);
}

export interface DependencyFormValues extends Record<string, unknown> {
  type: SchedulerDependencyType;
  // Kept as typed, so the field can be emptied.
  lagAmount: string;
  lagUnit: SchedulerDependencyLagUnit;
}

export function toLagDraft(lagAmount: string, lagUnit: SchedulerDependencyLagUnit) {
  const amount = lagAmount.trim();
  // Digits only: `Number()` also reads `1e20` or `0x10` as whole numbers.
  return { lag: /^\d*$/.test(amount) ? Number(amount) : NaN, lagUnit };
}

export function isValidLagAmount(lagAmount: string, lagUnit: SchedulerDependencyLagUnit) {
  return getDependencyLagIssue(toLagDraft(lagAmount, lagUnit)) === null;
}

export function isSameLag(
  a: SchedulerResolvedDependencyLag | null,
  b: SchedulerResolvedDependencyLag | null,
) {
  return a?.amount === b?.amount && a?.unit === b?.unit;
}

/**
 * How an all-day successor rounds `lag` to whole days, or `null` when it applies as is.
 */
export function getAllDayLagNote(
  localeText: EventTimelineLocaleText,
  lag: SchedulerResolvedDependencyLag | null,
  effectiveLag: SchedulerResolvedDependencyLag | null,
) {
  if (isSameLag(effectiveLag, lag)) {
    return null;
  }
  return effectiveLag === null
    ? localeText.dependencyAllDayLagIgnored
    : localeText.dependencyAllDayLagRounded(formatLag(localeText, effectiveLag));
}
