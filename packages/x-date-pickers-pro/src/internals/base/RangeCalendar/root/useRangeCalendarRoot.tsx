import * as React from 'react';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { PickerRangeValue, useUtils } from '@mui/x-date-pickers/internals';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarRoot } from '@mui/x-date-pickers/internals/base/utils/base-calendar/root/useBaseCalendarRoot';
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
import { RangeCalendarRootContext } from './RangeCalendarRootContext';

export function useRangeCalendarRoot(parameters: useRangeCalendarRoot.Parameters) {
  const { shouldDisableDate, ...baseParameters } = parameters;
  const utils = useUtils();
  const manager = useDateRangeManager();
  const {
    value,
    setValue,
    referenceValue,
    setVisibleDate,
    isDateCellVisible,
    context: baseContext,
    validationProps: baseValidationProps,
  } = useBaseCalendarRoot({
    ...baseParameters,
    manager,
    getInitialVisibleDate: (referenceValueParam) => referenceValueParam[0],
  });

  const validationProps = React.useMemo<ValidateDateRangeProps>(
    () => ({ ...baseValidationProps, shouldDisableDate }),
    [baseValidationProps, shouldDisableDate],
  );

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
      setValue,
      referenceValue,
      validationProps,
    }),
    [value, setValue, referenceValue, validationProps],
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
    extends Omit<
        useBaseCalendarRoot.Parameters<PickerRangeValue, DateRangeValidationError>,
        'manager' | 'getInitialVisibleDate'
      >,
      ExportedValidateDateRangeProps {}
}
