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
import { MuiPickersAdapterContextValue } from '../LocalizationProvider/LocalizationProvider';
import { AmPmProps } from '../internals/models/props/time';
import {
  ExportedValidateDateTimeProps,
  ValidateDateTimeProps,
  ValidateDateTimePropsToDefault,
} from '../validation/validateDateTime';
import { PickerValue } from '../internals/models';

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
      internal_applyDefaultsToFieldInternalProps: ({ internalProps, utils, defaultDates }) => ({
        ...internalProps,
        ...getDateTimeFieldInternalPropsDefaults({ internalProps, utils, defaultDates }),
      }),
    }),
    [enableAccessibleFieldDOMStructure],
  );
}

/**
 * Private utility function to get the default internal props for the field with date time editing.
 * Is used by the `useDateTimeManager` and `useDateTimeRangeManager` hooks.
 */
export function getDateTimeFieldInternalPropsDefaults(
  parameters: GetDateTimeFieldInternalPropsDefaultsParameters,
): GetDateTimeFieldInternalPropsDefaultsReturnValue {
  const { defaultDates, utils, internalProps } = parameters;
  const ampm = internalProps.ampm ?? utils.is12HourCycleInCurrentLocale();
  const defaultFormat = ampm
    ? utils.formats.keyboardDateTime12h
    : utils.formats.keyboardDateTime24h;

  return {
    disablePast: internalProps.disablePast ?? false,
    disableFuture: internalProps.disableFuture ?? false,
    format: internalProps.format ?? defaultFormat,
    disableIgnoringDatePartForTimeValidation: Boolean(
      internalProps.minDateTime || internalProps.maxDateTime,
    ),
    minDate: applyDefaultDate(
      utils,
      internalProps.minDateTime ?? internalProps.minDate,
      defaultDates.minDate,
    ),
    maxDate: applyDefaultDate(
      utils,
      internalProps.maxDateTime ?? internalProps.maxDate,
      defaultDates.maxDate,
    ),
    minTime: internalProps.minDateTime ?? internalProps.minTime,
    maxTime: internalProps.maxDateTime ?? internalProps.maxTime,
  };
}

export interface UseDateTimeManagerParameters<TEnableAccessibleFieldDOMStructure extends boolean> {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}

export type UseDateTimeManagerReturnValue<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerManager<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    DateTimeValidationError,
    DateTimeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    DateTimeManagerFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>
  >;

interface DateTimeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<
        PickerValue,
        TEnableAccessibleFieldDOMStructure,
        DateTimeValidationError
      >,
      'format'
    >,
    ExportedValidateDateTimeProps,
    AmPmProps {}

interface DateTimeManagerFieldInternalPropsWithDefaults<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseFieldInternalProps<
      PickerValue,
      TEnableAccessibleFieldDOMStructure,
      DateTimeValidationError
    >,
    ValidateDateTimeProps {}

type DateTimeManagerFieldPropsToDefault =
  | 'format'
  // minTime and maxTime can still be undefined after applying defaults.
  | 'minTime'
  | 'maxTime'
  | ValidateDateTimePropsToDefault;

interface GetDateTimeFieldInternalPropsDefaultsParameters
  extends Pick<MuiPickersAdapterContextValue, 'defaultDates' | 'utils'> {
  internalProps: Pick<
    DateTimeManagerFieldInternalProps<true>,
    DateTimeManagerFieldPropsToDefault | 'minDateTime' | 'maxDateTime' | 'ampm'
  >;
}

interface GetDateTimeFieldInternalPropsDefaultsReturnValue
  extends Pick<
    DateTimeManagerFieldInternalPropsWithDefaults<true>,
    DateTimeManagerFieldPropsToDefault | 'disableIgnoringDatePartForTimeValidation'
  > {}
