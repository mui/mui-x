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

export function useDateManager<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  parameters: UseDateManagerParameters<TEnableAccessibleFieldDOMStructure> = {},
): UseDateManagerReturnValue<TEnableAccessibleFieldDOMStructure> {
  const { enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure } =
    parameters;

  return React.useMemo(
    () => ({
      valueType: 'date',
      validator: validateDate,
      internal_valueManager: singleItemValueManager,
      internal_fieldValueManager: singleItemFieldValueManager,
      internal_enableAccessibleFieldDOMStructure: enableAccessibleFieldDOMStructure,
      internal_useApplyDefaultValuesToFieldInternalProps:
        useApplyDefaultValuesToDateFieldInternalProps,
      internal_useOpenPickerButtonAriaLabel: useOpenPickerButtonAriaLabel,
    }),
    [enableAccessibleFieldDOMStructure],
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

function useApplyDefaultValuesToDateFieldInternalProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
>(
  internalProps: DateManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
): PickerManagerFieldInternalPropsWithDefaults<
  UseDateManagerReturnValue<TEnableAccessibleFieldDOMStructure>
> {
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

export interface UseDateManagerParameters<TEnableAccessibleFieldDOMStructure extends boolean> {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}

export type UseDateManagerReturnValue<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerManager<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    DateValidationError,
    ValidateDateProps,
    DateManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>
  >;

export interface DateManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<PickerValue, TEnableAccessibleFieldDOMStructure, DateValidationError>,
      'format'
    >,
    ExportedValidateDateProps {}
