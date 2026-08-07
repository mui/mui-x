import {
  DAY_MARGIN,
  DAY_TRACK_SIZE,
  DAY_TRACK_SIZE_VAR,
  DAYS_IN_WEEK,
  MAX_WEEKS_IN_MONTH,
  VIEW_HEIGHT,
} from '@mui/x-date-pickers/internals';

export {
  DAY_MARGIN,
  DAY_SIZE as DAY_RANGE_SIZE,
  CALENDAR_DAY_SIZE_VAR,
  DAY_SIZE_VAR,
  DAY_MARGIN_VAR,
  DAY_TRACK_SIZE_VAR,
  WEEKS_CONTAINER_HEIGHT_VAR,
} from '@mui/x-date-pickers/internals';

// adding the extra height of the range day element height difference (40px vs 36px)
export const RANGE_VIEW_HEIGHT = VIEW_HEIGHT + MAX_WEEKS_IN_MONTH * 2 * DAY_MARGIN;

export const DAY_RANGE_CALENDAR_WIDTH = 312;

export const DAY_RANGE_CALENDAR_HORIZONTAL_PADDING =
  DAY_RANGE_CALENDAR_WIDTH - DAY_TRACK_SIZE * DAYS_IN_WEEK;

export const DAY_RANGE_CALENDAR_WIDTH_VAR = `calc(${DAY_RANGE_CALENDAR_HORIZONTAL_PADDING}px + ${DAY_TRACK_SIZE_VAR} * ${DAYS_IN_WEEK})`;
