import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { applyDefaultDate } from '../internals/utils/date-utils';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { PickerValueManagerV8, DateValidationError } from '../models';
import { validateDate } from '../validation';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { MuiPickersAdapterContextValue } from '../LocalizationProvider/LocalizationProvider';
import {
  ExportedValidateDateProps,
  ValidateDatePropsToDefault,
  ValidateDateProps,
} from '../validation/validateDate';
import { PickerValue } from '../internals/models';

export function useDateValueManager<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  parameters: UseDateValueManagerParameters<TEnableAccessibleFieldDOMStructure> = {},
): DateValueManager<TEnableAccessibleFieldDOMStructure> {
  const { enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure } =
    parameters;

  return React.useMemo(
    () => ({
      legacyValueManager: singleItemValueManager,
      fieldValueManager: singleItemFieldValueManager,
      validator: validateDate,
      valueType: 'date',
      applyDefaultsToFieldInternalProps: ({ internalProps, utils, defaultDates }) => ({
        ...internalProps,
        ...getDateFieldInternalPropsDefaults({ defaultDates, utils, internalProps }),
      }),
      enableAccessibleFieldDOMStructure,
    }),
    [enableAccessibleFieldDOMStructure],
  );
}

/**
 * Private utility function to get the default internal props for the fields with date editing.
 * Is used by the `useDateValueManager` and `useDateRangeValueManager` hooks.
 */
export function getDateFieldInternalPropsDefaults(
  parameters: GetDateFieldInternalPropsDefaultsParameters,
): GetDateFieldInternalPropsDefaultsReturnValue {
  const { defaultDates, utils, internalProps } = parameters;

  return {
    format: internalProps.format ?? utils.formats.keyboardDate,
    disablePast: internalProps.disablePast ?? false,
    disableFuture: internalProps.disableFuture ?? false,
    minDate: applyDefaultDate(utils, internalProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, internalProps.maxDate, defaultDates.maxDate),
  };
}

export type DateValueManager<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerValueManagerV8<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    DateValidationError,
    DateFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    DateFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>
  >;

export interface DateFieldInternalProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<PickerValue, TEnableAccessibleFieldDOMStructure, DateValidationError>,
      'format'
    >,
    ExportedValidateDateProps {}

export interface DateFieldInternalPropsWithDefaults<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseFieldInternalProps<
      PickerValue,
      TEnableAccessibleFieldDOMStructure,
      DateValidationError
    >,
    ValidateDateProps {}

type DateFieldPropsToDefault = 'format' | ValidateDatePropsToDefault;

export interface UseDateValueManagerParameters<TEnableAccessibleFieldDOMStructure extends boolean> {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}

interface GetDateFieldInternalPropsDefaultsParameters
  extends Pick<MuiPickersAdapterContextValue, 'defaultDates' | 'utils'> {
  internalProps: Pick<DateFieldInternalProps<true>, DateFieldPropsToDefault>;
}

interface GetDateFieldInternalPropsDefaultsReturnValue
  extends Pick<DateFieldInternalPropsWithDefaults<true>, DateFieldPropsToDefault> {}
