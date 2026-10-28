import type {
  SchedulerDependencyLagUnit,
  SchedulerDependencyType,
  SchedulerResolvedDependencyLag,
  SchedulerUpdateDependencyResult,
} from '@mui/x-scheduler-internals-premium/models';
import { getDependencyLagIssue } from '@mui/x-scheduler-internals-premium/internals';
import type { EventTimelineLocaleText } from '@mui/x-scheduler/models';

// Exhaustive on the unions: a new unit, type or reason fails to compile until it brings a key.
const DEPENDENCY_LAG_UNIT_KEYS = {
  minute: 'dependencyLagUnitMinutes',
  hour: 'dependencyLagUnitHours',
  day: 'dependencyLagUnitDays',
  week: 'dependencyLagUnitWeeks',
} as const satisfies Record<SchedulerDependencyLagUnit, keyof EventTimelineLocaleText>;

const DEPENDENCY_TYPE_KEYS = {
  FinishToStart: 'dependencyTypeFinishToStart',
  StartToStart: 'dependencyTypeStartToStart',
  FinishToFinish: 'dependencyTypeFinishToFinish',
  StartToFinish: 'dependencyTypeStartToFinish',
} as const satisfies Record<SchedulerDependencyType, keyof EventTimelineLocaleText>;

const DEPENDENCY_UPDATE_REJECTION_KEYS = {
  cascadeBlocked: 'dependencyUpdateCascadeBlockedError',
  duplicateDependency: 'dependencyDuplicateError',
  readOnly: 'dependencyReadOnlyError',
  unknownDependency: 'dependencyUpdateNotFoundError',
} as const satisfies Record<
  Exclude<
    Extract<SchedulerUpdateDependencyResult, { status: 'rejected' }>['reason'],
    'featureDisabled'
  >,
  keyof EventTimelineLocaleText
>;

export type DependencyUpdateRejectionReason = keyof typeof DEPENDENCY_UPDATE_REJECTION_KEYS;

export const DEPENDENCY_LAG_UNITS = Object.keys(
  DEPENDENCY_LAG_UNIT_KEYS,
) as SchedulerDependencyLagUnit[];

export const DEPENDENCY_TYPES = Object.keys(DEPENDENCY_TYPE_KEYS) as SchedulerDependencyType[];

export function getDependencyLagUnitLabel(
  localeText: EventTimelineLocaleText,
  unit: SchedulerDependencyLagUnit,
) {
  return localeText[DEPENDENCY_LAG_UNIT_KEYS[unit]];
}

export function getDependencyTypeLabel(
  localeText: EventTimelineLocaleText,
  type: SchedulerDependencyType,
) {
  return localeText[DEPENDENCY_TYPE_KEYS[type]];
}

export function getDependencyUpdateRejectionMessage(
  localeText: EventTimelineLocaleText,
  reason: DependencyUpdateRejectionReason,
) {
  return localeText[DEPENDENCY_UPDATE_REJECTION_KEYS[reason]];
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
