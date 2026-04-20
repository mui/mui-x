'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { PickerManager } from '@mui/x-date-pickers/models';
import { usePickerAdapter, usePickerTranslations } from '@mui/x-date-pickers/hooks';
import {
  PickerManagerFieldInternalPropsWithDefaults,
  PickerRangeValue,
  UseFieldInternalProps,
  useApplyDefaultValuesToDateValidationProps,
} from '@mui/x-date-pickers/internals';
import { DateRangeValidationError, RangeFieldSeparatorProps } from '../models';
import { getRangeFieldValueManager, rangeValueManager } from '../internals/utils/valueManagers';
import { validateDateRange } from '../validation';
import {
  ExportedValidateDateRangeProps,
  ValidateDateRangeProps,
} from '../validation/validateDateRange';
import { formatRange } from '../internals/utils/date-utils';

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

function useOpenPickerButtonAriaLabel(value: PickerRangeValue) {
  const adapter = usePickerAdapter();
  const translations = usePickerTranslations();

  return React.useMemo(() => {
    return translations.openRangePickerDialogue(formatRange(adapter, value, 'fullDate'));
  }, [value, translations, adapter]);
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
