import * as React from 'react';
import { DateValidationError, PickerValidDate } from '../../../../models';
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
  onSelectDate: ({ setValue, selectedDate, section }) =>
    setValue(selectedDate, {
      changeImportance: 'accept',
      section,
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
    // Children
    children: childrenProp,
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
    visibleDateContext,
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

  const getRootProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      let children: React.ReactNode;
      if (!React.isValidElement(childrenProp) && typeof childrenProp === 'function') {
        children = childrenProp({ visibleDate: visibleDateContext.visibleDate });
      } else {
        children = childrenProp;
      }
      return mergeReactProps(externalProps, { children });
    },
    [childrenProp, visibleDateContext.visibleDate],
  );

  const isEmpty = value == null;

  return React.useMemo(
    () => ({ getRootProps, baseContext, visibleDateContext, isEmpty }),
    [getRootProps, baseContext, visibleDateContext, isEmpty],
  );
}

export namespace useCalendarRoot {
  export interface Parameters
    extends useBaseCalendarRoot.PublicParameters<PickerValue, DateValidationError>,
      ExportedValidateDateProps {
    /**
     * The children of the calendar.
     * If a function is provided, it will be called with the public context as its parameter.
     */
    children?: React.ReactNode | ((parameters: ChildrenParameters) => React.ReactNode);
  }

  export interface ChildrenParameters {
    visibleDate: PickerValidDate;
  }
}
