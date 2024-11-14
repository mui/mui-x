import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { PickerValueManagerV8 } from '@mui/x-date-pickers/models';
import {
  AmPmProps,
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

export function useTimeRangeValueManager<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  parameters: UseTimeRangeValueManagerParameters<TEnableAccessibleFieldDOMStructure> = {},
): TimeRangeValueManager<TEnableAccessibleFieldDOMStructure> {
  const {
    enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure,
    dateSeparator,
  } = parameters;

  return React.useMemo(
    () => ({
      legacyValueManager: rangeValueManager,
      fieldValueManager: getRangeFieldValueManager({ dateSeparator }),
      validator: validateTimeRange,
      valueType: 'time',
      applyDefaultsToFieldInternalProps: ({ internalProps, utils }) => ({
        ...internalProps,
        ...getTimeFieldInternalPropsDefaults({ utils, internalProps }),
      }),
      enableAccessibleFieldDOMStructure,
    }),
    [enableAccessibleFieldDOMStructure, dateSeparator],
  );
}

export type TimeRangeValueManager<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerValueManagerV8<
    true,
    TEnableAccessibleFieldDOMStructure,
    TimeRangeValidationError,
    TimeRangeFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    TimeRangeFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>
  >;

export interface TimeRangeFieldInternalProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<true, TEnableAccessibleFieldDOMStructure, TimeRangeValidationError>,
      'format'
    >,
    ExportedValidateTimeRangeProps,
    AmPmProps,
    RangeFieldSeparatorProps {}

export interface TimeRangeFieldInternalPropsWithDefaults<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseFieldInternalProps<true, TEnableAccessibleFieldDOMStructure, TimeRangeValidationError>,
    ValidateTimeRangeProps {}

export interface UseTimeRangeValueManagerParameters<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends RangeFieldSeparatorProps {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}
