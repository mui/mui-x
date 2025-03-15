import useControlled from '@mui/utils/useControlled';
import useEventCallback from '@mui/utils/useEventCallback';
import { RangePosition } from '../../models';

export interface UseRangePositionProps {
  /**
   * The position in the currently edited date range.
   * Used when the component position is controlled.
   */
  rangePosition?: RangePosition;
  /**
   * The initial position in the edited date range.
   * Used when the component is not controlled.
   * @default 'start'
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
  setRangePosition: (newPosition: RangePosition) => void;
}

export const useRangePosition = (props: UseRangePositionProps): UseRangePositionResponse => {
  const [rangePosition, setRangePosition] = useControlled({
    name: 'useRangePosition',
    state: 'rangePosition',
    controlled: props.rangePosition,
    default: props.defaultRangePosition ?? 'start',
  });

  const handleRangePositionChange = useEventCallback((newRangePosition: RangePosition) => {
    setRangePosition(newRangePosition);
    props.onRangePositionChange?.(newRangePosition);
  });

  return { rangePosition, setRangePosition: handleRangePositionChange };
};
