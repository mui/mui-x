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

export type DateValueManager<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerValueManagerV8<
    false,
    TEnableAccessibleFieldDOMStructure,
    DateValidationError,
    DateFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    DateFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>
  >;

export interface DateFieldInternalProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<false, TEnableAccessibleFieldDOMStructure, DateValidationError>,
      'format'
    >,
    ExportedValidateDateProps {}

export interface DateFieldInternalPropsWithDefaults<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseFieldInternalProps<false, TEnableAccessibleFieldDOMStructure, DateValidationError>,
    ValidateDateProps {}

type DateFieldPropsToDefault = 'format' | ValidateDatePropsToDefault;

export const getDateFieldInternalPropsDefaults = <
  TEnableAccessibleFieldDOMStructure extends boolean,
>({
  defaultDates,
  utils,
  internalProps,
}: Pick<MuiPickersAdapterContextValue, 'defaultDates' | 'utils'> & {
  internalProps: Pick<
    DateFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    DateFieldPropsToDefault
  >;
}): Pick<
  DateFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>,
  DateFieldPropsToDefault
> => ({
  format: internalProps.format ?? utils.formats.keyboardDate,
  disablePast: internalProps.disablePast ?? false,
  disableFuture: internalProps.disableFuture ?? false,
  minDate: applyDefaultDate(utils, internalProps.minDate, defaultDates.minDate),
  maxDate: applyDefaultDate(utils, internalProps.maxDate, defaultDates.maxDate),
});

export const getDateValueManager = <TEnableAccessibleFieldDOMStructure extends boolean = true>({
  enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure,
}: {
  enableAccessibleFieldDOMStructure: TEnableAccessibleFieldDOMStructure | undefined;
}): DateValueManager<TEnableAccessibleFieldDOMStructure> => ({
  legacyValueManager: singleItemValueManager,
  fieldValueManager: singleItemFieldValueManager,
  validator: validateDate,
  valueType: 'date',
  applyDefaultsToFieldInternalProps: ({ internalProps, utils, defaultDates }) => ({
    ...internalProps,
    ...getDateFieldInternalPropsDefaults({ defaultDates, utils, internalProps }),
  }),
  enableAccessibleFieldDOMStructure,
});
