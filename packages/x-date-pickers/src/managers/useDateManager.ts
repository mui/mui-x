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
import { MuiPickersAdapterContextValue } from '../LocalizationProvider/LocalizationProvider';
import {
  ExportedValidateDateProps,
  ValidateDatePropsToDefault,
  ValidateDateProps,
} from '../validation/validateDate';
import { PickerManagerFieldInternalPropsWithDefaults, PickerValue } from '../internals/models';
import { useUtils } from '../internals/hooks/useUtils';
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
      internal_applyDefaultsToFieldInternalProps: ({ internalProps, utils, defaultDates }) => ({
        ...internalProps,
        ...getDateFieldInternalPropsDefaults({ defaultDates, utils, internalProps }),
      }),
      internal_useOpenPickerButtonAriaLabel: useOpenPickerButtonAriaLabel,
    }),
    [enableAccessibleFieldDOMStructure],
  );
}

function useOpenPickerButtonAriaLabel() {
  const utils = useUtils();
  const translations = usePickerTranslations();

  return React.useCallback(
    (value: PickerValue) => {
      const formattedValue = utils.isValid(value) ? utils.format(value, 'fullDate') : null;
      return translations.openDatePickerDialogue(formattedValue);
    },
    [translations, utils],
  );
}

/**
 * Private utility function to get the default internal props for the fields with date editing.
 * Is used by the `useDateManager` and `useDateRangeManager` hooks.
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

type DateManagerFieldPropsToDefault = 'format' | ValidateDatePropsToDefault;

interface GetDateFieldInternalPropsDefaultsParameters
  extends Pick<MuiPickersAdapterContextValue, 'defaultDates' | 'utils'> {
  internalProps: Pick<DateManagerFieldInternalProps<true>, DateManagerFieldPropsToDefault>;
}

interface GetDateFieldInternalPropsDefaultsReturnValue
  extends Pick<
    PickerManagerFieldInternalPropsWithDefaults<UseDateManagerReturnValue<true>>,
    DateManagerFieldPropsToDefault
  > {}
