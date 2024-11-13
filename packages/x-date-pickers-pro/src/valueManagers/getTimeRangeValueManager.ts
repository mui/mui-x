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

export const getTimeRangeValueManager = <
  TEnableAccessibleFieldDOMStructure extends boolean = false,
>({
  enableAccessibleFieldDOMStructure = false as TEnableAccessibleFieldDOMStructure,
  dateSeparator,
}: {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
} & RangeFieldSeparatorProps): TimeRangeValueManager<TEnableAccessibleFieldDOMStructure> => ({
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
