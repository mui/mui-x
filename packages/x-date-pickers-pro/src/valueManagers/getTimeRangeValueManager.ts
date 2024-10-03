import { PickerValidDate, PickerValueManagerV8 } from '@mui/x-date-pickers/models';
import { getTimeFieldInternalPropsDefaults } from '@mui/x-date-pickers/valueManagers';
import {
  BaseTimeValidationProps,
  DefaultizedProps,
  MakeOptional,
  TimeValidationProps,
  UseFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import { TimeRangeValidationError, RangeFieldSeparatorProps } from '../models';
import { getRangeFieldValueManager, rangeValueManager } from '../internals/utils/valueManagers';
import { validateTimeRange } from '../validation';

export type TimeRangeValueManager<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> = PickerValueManagerV8<
  TDate,
  true,
  TEnableAccessibleFieldDOMStructure,
  TimeRangeValidationError,
  TimeRangeFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
  TimeRangeFieldInternalPropsWithDefaults<TDate, TEnableAccessibleFieldDOMStructure>
>;

export interface TimeRangeFieldInternalProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
      UseFieldInternalProps<
        TDate,
        true,
        TEnableAccessibleFieldDOMStructure,
        TimeRangeValidationError
      >,
      'format'
    >,
    RangeFieldSeparatorProps,
    TimeValidationProps<TDate>,
    BaseTimeValidationProps {
  /**
   * 12h/24h view for hour selection clock.
   * @default utils.is12HourCycleInCurrentLocale()
   */
  ampm?: boolean;
}

export interface TimeRangeFieldInternalPropsWithDefaults<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DefaultizedProps<
    TimeRangeFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
    keyof BaseTimeValidationProps | 'format'
  > {}

export const getTimeRangeValueManager = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
>({
  enableAccessibleFieldDOMStructure = false as TEnableAccessibleFieldDOMStructure,
  dateSeparator,
}: {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
} & RangeFieldSeparatorProps): TimeRangeValueManager<
  TDate,
  TEnableAccessibleFieldDOMStructure
> => ({
  legacyValueManager: rangeValueManager,
  fieldValueManager: getRangeFieldValueManager({ dateSeparator }),
  validator: validateTimeRange,
  valueType: 'time',
  applyDefaultsToFieldInternalProps: ({ internalProps, utils }) => ({
    ...internalProps,
    ...getTimeFieldInternalPropsDefaults({ utils, internalProps }),
  }),
  enableAccessibleFieldDOMStructure,
});
