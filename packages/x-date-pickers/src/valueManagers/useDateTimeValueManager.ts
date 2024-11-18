'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { applyDefaultDate } from '../internals/utils/date-utils';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { PickerValueManagerV8, DateTimeValidationError } from '../models';
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

export function useDateTimeValueManager<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  parameters: UseDateTimeValueManagerParameters<TEnableAccessibleFieldDOMStructure> = {},
): DateTimeValueManager<TEnableAccessibleFieldDOMStructure> {
  const { enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure } =
    parameters;

  return React.useMemo(
    () => ({
      legacyValueManager: singleItemValueManager,
      fieldValueManager: singleItemFieldValueManager,
      validator: validateDateTime,
      valueType: 'date-time',
      applyDefaultsToFieldInternalProps: ({ internalProps, utils, defaultDates }) => ({
        ...internalProps,
        ...getDateTimeFieldInternalPropsDefaults({ internalProps, utils, defaultDates }),
      }),
      enableAccessibleFieldDOMStructure,
    }),
    [enableAccessibleFieldDOMStructure],
  );
}

/**
 * Private utility function to get the default internal props for the field with date time editing.
 * Is used by the `useDateTimeValueManager` and `useDateTimeRangeValueManager` hooks.
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

export type DateTimeValueManager<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerValueManagerV8<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    DateTimeValidationError,
    DateTimeFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    DateTimeFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>
  >;

export interface DateTimeFieldInternalProps<TEnableAccessibleFieldDOMStructure extends boolean>
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

export interface DateTimeFieldInternalPropsWithDefaults<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseFieldInternalProps<
      PickerValue,
      TEnableAccessibleFieldDOMStructure,
      DateTimeValidationError
    >,
    ValidateDateTimeProps {}

type DateTimeFieldPropsToDefault =
  | 'format'
  // minTime and maxTime can still be undefined after applying defaults.
  | 'minTime'
  | 'maxTime'
  | ValidateDateTimePropsToDefault;

export interface UseDateTimeValueManagerParameters<
  TEnableAccessibleFieldDOMStructure extends boolean,
> {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}

interface GetDateTimeFieldInternalPropsDefaultsParameters
  extends Pick<MuiPickersAdapterContextValue, 'defaultDates' | 'utils'> {
  internalProps: Pick<
    DateTimeFieldInternalProps<true>,
    DateTimeFieldPropsToDefault | 'minDateTime' | 'maxDateTime' | 'ampm'
  >;
}

interface GetDateTimeFieldInternalPropsDefaultsReturnValue
  extends Pick<
    DateTimeFieldInternalPropsWithDefaults<true>,
    DateTimeFieldPropsToDefault | 'disableIgnoringDatePartForTimeValidation'
  > {}
