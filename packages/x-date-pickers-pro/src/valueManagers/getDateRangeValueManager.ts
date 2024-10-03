import { PickerValidDate, PickerValueManagerV8 } from '@mui/x-date-pickers/models';
import {
  applyDefaultDate,
  BaseDateValidationProps,
  DefaultizedProps,
  MakeOptional,
  UseFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import { DateRangeValidationError, RangeFieldSeparatorProps } from '../models';
import { DayRangeValidationProps } from '../internals/models';
import { getRangeFieldValueManager, rangeValueManager } from '../internals/utils/valueManagers';
import { validateDateRange } from '../validation';

export type DateRangeValueManager<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> = PickerValueManagerV8<
  TDate,
  true,
  TEnableAccessibleFieldDOMStructure,
  DateRangeValidationError,
  DateRangeFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
  DateRangeFieldInternalPropsWithDefaults<TDate, TEnableAccessibleFieldDOMStructure>
>;

export interface DateRangeFieldInternalProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
      UseFieldInternalProps<
        TDate,
        true,
        TEnableAccessibleFieldDOMStructure,
        DateRangeValidationError
      >,
      'format'
    >,
    RangeFieldSeparatorProps,
    DayRangeValidationProps<TDate>,
    BaseDateValidationProps<TDate> {}

export interface DateRangeFieldInternalPropsWithDefaults<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DefaultizedProps<
    DateRangeFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
    keyof BaseDateValidationProps<TDate> | 'format'
  > {}

export const getDateRangeValueManager = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
>({
  enableAccessibleFieldDOMStructure = false as TEnableAccessibleFieldDOMStructure,
  dateSeparator,
}: {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
} & RangeFieldSeparatorProps): DateRangeValueManager<
  TDate,
  TEnableAccessibleFieldDOMStructure
> => ({
  legacyValueManager: rangeValueManager,
  fieldValueManager: getRangeFieldValueManager({ dateSeparator }),
  validator: validateDateRange,
  valueType: 'date',
  applyDefaultsToFieldInternalProps: ({ internalProps, utils, defaultDates }) => ({
    ...internalProps,
    disablePast: internalProps.disablePast ?? false,
    disableFuture: internalProps.disableFuture ?? false,
    format: internalProps.format ?? utils.formats.keyboardDate,
    minDate: applyDefaultDate(utils, internalProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, internalProps.maxDate, defaultDates.maxDate),
  }),
  enableAccessibleFieldDOMStructure,
});
