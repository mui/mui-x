import useControlled from '@mui/utils/useControlled';
import useEventCallback from '@mui/utils/useEventCallback';
import { RangePosition } from '../models/range';

export interface UseRangePositionProps {
  /**
   * The position in the range being edited.
   * Used when the component position is controlled.
   */
  rangePosition?: RangePosition;
  /**
   * The default position in the range being editing value.
   * Used when the component is not controlled.
   */
  defaultRangePosition?: RangePosition;
  /**
   * Callback fired when the range position changes.
   * @param {RangePosition} rangePosition The new range position.
   */
  onRangePositionChange?: (rangePosition: RangePosition) => void;
}

export interface UseRangePositionResponse {
  rangePosition: RangePosition;
  onRangePositionChange: (newPosition: RangePosition) => void;
}

export const useRangePosition = (props: UseRangePositionProps): UseRangePositionResponse => {
  const [rangePosition, setRangePosition] = useControlled({
    name: 'MonthCalendar',
    state: 'value',
    controlled: props.rangePosition,
    default: props.defaultRangePosition ?? 'start',
  });

  const handleRangePositionChange = useEventCallback((newRangePosition: RangePosition) => {
    setRangePosition(newRangePosition);
    props.onRangePositionChange?.(newRangePosition);
  });

  return { rangePosition, onRangePositionChange: handleRangePositionChange };
};
