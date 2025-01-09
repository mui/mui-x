import * as React from 'react';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { ValidateDateProps } from '@mui/x-date-pickers/validation';
import { PickerRangeValue, RangePosition, useUtils } from '@mui/x-date-pickers/internals';
// eslint-disable-next-line no-restricted-imports
import {
  useAddDefaultsToBaseDateValidationProps,
  useBaseCalendarRoot,
} from '@mui/x-date-pickers/internals/base/utils/base-calendar/root/useBaseCalendarRoot';
// eslint-disable-next-line no-restricted-imports
import { mergeReactProps } from '@mui/x-date-pickers/internals/base/base-utils/mergeReactProps';
// eslint-disable-next-line no-restricted-imports
import { GenericHTMLProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
import { DateRangeValidationError } from '../../../../models';
import { useDateRangeManager } from '../../../../managers';
import {
  ValidateDateRangeProps,
  ExportedValidateDateRangeProps,
} from '../../../../validation/validateDateRange';
import { calculateRangeChange } from '../../../utils/date-range-manager';
import { isRangeValid } from '../../../utils/date-utils';
import { useRangePosition, UseRangePositionProps } from '../../../hooks/useRangePosition';
import { RangeCalendarRootContext } from './RangeCalendarRootContext';

export function useRangeCalendarRoot(parameters: useRangeCalendarRoot.Parameters) {
  const {
    // Validation props
    minDate,
    maxDate,
    disablePast,
    disableFuture,
    shouldDisableDate,
    // Range position props
    rangePosition: rangePositionProp,
    defaultRangePosition: defaultRangePositionProp,
    onRangePositionChange: onRangePositionChangeProp,
    // Parameters forwarded to `useBaseCalendarRoot`
    ...baseParameters
  } = parameters;
  const utils = useUtils();
  const manager = useDateRangeManager();

  const availableRangePositions: RangePosition[] = ['start', 'end'];

  // TODO: Add support for range position from the context when implementing the Picker Base UI X component.
  const { rangePosition, onRangePositionChange } = useRangePosition({
    rangePosition: rangePositionProp,
    defaultRangePosition: defaultRangePositionProp,
    onRangePositionChange: onRangePositionChangeProp,
  });

  const baseDateValidationProps = useAddDefaultsToBaseDateValidationProps({
    minDate,
    maxDate,
    disablePast,
    disableFuture,
  });

  const valueValidationProps = React.useMemo<ValidateDateRangeProps>(
    () => ({
      ...baseDateValidationProps,
      shouldDisableDate,
    }),
    [baseDateValidationProps, shouldDisableDate],
  );

  const shouldDisableDateForSingleDateValidation = React.useMemo(() => {
    if (!shouldDisableDate) {
      return undefined;
    }

    return (dayToTest: PickerValidDate) =>
      // TODO: Add correct range position.
      shouldDisableDate(dayToTest, rangePosition /* draggingDatePosition || rangePosition */);
  }, [shouldDisableDate, rangePosition]);

  const dateValidationProps = React.useMemo<ValidateDateProps>(
    () => ({
      ...baseDateValidationProps,
      shouldDisableDate: shouldDisableDateForSingleDateValidation,
    }),
    [baseDateValidationProps, shouldDisableDateForSingleDateValidation],
  );

  const getNewValueFromNewSelectedDate = ({
    prevValue,
    selectedDate,
    referenceDate,
    allowRangeFlip,
  }: useBaseCalendarRoot.GetNewValueFromNewSelectedDateParameters<PickerRangeValue> & {
    allowRangeFlip?: boolean;
  }): useBaseCalendarRoot.GetNewValueFromNewSelectedDateReturnValue<PickerRangeValue> => {
    const { nextSelection, newRange } = calculateRangeChange({
      newDate: selectedDate,
      utils,
      range: prevValue,
      rangePosition,
      allowRangeFlip,
      shouldMergeDateAndTime: true,
      referenceDate,
    });

    const isNextSectionAvailable = availableRangePositions.includes(nextSelection);
    if (isNextSectionAvailable) {
      onRangePositionChange(nextSelection);
    }

    const isFullRangeSelected = rangePosition === 'end' && isRangeValid(utils, newRange);

    return {
      value: newRange,
      changeImportance: isFullRangeSelected || !isNextSectionAvailable ? 'set' : 'accept',
    };
  };

  const {
    value,
    setVisibleDate,
    isDateCellVisible,
    context: baseContext,
  } = useBaseCalendarRoot({
    ...baseParameters,
    manager,
    valueValidationProps,
    dateValidationProps,
    getDateToUseForReferenceDate: (initialValue) => initialValue[0] ?? initialValue[1],
    getCurrentDateFromValue: (currentValue) =>
      rangePosition === 'start' ? currentValue[0] : currentValue[1],
    getNewValueFromNewSelectedDate,
    getSelectedDatesFromValue,
  });

  // TODO: Apply some logic based on the range position.
  const [prevValue, setPrevValue] = React.useState<PickerRangeValue>(value);
  if (value !== prevValue) {
    setPrevValue(value);
    let targetDate: PickerValidDate | null = null;
    if (utils.isValid(value[0])) {
      targetDate = value[0];
    } else if (utils.isValid(value[1])) {
      targetDate = value[1];
    }
    if (targetDate != null && isDateCellVisible(targetDate)) {
      setVisibleDate(targetDate);
    }
  }

  const context: RangeCalendarRootContext = React.useMemo(
    () => ({
      value,
    }),
    [value],
  );

  const getRootProps = React.useCallback((externalProps: GenericHTMLProps) => {
    return mergeReactProps(externalProps, {});
  }, []);

  return React.useMemo(
    () => ({ getRootProps, context, baseContext }),
    [getRootProps, context, baseContext],
  );
}

export namespace useRangeCalendarRoot {
  export interface Parameters
    extends useBaseCalendarRoot.PublicParameters<PickerRangeValue, DateRangeValidationError>,
      ExportedValidateDateRangeProps,
      UseRangePositionProps {}
}

function getSelectedDatesFromValue(value: PickerRangeValue): PickerValidDate[] {
  return value.filter((date) => date != null);
}
