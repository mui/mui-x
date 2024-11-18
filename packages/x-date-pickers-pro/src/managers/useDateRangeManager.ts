'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { PickerManager } from '@mui/x-date-pickers/models';
import {
  PickerRangeValue,
  UseFieldInternalProps,
  getDateFieldInternalPropsDefaults,
} from '@mui/x-date-pickers/internals';
import { DateRangeValidationError, RangeFieldSeparatorProps } from '../models';
import { getRangeFieldValueManager, rangeValueManager } from '../internals/utils/valueManagers';
import { validateDateRange } from '../validation';
import {
  ExportedValidateDateRangeProps,
  ValidateDateRangeProps,
} from '../validation/validateDateRange';

export function useDateRangeManager<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  parameters: UseDateRangeManagerParameters<TEnableAccessibleFieldDOMStructure> = {},
): DateRangeManager<TEnableAccessibleFieldDOMStructure> {
  const {
    enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure,
    dateSeparator,
  } = parameters;

  return React.useMemo(
    () => ({
      valueManager: rangeValueManager,
      internal_fieldValueManager: getRangeFieldValueManager({ dateSeparator }),
      validator: validateDateRange,
      valueType: 'date',
      internal_applyDefaultsToFieldInternalProps: ({ internalProps, utils, defaultDates }) => ({
        ...internalProps,
        ...getDateFieldInternalPropsDefaults({ defaultDates, utils, internalProps }),
      }),
      enableAccessibleFieldDOMStructure,
    }),
    [enableAccessibleFieldDOMStructure, dateSeparator],
  );
}

export type DateRangeManager<TEnableAccessibleFieldDOMStructure extends boolean> = PickerManager<
  PickerRangeValue,
  TEnableAccessibleFieldDOMStructure,
  DateRangeValidationError,
  DateRangeFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
  DateRangeFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>
>;

export interface DateRangeFieldInternalProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<
        PickerRangeValue,
        TEnableAccessibleFieldDOMStructure,
        DateRangeValidationError
      >,
      'format'
    >,
    RangeFieldSeparatorProps,
    ExportedValidateDateRangeProps {}

export interface DateRangeFieldInternalPropsWithDefaults<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseFieldInternalProps<
      PickerRangeValue,
      TEnableAccessibleFieldDOMStructure,
      DateRangeValidationError
    >,
    ValidateDateRangeProps,
    RangeFieldSeparatorProps {}

export interface UseDateRangeManagerParameters<TEnableAccessibleFieldDOMStructure extends boolean>
  extends RangeFieldSeparatorProps {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}
