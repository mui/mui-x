'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { PickerManager } from '@mui/x-date-pickers/models';
import { usePickerAdapter } from '@mui/x-date-pickers/hooks';
import {
  PickerManagerFieldInternalPropsWithDefaults,
  PickerRangeValue,
  UseFieldInternalProps,
  useApplyDefaultValuesToDateValidationProps,
  createUseOpenPickerButtonAriaLabel,
} from '@mui/x-date-pickers/internals';
import { DateRangeValidationError, RangeFieldSeparatorProps } from '../models';
import { getRangeFieldValueManager, rangeValueManager } from '../internals/utils/valueManagers';
import { validateDateRange } from '../validation';
import {
  ExportedValidateDateRangeProps,
  ValidateDateRangeProps,
} from '../validation/validateDateRange';
import { formatRange } from '../internals/utils/date-utils';

const useOpenPickerButtonAriaLabel = createUseOpenPickerButtonAriaLabel<PickerRangeValue>({
  formatValue: (adapter, value) => formatRange(adapter, value, 'fullDate'),
  translationKey: 'openRangePickerDialogue',
});

export function useDateRangeManager(
  parameters: UseDateRangeManagerParameters = {},
): UseDateRangeManagerReturnValue {
  const { dateSeparator } = parameters;

  return React.useMemo(
    () => ({
      valueType: 'date',
      validator: validateDateRange,
      internal_valueManager: rangeValueManager,
      internal_fieldValueManager: getRangeFieldValueManager({ dateSeparator }),
      internal_useApplyDefaultValuesToFieldInternalProps:
        useApplyDefaultValuesToDateRangeFieldInternalProps,
      internal_useOpenPickerButtonAriaLabel: useOpenPickerButtonAriaLabel,
    }),
    [dateSeparator],
  );
}

function useApplyDefaultValuesToDateRangeFieldInternalProps(
  internalProps: DateRangeManagerFieldInternalProps,
): PickerManagerFieldInternalPropsWithDefaults<UseDateRangeManagerReturnValue> {
  const adapter = usePickerAdapter();
  const validationProps = useApplyDefaultValuesToDateValidationProps(internalProps);

  return React.useMemo(
    () => ({
      ...internalProps,
      ...validationProps,
      format: internalProps.format ?? adapter.formats.keyboardDate,
    }),
    [internalProps, validationProps, adapter],
  );
}

export interface UseDateRangeManagerParameters extends RangeFieldSeparatorProps {}

export type UseDateRangeManagerReturnValue = PickerManager<
  PickerRangeValue,
  DateRangeValidationError,
  ValidateDateRangeProps,
  DateRangeManagerFieldInternalProps
>;

export interface DateRangeManagerFieldInternalProps
  extends
    MakeOptional<UseFieldInternalProps<PickerRangeValue, DateRangeValidationError>, 'format'>,
    RangeFieldSeparatorProps,
    ExportedValidateDateRangeProps {}
