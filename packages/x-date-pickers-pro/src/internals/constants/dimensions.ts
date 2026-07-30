import { DAY_MARGIN, VIEW_HEIGHT } from '@mui/x-date-pickers/internals';

export {
  DAY_MARGIN,
  DAY_SIZE as DAY_RANGE_SIZE,
  DAY_SIZE_VAR,
  DAY_MARGIN_VAR,
  DAY_TRACK_SIZE_VAR,
  WEEKS_CONTAINER_HEIGHT_VAR,
} from '@mui/x-date-pickers/internals';

// adding the extra height of the range day element height difference (40px vs 36px)
export const RANGE_VIEW_HEIGHT = VIEW_HEIGHT + 6 * 2 * DAY_MARGIN;
