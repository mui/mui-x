import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import type { ChartsZoomSliderThumbOwnerState } from './ChartsAxisZoomSliderThumb';

export interface ChartsAxisZoomSliderThumbClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when it is horizontal. */
  horizontal: string;
  /** Styles applied to the root element when it is vertical. */
  vertical: string;
  /** Styles applied to the root element when it is a start thumb. */
  start: string;
  /** Styles applied to the root element when it is an end thumb. */
  end: string;
}

export type ChartsAxisZoomSliderThumbClassKey = keyof ChartsAxisZoomSliderThumbClasses;

const CORRECT_PREFIX = 'MuiChartsAxisZoomSliderThumb';
// TODO v10: remove `MuiChartAxisZoomSliderThumb`. Kept for backwards compatibility with
// users targeting the historically-incorrect prefix (missing the `s` in `Charts`).
const LEGACY_PREFIX = 'MuiChartAxisZoomSliderThumb';

export const chartsAxisZoomSliderThumbClasses: ChartsAxisZoomSliderThumbClasses =
  generateUtilityClasses(CORRECT_PREFIX, ['root', 'horizontal', 'vertical', 'start', 'end']);

// Returns both the correct and legacy class names so existing CSS targeting the legacy
// prefix continues to work.
export function getAxisZoomSliderThumbUtilityClass(slot: string) {
  return `${generateUtilityClass(CORRECT_PREFIX, slot)} ${generateUtilityClass(LEGACY_PREFIX, slot)}`;
}

export const useUtilityClasses = (ownerState: ChartsZoomSliderThumbOwnerState) => {
  const { orientation, placement } = ownerState;
  const slots = {
    root: [
      'root',
      orientation === 'horizontal' ? 'horizontal' : 'vertical',
      placement === 'start' ? 'start' : 'end',
    ],
  };

  return composeClasses(slots, getAxisZoomSliderThumbUtilityClass);
};
