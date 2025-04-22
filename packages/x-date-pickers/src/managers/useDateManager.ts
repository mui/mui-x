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
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { usePickerTranslations } from '../hooks/usePickerTranslations';

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
  const utils = useUtils();
  const translations = usePickerTranslations();

  return React.useMemo(() => {
    const formattedValue = utils.isValid(value) ? utils.format(value, 'fullDate') : null;
    return translations.openDatePickerDialogue(formattedValue);
  }, [value, translations, utils]);
}

function useApplyDefaultValuesToDateFieldInternalProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
>(
  internalProps: DateManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
): PickerManagerFieldInternalPropsWithDefaults<
  UseDateManagerReturnValue<TEnableAccessibleFieldDOMStructure>
> {
  const utils = useUtils();
  const validationProps = useApplyDefaultValuesToDateValidationProps(internalProps);

  return React.useMemo(
    () => ({
      ...internalProps,
      ...validationProps,
      format: internalProps.format ?? utils.formats.keyboardDate,
    }),
    [internalProps, validationProps, utils],
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
  const utils = useUtils();
  const defaultDates = useDefaultDates();

  return React.useMemo(
    () => ({
      disablePast: props.disablePast ?? false,
      disableFuture: props.disableFuture ?? false,
      minDate: applyDefaultDate(utils, props.minDate, defaultDates.minDate),
      maxDate: applyDefaultDate(utils, props.maxDate, defaultDates.maxDate),
    }),
    [props.minDate, props.maxDate, props.disableFuture, props.disablePast, utils, defaultDates],
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
