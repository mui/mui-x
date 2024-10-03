import type { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import type {
  BaseDateValidationProps,
  BaseTimeValidationProps,
  DateTimeValidationProps,
  DayValidationProps,
  MonthValidationProps,
  TimeValidationProps,
  YearValidationProps,
} from '../internals/models/validation';
import { applyDefaultDate } from '../internals/utils/date-utils';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { PickerValueManagerV8, PickerValidDate, DateTimeValidationError } from '../models';
import { validateDateTime } from '../validation';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { MuiPickersAdapterContextValue } from '../LocalizationProvider/LocalizationProvider';

export type DateTimeValueManager<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> = PickerValueManagerV8<
  TDate,
  false,
  TEnableAccessibleFieldDOMStructure,
  DateTimeValidationError,
  DateTimeFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
  DateTimeFieldInternalPropsWithDefaults<TDate, TEnableAccessibleFieldDOMStructure>
>;

export interface DateTimeFieldInternalProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
      UseFieldInternalProps<
        TDate,
        false,
        TEnableAccessibleFieldDOMStructure,
        DateTimeValidationError
      >,
      'format'
    >,
    DayValidationProps<TDate>,
    MonthValidationProps<TDate>,
    YearValidationProps<TDate>,
    BaseDateValidationProps<TDate>,
    TimeValidationProps<TDate>,
    BaseTimeValidationProps,
    DateTimeValidationProps<TDate> {
  /**
   * 12h/24h view for hour selection clock.
   * @default utils.is12HourCycleInCurrentLocale()
   */
  ampm?: boolean;
}

export interface DateTimeFieldInternalPropsWithDefaults<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DefaultizedProps<
    DateTimeFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
    keyof BaseDateValidationProps<TDate> | keyof BaseTimeValidationProps | 'format'
  > {}

export const getDateTimeFieldInternalPropsDefaults = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
>({
  defaultDates,
  utils,
  internalProps,
}: Pick<MuiPickersAdapterContextValue<TDate>, 'defaultDates' | 'utils'> & {
  internalProps: Pick<
    DateTimeFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
    | 'ampm'
    | 'disablePast'
    | 'disableFuture'
    | 'format'
    | 'minDateTime'
    | 'maxDateTime'
    | 'minDate'
    | 'maxDate'
    | 'minTime'
    | 'maxTime'
  >;
}) => {
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

export const getDateTimeValueManager = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
>(
  enableAccessibleFieldDOMStructure: TEnableAccessibleFieldDOMStructure = false as TEnableAccessibleFieldDOMStructure,
): DateTimeValueManager<TDate, TEnableAccessibleFieldDOMStructure> => ({
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
