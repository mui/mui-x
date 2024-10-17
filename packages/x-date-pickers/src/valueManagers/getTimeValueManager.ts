import type { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import type { BaseTimeValidationProps, TimeValidationProps } from '../internals/models/validation';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { PickerValueManagerV8, PickerValidDate, TimeValidationError } from '../models';
import { validateTime } from '../validation';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { MuiPickersAdapterContextValue } from '../LocalizationProvider/LocalizationProvider';

export type TimeValueManager<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> = PickerValueManagerV8<
  TDate,
  false,
  TEnableAccessibleFieldDOMStructure,
  TimeValidationError,
  TimeFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
  TimeFieldInternalPropsWithDefaults<TDate, TEnableAccessibleFieldDOMStructure>
>;

export interface TimeFieldInternalProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
      UseFieldInternalProps<TDate, false, TEnableAccessibleFieldDOMStructure, TimeValidationError>,
      'format'
    >,
    TimeValidationProps<TDate>,
    BaseTimeValidationProps {
  /**
   * 12h/24h view for hour selection clock.
   * @default utils.is12HourCycleInCurrentLocale()
   */
  ampm?: boolean;
}

export interface TimeFieldInternalPropsWithDefaults<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DefaultizedProps<
    TimeFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
    keyof BaseTimeValidationProps | 'format'
  > {}

export const getTimeFieldInternalPropsDefaults = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
>({
  utils,
  internalProps,
}: Pick<MuiPickersAdapterContextValue<TDate>, 'utils'> & {
  internalProps: Pick<
    TimeFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
    'ampm' | 'disablePast' | 'disableFuture' | 'format'
  >;
}) => {
  const ampm = internalProps.ampm ?? utils.is12HourCycleInCurrentLocale();
  const defaultFormat = ampm ? utils.formats.fullTime12h : utils.formats.fullTime24h;

  return {
    disablePast: internalProps.disablePast ?? false,
    disableFuture: internalProps.disableFuture ?? false,
    format: internalProps.format ?? defaultFormat,
  };
};

export const getTimeValueManager = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
>(
  enableAccessibleFieldDOMStructure: TEnableAccessibleFieldDOMStructure = false as TEnableAccessibleFieldDOMStructure,
): TimeValueManager<TDate, TEnableAccessibleFieldDOMStructure> => ({
  legacyValueManager: singleItemValueManager,
  fieldValueManager: singleItemFieldValueManager,
  validator: validateTime,
  valueType: 'time',
  applyDefaultsToFieldInternalProps: ({ internalProps, utils }) => ({
    ...internalProps,
    ...getTimeFieldInternalPropsDefaults({ utils, internalProps }),
  }),
  enableAccessibleFieldDOMStructure,
});
