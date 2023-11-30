import { DAY_MARGIN, VIEW_HEIGHT } from '@mui/x-date-pickers/internals';

export { DAY_MARGIN } from '@mui/x-date-pickers/internals';

export const DAY_RANGE_SIZE = 40;
// adding the extra height of the range day element height difference (40px vs 36px)
export const RANGE_VIEW_HEIGHT = VIEW_HEIGHT + 6 * 2 * DAY_MARGIN;
