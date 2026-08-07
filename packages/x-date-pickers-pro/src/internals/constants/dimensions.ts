import {
  DAY_MARGIN,
  DAY_MARGIN_COMPACT,
  VIEW_HEIGHT,
  VIEW_HEIGHT_COMPACT,
} from '@mui/x-date-pickers/internals';

export {
  DAY_MARGIN,
  DAY_MARGIN_COMPACT,
  DAY_SIZE as DAY_RANGE_SIZE,
  DAY_SIZE_COMPACT as DAY_RANGE_SIZE_COMPACT,
} from '@mui/x-date-pickers/internals';

// adding the extra height of the range day element height difference (40px vs 36px)
export const RANGE_VIEW_HEIGHT = VIEW_HEIGHT + 6 * 2 * DAY_MARGIN;
export const RANGE_VIEW_HEIGHT_COMPACT = VIEW_HEIGHT_COMPACT + 6 * 2 * DAY_MARGIN_COMPACT;
