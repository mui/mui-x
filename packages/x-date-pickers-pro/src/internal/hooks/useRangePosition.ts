import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import useEventCallback from '@mui/utils/useEventCallback';
import { FieldRef } from '@mui/x-date-pickers';
import { RangePosition } from '../models/range';
import { RangeFieldSection } from '../models/fields';

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
  onRangePositionChange: (newPosition: RangePosition) => void;
  singleInputFieldRef: React.MutableRefObject<FieldRef<RangeFieldSection> | undefined>;
}

export const useRangePosition = (props: UseRangePositionProps): UseRangePositionResponse => {
  const singleInputFieldRef = React.useRef<FieldRef<RangeFieldSection>>();

  const [rangePosition, setRangePosition] = useControlled({
    name: 'useRangePosition',
    state: 'rangePosition',
    controlled: props.rangePosition,
    default: props.defaultRangePosition ?? 'start',
  });

  const syncRangePositionWithField = (newRangePosition: 'start' | 'end') => {
    if (singleInputFieldRef.current == null) {
      return;
    }

    const sections = singleInputFieldRef.current.getSections();
    const activeSectionIndex = singleInputFieldRef.current?.getActiveSectionIndex();
    const domRangePosition =
      activeSectionIndex == null || activeSectionIndex < sections.length / 2 ? 'start' : 'end';

    if (domRangePosition !== newRangePosition) {
      const targetActiveSectionIndex = newRangePosition === 'start' ? 0 : sections.length / 2;
      singleInputFieldRef.current.setSelectedSections(targetActiveSectionIndex);
    }
  };

  const handleRangePositionChange = useEventCallback((newRangePosition: RangePosition) => {
    setRangePosition(newRangePosition);
    props.onRangePositionChange?.(newRangePosition);
    syncRangePositionWithField(newRangePosition);
  });

  return { rangePosition, onRangePositionChange: handleRangePositionChange, singleInputFieldRef };
};
