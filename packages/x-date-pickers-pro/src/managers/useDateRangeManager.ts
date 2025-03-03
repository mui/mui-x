'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { PickerManager } from '@mui/x-date-pickers/models';
import { usePickerTranslations } from '@mui/x-date-pickers/hooks';
import {
  PickerRangeValue,
  UseFieldInternalProps,
  getDateFieldInternalPropsDefaults,
  useUtils,
} from '@mui/x-date-pickers/internals';
import { DateRangeValidationError, RangeFieldSeparatorProps } from '../models';
import { getRangeFieldValueManager, rangeValueManager } from '../internals/utils/valueManagers';
import { validateDateRange } from '../validation';
import {
  ExportedValidateDateRangeProps,
  ValidateDateRangeProps,
} from '../validation/validateDateRange';
import { usePickerRangePositionContext } from '../hooks';

export function useDateRangeManager<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  parameters: UseDateRangeManagerParameters<TEnableAccessibleFieldDOMStructure> = {},
): UseDateRangeManagerReturnValue<TEnableAccessibleFieldDOMStructure> {
  const {
    enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure,
    dateSeparator,
  } = parameters;

  return React.useMemo(
    () => ({
      valueType: 'date',
      validator: validateDateRange,
      internal_valueManager: rangeValueManager,
      internal_fieldValueManager: getRangeFieldValueManager({ dateSeparator }),
      internal_enableAccessibleFieldDOMStructure: enableAccessibleFieldDOMStructure,
      internal_applyDefaultsToFieldInternalProps: ({ internalProps, utils, defaultDates }) => ({
        ...internalProps,
        ...getDateFieldInternalPropsDefaults({ defaultDates, utils, internalProps }),
      }),
      internal_useOpenPickerButtonAriaLabel: useOpenPickerButtonAriaLabel,
    }),
    [enableAccessibleFieldDOMStructure, dateSeparator],
  );
}

function useOpenPickerButtonAriaLabel() {
  const utils = useUtils();
  const translations = usePickerTranslations();
  const rangePositionContext = usePickerRangePositionContext();

  return React.useCallback(
    (value: PickerRangeValue) => {
      if (rangePositionContext == null) {
        return '';
      }

      const date = rangePositionContext.rangePosition === 'start' ? value[0] : value[1];
      const formattedValue = utils.isValid(date) ? utils.format(date, 'fullDate') : null;
      return translations.openDateRangePickerDialogue(
        formattedValue,
        rangePositionContext.rangePosition,
      );
    },
    [rangePositionContext, translations, utils],
  );
}

export interface UseDateRangeManagerParameters<TEnableAccessibleFieldDOMStructure extends boolean>
  extends RangeFieldSeparatorProps {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}

export type UseDateRangeManagerReturnValue<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerManager<
    PickerRangeValue,
    TEnableAccessibleFieldDOMStructure,
    DateRangeValidationError,
    DateRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    DateRangeManagerFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>
  >;

export interface DateRangeManagerFieldInternalProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
      UseFieldInternalProps<
        PickerRangeValue,
        TEnableAccessibleFieldDOMStructure,
        DateRangeValidationError
      >,
      'format'
    >,
    RangeFieldSeparatorProps,
    ExportedValidateDateRangeProps {}

interface DateRangeManagerFieldInternalPropsWithDefaults<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseFieldInternalProps<
      PickerRangeValue,
      TEnableAccessibleFieldDOMStructure,
      DateRangeValidationError
    >,
    ValidateDateRangeProps,
    RangeFieldSeparatorProps {}
