'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { PickerManager } from '@mui/x-date-pickers/models';
import {
  AmPmProps,
  PickerRangeValue,
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

export function useDateTimeRangeManager<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  parameters: UseDateTimeRangeManagerParameters<TEnableAccessibleFieldDOMStructure> = {},
): DateTimeRangeManager<TEnableAccessibleFieldDOMStructure> {
  const {
    enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure,
    dateSeparator,
  } = parameters;

  return React.useMemo(
    () => ({
      valueManager: rangeValueManager,
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

export type DateTimeRangeManager<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerManager<
    PickerRangeValue,
    TEnableAccessibleFieldDOMStructure,
    DateTimeRangeValidationError,
    DateTimeRangeFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    DateTimeRangeFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>
  >;

export interface DateTimeRangeFieldInternalProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<
        PickerRangeValue,
        TEnableAccessibleFieldDOMStructure,
        DateTimeRangeValidationError
      >,
      'format'
    >,
    ExportedValidateDateTimeRangeProps,
    AmPmProps,
    RangeFieldSeparatorProps {}

export interface DateTimeRangeFieldInternalPropsWithDefaults<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseFieldInternalProps<
      PickerRangeValue,
      TEnableAccessibleFieldDOMStructure,
      DateTimeRangeValidationError
    >,
    ValidateDateTimeRangeProps,
    RangeFieldSeparatorProps {}

export interface UseDateTimeRangeManagerParameters<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends RangeFieldSeparatorProps {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}
