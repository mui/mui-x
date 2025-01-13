import * as React from 'react';
import { DateValidationError } from '../../../../models';
import { useDateManager } from '../../../../managers';
import { ExportedValidateDateProps, ValidateDateProps } from '../../../../validation/validateDate';
import { useUtils } from '../../../hooks/useUtils';
import { PickerValue } from '../../../models';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { GenericHTMLProps } from '../../base-utils/types';
import {
  useAddDefaultsToBaseDateValidationProps,
  useBaseCalendarRoot,
} from '../../utils/base-calendar/root/useBaseCalendarRoot';

const calendarValueManager: useBaseCalendarRoot.ValueManager<PickerValue> = {
  getDateToUseForReferenceDate: (value) => value,
  getNewValueFromNewSelectedDate: ({ selectedDate }) => ({
    value: selectedDate,
    changeImportance: 'accept',
  }),
  getCurrentDateFromValue: (value) => value,
  getSelectedDatesFromValue: (value) => (value == null ? [] : [value]),
};

export function useCalendarRoot(parameters: useCalendarRoot.Parameters) {
  const {
    // Validation props
    minDate,
    maxDate,
    disablePast,
    disableFuture,
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    // Parameters forwarded to `useBaseCalendarRoot`
    ...baseParameters
  } = parameters;
  const utils = useUtils();
  const manager = useDateManager();

  const baseDateValidationProps = useAddDefaultsToBaseDateValidationProps({
    minDate,
    maxDate,
    disablePast,
    disableFuture,
  });

  const validationProps = React.useMemo<ValidateDateProps>(
    () => ({
      ...baseDateValidationProps,
      shouldDisableDate,
      shouldDisableMonth,
      shouldDisableYear,
    }),
    [baseDateValidationProps, shouldDisableDate, shouldDisableMonth, shouldDisableYear],
  );

  const {
    value,
    setVisibleDate,
    isDateCellVisible,
    context: baseContext,
  } = useBaseCalendarRoot({
    ...baseParameters,
    manager,
    dateValidationProps: validationProps,
    valueValidationProps: validationProps,
    calendarValueManager,
  });

  const [prevValue, setPrevValue] = React.useState<PickerValue>(value);
  if (value !== prevValue && utils.isValid(value)) {
    setPrevValue(value);
    if (isDateCellVisible(value)) {
      setVisibleDate(value);
    }
  }

  const getRootProps = React.useCallback((externalProps: GenericHTMLProps) => {
    return mergeReactProps(externalProps, {});
  }, []);

  const isEmpty = value == null;

  return React.useMemo(
    () => ({ getRootProps, baseContext, isEmpty }),
    [getRootProps, baseContext, isEmpty],
  );
}

export namespace useCalendarRoot {
  export interface Parameters
    extends useBaseCalendarRoot.PublicParameters<PickerValue, DateValidationError>,
      ExportedValidateDateProps {}
}
