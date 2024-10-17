import { PickerValidDate, PickerValueManagerV8 } from '@mui/x-date-pickers/models';
import { getDateTimeFieldInternalPropsDefaults } from '@mui/x-date-pickers/valueManagers';
import {
  BaseDateValidationProps,
  BaseTimeValidationProps,
  DateTimeValidationProps,
  DefaultizedProps,
  MakeOptional,
  TimeValidationProps,
  UseFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import { DateTimeRangeValidationError, RangeFieldSeparatorProps } from '../models';
import { getRangeFieldValueManager, rangeValueManager } from '../internals/utils/valueManagers';
import { validateDateTimeRange } from '../validation';
import { DayRangeValidationProps } from '../internals/models';

export type DateTimeRangeValueManager<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> = PickerValueManagerV8<
  TDate,
  true,
  TEnableAccessibleFieldDOMStructure,
  DateTimeRangeValidationError,
  DateTimeRangeFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
  DateTimeRangeFieldInternalPropsWithDefaults<TDate, TEnableAccessibleFieldDOMStructure>
>;

export interface DateTimeRangeFieldInternalProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
      UseFieldInternalProps<
        TDate,
        true,
        TEnableAccessibleFieldDOMStructure,
        DateTimeRangeValidationError
      >,
      'format'
    >,
    RangeFieldSeparatorProps,
    DayRangeValidationProps<TDate>,
    TimeValidationProps<TDate>,
    BaseDateValidationProps<TDate>,
    DateTimeValidationProps<TDate> {
  /**
   * 12h/24h view for hour selection clock.
   * @default utils.is12HourCycleInCurrentLocale()
   */
  ampm?: boolean;
}

export interface DateTimeRangeFieldInternalPropsWithDefaults<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DefaultizedProps<
    DateTimeRangeFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
    keyof BaseDateValidationProps<TDate> | keyof BaseTimeValidationProps | 'format'
  > {}

export const getDateTimeRangeValueManager = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
>({
  enableAccessibleFieldDOMStructure = false as TEnableAccessibleFieldDOMStructure,
  dateSeparator,
}: {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
} & RangeFieldSeparatorProps): DateTimeRangeValueManager<
  TDate,
  TEnableAccessibleFieldDOMStructure
> => ({
  legacyValueManager: rangeValueManager,
  fieldValueManager: getRangeFieldValueManager({ dateSeparator }),
  validator: validateDateTimeRange,
  valueType: 'date-time',
  applyDefaultsToFieldInternalProps: ({ internalProps, utils, defaultDates }) => ({
    ...internalProps,
    ...getDateTimeFieldInternalPropsDefaults({ internalProps, utils, defaultDates }),
  }),
  enableAccessibleFieldDOMStructure,
});
