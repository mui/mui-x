'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { PickerManager, TimeValidationError } from '../models';
import { validateTime } from '../validation';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { MuiPickersAdapterContextValue } from '../LocalizationProvider/LocalizationProvider';
import { AmPmProps } from '../internals/models/props/time';
import {
  ExportedValidateTimeProps,
  ValidateTimeProps,
  ValidateTimePropsToDefault,
} from '../validation/validateTime';
import { PickerValue } from '../internals/models';

export function useTimeManager<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  parameters: UseTimeManagerParameters<TEnableAccessibleFieldDOMStructure> = {},
): UseTimeManagerReturnValue<TEnableAccessibleFieldDOMStructure> {
  const { enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure } =
    parameters;

  return React.useMemo(
    () => ({
      valueType: 'time',
      validator: validateTime,
      internal_valueManager: singleItemValueManager,
      internal_fieldValueManager: singleItemFieldValueManager,
      internal_enableAccessibleFieldDOMStructure: enableAccessibleFieldDOMStructure,
      internal_applyDefaultsToFieldInternalProps: ({ internalProps, utils }) => ({
        ...internalProps,
        ...getTimeFieldInternalPropsDefaults({ utils, internalProps }),
      }),
    }),
    [enableAccessibleFieldDOMStructure],
  );
}

/**
 * Private utility function to get the default internal props for the fields with time editing.
 * Is used by the `useTimeManager` and `useTimeRangeManager` hooks.
 */
export function getTimeFieldInternalPropsDefaults(
  parameters: GetTimeFieldInternalPropsDefaultsParameters,
): GetTimeFieldInternalPropsDefaultsReturnValue {
  const { utils, internalProps } = parameters;
  const ampm = internalProps.ampm ?? utils.is12HourCycleInCurrentLocale();
  const defaultFormat = ampm ? utils.formats.fullTime12h : utils.formats.fullTime24h;

  return {
    disablePast: internalProps.disablePast ?? false,
    disableFuture: internalProps.disableFuture ?? false,
    format: internalProps.format ?? defaultFormat,
  };
}

export interface UseTimeManagerParameters<TEnableAccessibleFieldDOMStructure extends boolean> {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}

export type UseTimeManagerReturnValue<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerManager<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    TimeValidationError,
    TimeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    TimeManagerFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>
  >;

interface TimeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<PickerValue, TEnableAccessibleFieldDOMStructure, TimeValidationError>,
      'format'
    >,
    ExportedValidateTimeProps,
    AmPmProps {}

interface TimeManagerFieldInternalPropsWithDefaults<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseFieldInternalProps<
      PickerValue,
      TEnableAccessibleFieldDOMStructure,
      TimeValidationError
    >,
    ValidateTimeProps {}

type TimeManagerFieldPropsToDefault = 'format' | ValidateTimePropsToDefault;

interface GetTimeFieldInternalPropsDefaultsParameters
  extends Pick<MuiPickersAdapterContextValue, 'utils'> {
  internalProps: Pick<TimeManagerFieldInternalProps<true>, TimeManagerFieldPropsToDefault | 'ampm'>;
}

interface GetTimeFieldInternalPropsDefaultsReturnValue
  extends Pick<TimeManagerFieldInternalPropsWithDefaults<true>, TimeManagerFieldPropsToDefault> {}
