import * as React from 'react';
import { PickerRangePositionContext } from '../../hooks/usePickerRangePositionContext';

/**
 * Returns information about the range position of the picker that wraps the current component.
 * If no picker wraps the current component, returns `null`.
 */
export function useNullablePickerRangePositionContext() {
  return React.useContext(PickerRangePositionContext);
}
