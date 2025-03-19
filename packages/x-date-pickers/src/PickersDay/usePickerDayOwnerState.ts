import * as React from 'react';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { PickerDayOwnerState } from './PickersDay.types';
import { PickerValidDate } from '../models/pickers';
import { useUtils } from '../internals/hooks/useUtils';

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
  const utils = useUtils();
  const { ownerState: pickerOwnerState } = usePickerPrivateContext();

  return React.useMemo<PickerDayOwnerState>(
    () => ({
      ...pickerOwnerState,
      day,
      isDaySelected: selected ?? false,
      isDayDisabled: disabled ?? false,
      isDayCurrent: today ?? false,
      isDayOutsideMonth: outsideCurrentMonth ?? false,
      isDayStartOfWeek: utils.isSameDay(day, utils.startOfWeek(day)),
      isDayEndOfWeek: utils.isSameDay(day, utils.endOfWeek(day)),
      disableMargin: disableMargin ?? false,
      disableHighlightToday: disableHighlightToday ?? false,
      showDaysOutsideCurrentMonth: showDaysOutsideCurrentMonth ?? false,
    }),
    [
      utils,
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
