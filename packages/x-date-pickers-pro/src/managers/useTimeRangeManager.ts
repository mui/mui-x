'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { PickerManager } from '@mui/x-date-pickers/models';
import {
  AmPmProps,
  PickerRangeValue,
  UseFieldInternalProps,
  getTimeFieldInternalPropsDefaults,
} from '@mui/x-date-pickers/internals';
import { TimeRangeValidationError, RangeFieldSeparatorProps } from '../models';
import { getRangeFieldValueManager, rangeValueManager } from '../internals/utils/valueManagers';
import { validateTimeRange } from '../validation';
import {
  ExportedValidateTimeRangeProps,
  ValidateTimeRangeProps,
} from '../validation/validateTimeRange';

export function useTimeRangeManager<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  parameters: UseTimeRangeManagerParameters<TEnableAccessibleFieldDOMStructure> = {},
): TimeRangeManager<TEnableAccessibleFieldDOMStructure> {
  const {
    enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure,
    dateSeparator,
  } = parameters;

  return React.useMemo(
    () => ({
      valueManager: rangeValueManager,
      internal_fieldValueManager: getRangeFieldValueManager({ dateSeparator }),
      validator: validateTimeRange,
      valueType: 'time',
      internal_applyDefaultsToFieldInternalProps: ({ internalProps, utils }) => ({
        ...internalProps,
        ...getTimeFieldInternalPropsDefaults({ utils, internalProps }),
      }),
      enableAccessibleFieldDOMStructure,
    }),
    [enableAccessibleFieldDOMStructure, dateSeparator],
  );
}

export type TimeRangeManager<TEnableAccessibleFieldDOMStructure extends boolean> = PickerManager<
  PickerRangeValue,
  TEnableAccessibleFieldDOMStructure,
  TimeRangeValidationError,
  TimeRangeFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
  TimeRangeFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>
>;

export interface TimeRangeFieldInternalProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<
        PickerRangeValue,
        TEnableAccessibleFieldDOMStructure,
        TimeRangeValidationError
      >,
      'format'
    >,
    ExportedValidateTimeRangeProps,
    AmPmProps,
    RangeFieldSeparatorProps {}

export interface TimeRangeFieldInternalPropsWithDefaults<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseFieldInternalProps<
      PickerRangeValue,
      TEnableAccessibleFieldDOMStructure,
      TimeRangeValidationError
    >,
    ValidateTimeRangeProps {}

export interface UseTimeRangeManagerParameters<TEnableAccessibleFieldDOMStructure extends boolean>
  extends RangeFieldSeparatorProps {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}
