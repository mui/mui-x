import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { PickerValueManagerV8, TimeValidationError } from '../models';
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

export function useTimeValueManager<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  parameters: UseTimeValueManagerParameters<TEnableAccessibleFieldDOMStructure> = {},
): TimeValueManager<TEnableAccessibleFieldDOMStructure> {
  const { enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure } =
    parameters;

  return React.useMemo(
    () => ({
      legacyValueManager: singleItemValueManager,
      fieldValueManager: singleItemFieldValueManager,
      validator: validateTime,
      valueType: 'time',
      applyDefaultsToFieldInternalProps: ({ internalProps, utils }) => ({
        ...internalProps,
        ...getTimeFieldInternalPropsDefaults({ utils, internalProps }),
      }),
      enableAccessibleFieldDOMStructure,
    }),
    [enableAccessibleFieldDOMStructure],
  );
}

/**
 * Private utility function to get the default internal props for the fields with time editing.
 * Is used by the `useTimeValueManager` and `useTimeRangeValueManager` hooks.
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

export type TimeValueManager<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerValueManagerV8<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    TimeValidationError,
    TimeFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    TimeFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>
  >;

export interface TimeFieldInternalProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<PickerValue, TEnableAccessibleFieldDOMStructure, TimeValidationError>,
      'format'
    >,
    ExportedValidateTimeProps,
    AmPmProps {}

export interface TimeFieldInternalPropsWithDefaults<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseFieldInternalProps<
      PickerValue,
      TEnableAccessibleFieldDOMStructure,
      TimeValidationError
    >,
    ValidateTimeProps {}

type TimeFieldPropsToDefault = 'format' | ValidateTimePropsToDefault;

export interface UseTimeValueManagerParameters<TEnableAccessibleFieldDOMStructure extends boolean> {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}

interface GetTimeFieldInternalPropsDefaultsParameters
  extends Pick<MuiPickersAdapterContextValue, 'utils'> {
  internalProps: Pick<TimeFieldInternalProps<true>, TimeFieldPropsToDefault | 'ampm'>;
}

interface GetTimeFieldInternalPropsDefaultsReturnValue
  extends Pick<TimeFieldInternalPropsWithDefaults<true>, TimeFieldPropsToDefault> {}
