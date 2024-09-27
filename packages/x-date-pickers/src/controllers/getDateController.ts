import type { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import type {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../internals/models/validation';
import { applyDefaultDate } from '../internals/utils/date-utils';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { PickerController, PickerValidDate, DateValidationError, FieldSection } from '../models';
import { validateDate } from '../validation';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { ExportedUseClearableFieldProps } from '../hooks/useClearableField';

export interface DateFieldInternalProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
      UseFieldInternalProps<
        TDate | null,
        TDate,
        FieldSection,
        TEnableAccessibleFieldDOMStructure,
        DateValidationError
      >,
      'format'
    >,
    DayValidationProps<TDate>,
    MonthValidationProps<TDate>,
    YearValidationProps<TDate>,
    BaseDateValidationProps<TDate>,
    ExportedUseClearableFieldProps {}

export interface DateFieldInternalPropsWithDefaults<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DefaultizedProps<
    DateFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
    keyof BaseDateValidationProps<TDate> | 'format'
  > {}

export const getDateController = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
>(): PickerController<
  TDate,
  false,
  TEnableAccessibleFieldDOMStructure,
  DateValidationError,
  DateFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
  DateFieldInternalPropsWithDefaults<TDate, TEnableAccessibleFieldDOMStructure>
> => ({
  valueManager: singleItemValueManager,
  fieldValueManager: singleItemFieldValueManager,
  validator: validateDate,
  valueType: 'date',
  applyDefaultsToFieldInternalProps: ({ adapter, internalProps }) => ({
    ...internalProps,
    disablePast: internalProps.disablePast ?? false,
    disableFuture: internalProps.disableFuture ?? false,
    format: internalProps.format ?? adapter.utils.formats.keyboardDate,
    minDate: applyDefaultDate(adapter.utils, internalProps.minDate, adapter.defaultDates.minDate),
    maxDate: applyDefaultDate(adapter.utils, internalProps.maxDate, adapter.defaultDates.maxDate),
  }),
});
