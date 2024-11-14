import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { PickerValueManagerV8 } from '@mui/x-date-pickers/models';
import {
  AmPmProps,
  UseFieldInternalProps,
  getDateTimeFieldInternalPropsDefaults,
} from '@mui/x-date-pickers/internals';
import { DateTimeRangeValidationError, RangeFieldSeparatorProps } from '../models';
import { getRangeFieldValueManager, rangeValueManager } from '../internals/utils/valueManagers';
import { validateDateTimeRange } from '../validation';
import {
  ExportedValidateDateTimeRangeProps,
  ValidateDateTimeRangeProps,
} from '../validation/validateDateTimeRange';

export function useDateTimeRangeValueManager<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
>(
  parameters: UseDateTimeRangeValueManagerParameters<TEnableAccessibleFieldDOMStructure> = {},
): DateTimeRangeValueManager<TEnableAccessibleFieldDOMStructure> {
  const {
    enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure,
    dateSeparator,
  } = parameters;

  return React.useMemo(
    () => ({
      legacyValueManager: rangeValueManager,
      fieldValueManager: getRangeFieldValueManager({ dateSeparator }),
      validator: validateDateTimeRange,
      valueType: 'date-time',
      applyDefaultsToFieldInternalProps: ({ internalProps, utils, defaultDates }) => ({
        ...internalProps,
        ...getDateTimeFieldInternalPropsDefaults({ internalProps, utils, defaultDates }),
      }),
      enableAccessibleFieldDOMStructure,
    }),
    [enableAccessibleFieldDOMStructure, dateSeparator],
  );
}

export type DateTimeRangeValueManager<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerValueManagerV8<
    true,
    TEnableAccessibleFieldDOMStructure,
    DateTimeRangeValidationError,
    DateTimeRangeFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    DateTimeRangeFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>
  >;

export interface DateTimeRangeFieldInternalProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<true, TEnableAccessibleFieldDOMStructure, DateTimeRangeValidationError>,
      'format'
    >,
    ExportedValidateDateTimeRangeProps,
    AmPmProps,
    RangeFieldSeparatorProps {}

export interface DateTimeRangeFieldInternalPropsWithDefaults<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseFieldInternalProps<
      true,
      TEnableAccessibleFieldDOMStructure,
      DateTimeRangeValidationError
    >,
    ValidateDateTimeRangeProps,
    RangeFieldSeparatorProps {}

export interface UseDateTimeRangeValueManagerParameters<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends RangeFieldSeparatorProps {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}
