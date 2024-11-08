import type { MakeOptional } from '@mui/x-internals/types';
import { PickerValueManagerV8 } from '@mui/x-date-pickers/models';
import { getDateFieldInternalPropsDefaults } from '@mui/x-date-pickers/valueManagers';
import { UseFieldInternalProps } from '@mui/x-date-pickers/internals';
import { DateRangeValidationError, RangeFieldSeparatorProps } from '../models';
import { getRangeFieldValueManager, rangeValueManager } from '../internals/utils/valueManagers';
import { validateDateRange } from '../validation';
import {
  ExportedValidateDateRangeProps,
  ValidateDateRangeProps,
} from '../validation/validateDateRange';

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

export const getDateRangeValueManager = <
  TEnableAccessibleFieldDOMStructure extends boolean = false,
>({
  enableAccessibleFieldDOMStructure = false as TEnableAccessibleFieldDOMStructure,
  dateSeparator,
}: {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
} & RangeFieldSeparatorProps): DateRangeValueManager<TEnableAccessibleFieldDOMStructure> => ({
  legacyValueManager: rangeValueManager,
  fieldValueManager: getRangeFieldValueManager({ dateSeparator }),
  validator: validateDateRange,
  valueType: 'date',
  applyDefaultsToFieldInternalProps: ({ internalProps, utils, defaultDates }) => ({
    ...internalProps,
    ...getDateFieldInternalPropsDefaults({ defaultDates, utils, internalProps }),
  }),
  enableAccessibleFieldDOMStructure,
});
