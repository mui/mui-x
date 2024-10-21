import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import useEventCallback from '@mui/utils/useEventCallback';
import { FieldRef } from '@mui/x-date-pickers/models';
import { RangePosition, RangeFieldSection } from '../../models';

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
}

export const useRangePosition = (
  props: UseRangePositionProps,
  singleInputFieldRef?: React.RefObject<FieldRef<RangeFieldSection>>,
): UseRangePositionResponse => {
  const [rangePosition, setRangePosition] = useControlled({
    name: 'useRangePosition',
    state: 'rangePosition',
    controlled: props.rangePosition,
    default: props.defaultRangePosition ?? 'start',
  });

  // When using a single input field,
  // we want to select the 1st section of the edited date when updating the range position.
  const syncRangePositionWithSingleInputField = (newRangePosition: RangePosition) => {
    if (singleInputFieldRef?.current == null) {
      return;
    }

    const sections = singleInputFieldRef.current.getSections();
    const targetActiveSectionIndex = newRangePosition === 'start' ? 0 : sections.length / 2;
    singleInputFieldRef.current.setSelectedSections(targetActiveSectionIndex);
  };

  const handleRangePositionChange = useEventCallback((newRangePosition: RangePosition) => {
    setRangePosition(newRangePosition);
    props.onRangePositionChange?.(newRangePosition);
    syncRangePositionWithSingleInputField(newRangePosition);
  });

  return { rangePosition, onRangePositionChange: handleRangePositionChange };
};
