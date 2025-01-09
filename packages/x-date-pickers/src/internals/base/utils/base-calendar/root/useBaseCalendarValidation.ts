import * as React from 'react';
import { PickersTimezone, PickerValidDate } from '../../../../../models';
import { useLocalizationContext } from '../../../../hooks/useUtils';
import { useValidation, validateDate, ValidateDateProps } from '../../../../../validation';

export function useBaseCalendarValidation(parameters: useBaseCalendarValidation.Parameters) {
  const { timezone, validationProps } = parameters;
  const adapter = useLocalizationContext();

  return React.useCallback(
    (day: PickerValidDate | null) =>
      validateDate({
        adapter,
        value: day,
        timezone,
        props: validationProps,
      }) !== null,
    [adapter, validationProps, timezone],
  );
}

export namespace useBaseCalendarValidation {
  export interface Parameters {
    timezone: PickersTimezone;
    validationProps: any;
  }
}
