import type {
  SchedulerDependencyLagUnit,
  SchedulerDependencyType,
  SchedulerResolvedDependencyLag,
  SchedulerUpdateDependencyResult,
} from '@mui/x-scheduler-internals-premium/models';
import { getDependencyLagIssue } from '@mui/x-scheduler-internals-premium/internals';

// TODO(dependencies public flip, #23420): move to localeText.
export const DEPENDENCY_DIALOG_TEXT = {
  editTitle: 'Edit dependency',
  detailsTitle: 'Dependency details',
  sourceLabel: 'From',
  targetLabel: 'To',
  typeLabel: 'Type',
  lagLabel: 'Lag',
  lagUnitLabel: 'Lag unit',
  noLag: 'None',
  invalidLag: 'Enter a whole number, 0 or more.',
  allDayLagIgnored: 'An all-day event can only wait whole days, so this lag adds no wait.',
  allDayLagRounded: (lag: string) => `An all-day event can only wait whole days: ${lag}.`,
  delete: 'Delete',
};

// TODO(dependencies public flip, #23420): move to localeText.
export const DEPENDENCY_LAG_UNIT_LABELS: Record<SchedulerDependencyLagUnit, string> = {
  minute: 'minutes',
  hour: 'hours',
  day: 'days',
  week: 'weeks',
};

export const DEPENDENCY_LAG_UNITS = Object.keys(
  DEPENDENCY_LAG_UNIT_LABELS,
) as SchedulerDependencyLagUnit[];

// TODO(dependencies public flip, #23420): move to localeText.
export const DEPENDENCY_TYPE_LABELS: Record<SchedulerDependencyType, string> = {
  FinishToStart: 'Finish to start',
  StartToStart: 'Start to start',
  FinishToFinish: 'Finish to finish',
  StartToFinish: 'Start to finish',
};

export const DEPENDENCY_TYPES = Object.keys(DEPENDENCY_TYPE_LABELS) as SchedulerDependencyType[];

// TODO(dependencies public flip, #23420): move to localeText.
export const UPDATE_REJECTION_MESSAGES: Record<
  Extract<SchedulerUpdateDependencyResult, { status: 'rejected' }>['reason'],
  string
> = {
  cascadeBlocked: 'This change would move a read-only event, so it was not applied.',
  duplicateDependency: 'A dependency of this type already exists between these two events.',
  readOnly: 'Dependencies cannot be changed while the scheduler is read-only.',
  unknownDependency: 'This dependency no longer exists.',
};

// TODO(dependencies public flip, #23420): move to localeText.
export function formatLag(lag: SchedulerResolvedDependencyLag) {
  return `${lag.amount} ${lag.unit}${lag.amount === 1 ? '' : 's'}`;
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

// Module level so its identity is stable: a new validator restarts a pending validation.
export function validateLagAmount(lagAmount: string, values: DependencyFormValues) {
  return getDependencyLagIssue(toLagDraft(lagAmount, values.lagUnit)) === null
    ? null
    : DEPENDENCY_DIALOG_TEXT.invalidLag;
}

export function isSameLag(
  a: SchedulerResolvedDependencyLag | null,
  b: SchedulerResolvedDependencyLag | null,
) {
  return a?.amount === b?.amount && a?.unit === b?.unit;
}
