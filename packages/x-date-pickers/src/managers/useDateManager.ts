'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { applyDefaultDate } from '../internals/utils/date-utils';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { PickerManager, DateValidationError } from '../models';
import { validateDate } from '../validation';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { ExportedValidateDateProps, ValidateDateProps } from '../validation/validateDate';
import { PickerManagerFieldInternalPropsWithDefaults, PickerValue } from '../internals/models';
import { useDefaultDates } from '../internals/hooks/useUtils';
import { usePickerAdapter, usePickerTranslations } from '../hooks';

export function useDateManager(
  parameters: UseDateManagerParameters = {},
): UseDateManagerReturnValue {
  return React.useMemo(
    () => ({
      valueType: 'date',
      validator: validateDate,
      internal_valueManager: singleItemValueManager,
      internal_fieldValueManager: singleItemFieldValueManager,
      internal_useApplyDefaultValuesToFieldInternalProps:
        useApplyDefaultValuesToDateFieldInternalProps,
      internal_useOpenPickerButtonAriaLabel: useOpenPickerButtonAriaLabel,
    }),
    [],
  );
}

function useOpenPickerButtonAriaLabel(value: PickerValue) {
  const adapter = usePickerAdapter();
  const translations = usePickerTranslations();

  return React.useMemo(() => {
    const formattedValue = adapter.isValid(value) ? adapter.format(value, 'fullDate') : null;
    return translations.openDatePickerDialogue(formattedValue);
  }, [value, translations, adapter]);
}

function useApplyDefaultValuesToDateFieldInternalProps(
  internalProps: DateManagerFieldInternalProps,
): PickerManagerFieldInternalPropsWithDefaults<UseDateManagerReturnValue> {
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

type SharedDateAndDateRangeValidationProps =
  | 'disablePast'
  | 'disableFuture'
  | 'minDate'
  | 'maxDate';

export function useApplyDefaultValuesToDateValidationProps(
  props: Pick<ExportedValidateDateProps, SharedDateAndDateRangeValidationProps>,
): Pick<ValidateDateProps, SharedDateAndDateRangeValidationProps> {
  const adapter = usePickerAdapter();
  const defaultDates = useDefaultDates();

  return React.useMemo(
    () => ({
      disablePast: props.disablePast ?? false,
      disableFuture: props.disableFuture ?? false,
      minDate: applyDefaultDate(adapter, props.minDate, defaultDates.minDate),
      maxDate: applyDefaultDate(adapter, props.maxDate, defaultDates.maxDate),
    }),
    [props.minDate, props.maxDate, props.disableFuture, props.disablePast, adapter, defaultDates],
  );
}

export interface UseDateManagerParameters {}

export type UseDateManagerReturnValue = PickerManager<
  PickerValue,
  DateValidationError,
  ValidateDateProps,
  DateManagerFieldInternalProps
>;

export interface DateManagerFieldInternalProps
  extends
    MakeOptional<UseFieldInternalProps<PickerValue, DateValidationError>, 'format'>,
    ExportedValidateDateProps {}
