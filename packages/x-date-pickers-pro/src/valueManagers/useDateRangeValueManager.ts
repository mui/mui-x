import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { PickerValueManagerV8 } from '@mui/x-date-pickers/models';
import {
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

export function useDateRangeValueManager<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  parameters: UseDateRangeValueManagerParameters<TEnableAccessibleFieldDOMStructure> = {},
): DateRangeValueManager<TEnableAccessibleFieldDOMStructure> {
  const {
    enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure,
    dateSeparator,
  } = parameters;

  return React.useMemo(
    () => ({
      legacyValueManager: rangeValueManager,
      fieldValueManager: getRangeFieldValueManager({ dateSeparator }),
      validator: validateDateRange,
      valueType: 'date',
      applyDefaultsToFieldInternalProps: ({ internalProps, utils, defaultDates }) => ({
        ...internalProps,
        ...getDateFieldInternalPropsDefaults({ defaultDates, utils, internalProps }),
      }),
      enableAccessibleFieldDOMStructure,
    }),
    [enableAccessibleFieldDOMStructure, dateSeparator],
  );
}

export type DateRangeValueManager<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerValueManagerV8<
    true,
    TEnableAccessibleFieldDOMStructure,
    DateRangeValidationError,
    DateRangeFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    DateRangeFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>
  >;

export interface DateRangeFieldInternalProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<true, TEnableAccessibleFieldDOMStructure, DateRangeValidationError>,
      'format'
    >,
    RangeFieldSeparatorProps,
    ExportedValidateDateRangeProps {}

export interface DateRangeFieldInternalPropsWithDefaults<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseFieldInternalProps<true, TEnableAccessibleFieldDOMStructure, DateRangeValidationError>,
    ValidateDateRangeProps,
    RangeFieldSeparatorProps {}

export interface UseDateRangeValueManagerParameters<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends RangeFieldSeparatorProps {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}
