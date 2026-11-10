import { warnOnce } from '@mui/x-internals/warning';
import { AGENDA_VIEW_DAYS_AMOUNT } from '../../constants';

/**
 * Resolves and validates the agenda's `dayCount` (`viewConfig.agenda.dayCount`).
 *
 * It must be a positive whole number or `'month'`. Any other value falls back to the
 * default day count and warns in development.
 */
export function getAgendaDayCount(dayCount: number | 'month' | undefined): number | 'month' {
  if (dayCount === undefined) {
    return AGENDA_VIEW_DAYS_AMOUNT;
  }

  if (dayCount === 'month' || (Number.isInteger(dayCount) && dayCount > 0)) {
    return dayCount;
  }

  if (process.env.NODE_ENV !== 'production') {
    warnOnce(
      [
        `MUI X Scheduler: \`viewConfig.agenda.dayCount\` received an invalid value (${String(dayCount)}).`,
        "`dayCount` must be a positive whole number or 'month'.",
        `Falling back to the default (${AGENDA_VIEW_DAYS_AMOUNT} days).`,
      ].join('\n'),
    );
  }
  return AGENDA_VIEW_DAYS_AMOUNT;
}
