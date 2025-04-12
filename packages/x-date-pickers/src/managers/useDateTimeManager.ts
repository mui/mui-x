'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { applyDefaultDate } from '../internals/utils/date-utils';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { PickerManager, DateTimeValidationError } from '../models';
import { validateDateTime } from '../validation';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { AmPmProps } from '../internals/models/props/time';
import {
  ExportedValidateDateTimeProps,
  ValidateDateTimeProps,
} from '../validation/validateDateTime';
import { PickerManagerFieldInternalPropsWithDefaults, PickerValue } from '../internals/models';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { usePickerTranslations } from '../hooks/usePickerTranslations';

export function useDateTimeManager<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  parameters: UseDateTimeManagerParameters<TEnableAccessibleFieldDOMStructure> = {},
): UseDateTimeManagerReturnValue<TEnableAccessibleFieldDOMStructure> {
  const { enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure } =
    parameters;

  return React.useMemo(
    () => ({
      valueType: 'date-time',
      validator: validateDateTime,
      internal_valueManager: singleItemValueManager,
      internal_fieldValueManager: singleItemFieldValueManager,
      internal_enableAccessibleFieldDOMStructure: enableAccessibleFieldDOMStructure,
      internal_useApplyDefaultValuesToFieldInternalProps:
        useApplyDefaultValuesToDateTimeFieldInternalProps,
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

function useApplyDefaultValuesToDateTimeFieldInternalProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
>(
  internalProps: DateTimeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
): PickerManagerFieldInternalPropsWithDefaults<
  UseDateTimeManagerReturnValue<TEnableAccessibleFieldDOMStructure>
> {
  const utils = useUtils();
  const validationProps = useApplyDefaultValuesToDateTimeValidationProps(internalProps);

  const ampm = React.useMemo(
    () => internalProps.ampm ?? utils.is12HourCycleInCurrentLocale(),
    [internalProps.ampm, utils],
  );

  return React.useMemo(
    () => ({
      ...internalProps,
      ...validationProps,
      format:
        internalProps.format ??
        (ampm ? utils.formats.keyboardDateTime12h : utils.formats.keyboardDateTime24h),
    }),
    [internalProps, validationProps, ampm, utils],
  );
}

type SharedDateTimeAndDateTimeRangeValidationProps =
  | 'disablePast'
  | 'disableFuture'
  | 'minTime'
  | 'maxTime'
  | 'minDate'
  | 'maxDate';

export function useApplyDefaultValuesToDateTimeValidationProps(
  props: Pick<
    ExportedValidateDateTimeProps,
    SharedDateTimeAndDateTimeRangeValidationProps | 'minDateTime' | 'maxDateTime'
  >,
): Pick<ValidateDateTimeProps, SharedDateTimeAndDateTimeRangeValidationProps> {
  const utils = useUtils();
  const defaultDates = useDefaultDates();

  return React.useMemo(
    () => ({
      disablePast: props.disablePast ?? false,
      disableFuture: props.disableFuture ?? false,
      // TODO: Explore if we can remove it from the public API
      disableIgnoringDatePartForTimeValidation:
        !!props.minDateTime || !!props.maxDateTime || !!props.disableFuture || !!props.disablePast,
      minDate: applyDefaultDate(utils, props.minDateTime ?? props.minDate, defaultDates.minDate),
      maxDate: applyDefaultDate(utils, props.maxDateTime ?? props.maxDate, defaultDates.maxDate),
      minTime: props.minDateTime ?? props.minTime,
      maxTime: props.maxDateTime ?? props.maxTime,
    }),
    [
      props.minDateTime,
      props.maxDateTime,
      props.minTime,
      props.maxTime,
      props.minDate,
      props.maxDate,
      props.disableFuture,
      props.disablePast,
      utils,
      defaultDates,
    ],
  );
}

export interface UseDateTimeManagerParameters<TEnableAccessibleFieldDOMStructure extends boolean> {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}

export type UseDateTimeManagerReturnValue<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerManager<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    DateTimeValidationError,
    ValidateDateTimeProps,
    DateTimeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>
  >;

export interface DateTimeManagerFieldInternalProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
      UseFieldInternalProps<
        PickerValue,
        TEnableAccessibleFieldDOMStructure,
        DateTimeValidationError
      >,
      'format'
    >,
    ExportedValidateDateTimeProps,
    AmPmProps {}
