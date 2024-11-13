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

export type DateTimeValueManager<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerValueManagerV8<
    false,
    TEnableAccessibleFieldDOMStructure,
    DateTimeValidationError,
    DateTimeFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    DateTimeFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>
  >;

export interface DateTimeFieldInternalProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<false, TEnableAccessibleFieldDOMStructure, DateTimeValidationError>,
      'format'
    >,
    ExportedValidateDateTimeProps,
    AmPmProps {}

export interface DateTimeFieldInternalPropsWithDefaults<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseFieldInternalProps<false, TEnableAccessibleFieldDOMStructure, DateTimeValidationError>,
    ValidateDateTimeProps {}

type DateTimeFieldPropsToDefault =
  | 'format'
  // minTime and maxTime can still be undefined after applying defaults.
  | 'minTime'
  | 'maxTime'
  | ValidateDateTimePropsToDefault;

export const getDateTimeFieldInternalPropsDefaults = <
  TEnableAccessibleFieldDOMStructure extends boolean,
>({
  defaultDates,
  utils,
  internalProps,
}: Pick<MuiPickersAdapterContextValue, 'defaultDates' | 'utils'> & {
  internalProps: Pick<
    DateTimeFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    DateTimeFieldPropsToDefault | 'minDateTime' | 'maxDateTime' | 'ampm'
  >;
}): Pick<
  DateTimeFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>,
  DateTimeFieldPropsToDefault | 'disableIgnoringDatePartForTimeValidation'
> => {
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
};

export const getDateTimeValueManager = <TEnableAccessibleFieldDOMStructure extends boolean = true>({
  enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure,
}: {
  enableAccessibleFieldDOMStructure: TEnableAccessibleFieldDOMStructure | undefined;
}): DateTimeValueManager<TEnableAccessibleFieldDOMStructure> => ({
  legacyValueManager: singleItemValueManager,
  fieldValueManager: singleItemFieldValueManager,
  validator: validateDateTime,
  valueType: 'date-time',
  applyDefaultsToFieldInternalProps: ({ internalProps, utils, defaultDates }) => ({
    ...internalProps,
    ...getDateTimeFieldInternalPropsDefaults({ internalProps, utils, defaultDates }),
  }),
  enableAccessibleFieldDOMStructure,
});
