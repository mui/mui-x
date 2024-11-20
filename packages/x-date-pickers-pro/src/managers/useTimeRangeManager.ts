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
): UseTimeRangeManagerReturnValue<TEnableAccessibleFieldDOMStructure> {
  const {
    enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure,
    dateSeparator,
  } = parameters;

  return React.useMemo(
    () => ({
      valueType: 'time',
      validator: validateTimeRange,
      internal_valueManager: rangeValueManager,
      internal_fieldValueManager: getRangeFieldValueManager({ dateSeparator }),
      internal_enableAccessibleFieldDOMStructure: enableAccessibleFieldDOMStructure,
      internal_applyDefaultsToFieldInternalProps: ({ internalProps, utils }) => ({
        ...internalProps,
        ...getTimeFieldInternalPropsDefaults({ utils, internalProps }),
      }),
    }),
    [enableAccessibleFieldDOMStructure, dateSeparator],
  );
}

export interface UseTimeRangeManagerParameters<TEnableAccessibleFieldDOMStructure extends boolean>
  extends RangeFieldSeparatorProps {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}

export type UseTimeRangeManagerReturnValue<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerManager<
    PickerRangeValue,
    TEnableAccessibleFieldDOMStructure,
    TimeRangeValidationError,
    TimeRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    TimeRangeManagerFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>
  >;

interface TimeRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure extends boolean>
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

interface TimeRangeManagerFieldInternalPropsWithDefaults<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseFieldInternalProps<
      PickerRangeValue,
      TEnableAccessibleFieldDOMStructure,
      TimeRangeValidationError
    >,
    ValidateTimeRangeProps {}
