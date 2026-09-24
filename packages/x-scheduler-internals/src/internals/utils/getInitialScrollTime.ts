import { warn } from '@mui/x-internals/warning';
import type { DisplayedHourRange } from './getDisplayedHourRange';

const DEFAULT_INITIAL_SCROLL_TIME = 7;

/**
 * Resolves the hour a time grid scrolls to on mount. Invalid values warn in development
 * and fall back to the default (7 AM if displayed, otherwise `startTime`).
 */
export function getInitialScrollTime(
  initialScrollTime: number | undefined,
  range: DisplayedHourRange,
  source: string,
): number {
  const { startTime, endTime } = range;

  if (initialScrollTime !== undefined) {
    const isValid =
      Number.isInteger(initialScrollTime) &&
      initialScrollTime >= startTime &&
      initialScrollTime < endTime;

    if (isValid) {
      return initialScrollTime;
    }

    if (process.env.NODE_ENV !== 'production') {
      warn(
        [
          `MUI X Scheduler: \`${source}\` received an invalid \`initialScrollTime\` (${initialScrollTime}).`,
          `\`initialScrollTime\` must be a displayed hour (${startTime} to ${endTime - 1}).`,
          'Falling back to the default (7 AM when it is displayed, otherwise `startTime`).',
        ].join('\n'),
      );
    }
  }

  // 7 AM is not displayed: stay at the top.
  if (DEFAULT_INITIAL_SCROLL_TIME >= endTime) {
    return startTime;
  }
  return Math.max(DEFAULT_INITIAL_SCROLL_TIME, startTime);
}
