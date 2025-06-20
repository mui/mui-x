import * as React from 'react';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { PickerDayOwnerState } from './PickersDay.types';
import { PickerValidDate } from '../models/pickers';
import { usePickerAdapter } from '../hooks/usePickerAdapter';

export function usePickerDayOwnerState(parameters: UsePickerDayOwnerStateParameters) {
  const {
    disabled,
    selected,
    today,
    outsideCurrentMonth,
    day,
    disableMargin,
    disableHighlightToday,
    showDaysOutsideCurrentMonth,
  } = parameters;
  const adapter = usePickerAdapter();
  const { ownerState: pickerOwnerState } = usePickerPrivateContext();

  return React.useMemo<PickerDayOwnerState>(
    () => ({
      ...pickerOwnerState,
      day,
      isDaySelected: selected ?? false,
      isDayDisabled: disabled ?? false,
      isDayCurrent: today ?? false,
      isDayOutsideMonth: outsideCurrentMonth ?? false,
      isDayStartOfWeek: adapter.isSameDay(day, adapter.startOfWeek(day)),
      isDayEndOfWeek: adapter.isSameDay(day, adapter.endOfWeek(day)),
      disableMargin: disableMargin ?? false,
      disableHighlightToday: disableHighlightToday ?? false,
      showDaysOutsideCurrentMonth: showDaysOutsideCurrentMonth ?? false,
    }),
    [
      adapter,
      pickerOwnerState,
      day,
      selected,
      disabled,
      today,
      outsideCurrentMonth,
      disableMargin,
      disableHighlightToday,
      showDaysOutsideCurrentMonth,
    ],
  );
}

interface UsePickerDayOwnerStateParameters {
  day: PickerValidDate;
  disabled: boolean | undefined;
  selected: boolean | undefined;
  today: boolean | undefined;
  outsideCurrentMonth: boolean | undefined;
  disableMargin: boolean | undefined;
  disableHighlightToday: boolean | undefined;
  showDaysOutsideCurrentMonth: boolean | undefined;
}
