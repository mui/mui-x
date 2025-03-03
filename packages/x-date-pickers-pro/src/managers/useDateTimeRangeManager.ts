'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { PickerManager } from '@mui/x-date-pickers/models';
import { usePickerTranslations } from '@mui/x-date-pickers/hooks';
import {
  AmPmProps,
  PickerRangeValue,
  UseFieldInternalProps,
  getDateTimeFieldInternalPropsDefaults,
  useUtils,
} from '@mui/x-date-pickers/internals';
import { DateTimeRangeValidationError, RangeFieldSeparatorProps } from '../models';
import { getRangeFieldValueManager, rangeValueManager } from '../internals/utils/valueManagers';
import { validateDateTimeRange } from '../validation';
import {
  ExportedValidateDateTimeRangeProps,
  ValidateDateTimeRangeProps,
} from '../validation/validateDateTimeRange';
import { useNullablePickerRangePositionContext } from '../internals/hooks/useNullablePickerRangePositionContext';

export function useDateTimeRangeManager<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  parameters: UseDateTimeRangeManagerParameters<TEnableAccessibleFieldDOMStructure> = {},
): UseDateTimeRangeManagerReturnValue<TEnableAccessibleFieldDOMStructure> {
  const {
    enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure,
    dateSeparator,
  } = parameters;

  return React.useMemo(
    () => ({
      valueType: 'date-time',
      validator: validateDateTimeRange,
      internal_valueManager: rangeValueManager,
      internal_fieldValueManager: getRangeFieldValueManager({ dateSeparator }),
      internal_enableAccessibleFieldDOMStructure: enableAccessibleFieldDOMStructure,
      internal_applyDefaultsToFieldInternalProps: ({ internalProps, utils, defaultDates }) => ({
        ...internalProps,
        ...getDateTimeFieldInternalPropsDefaults({ internalProps, utils, defaultDates }),
      }),
      internal_useOpenPickerButtonAriaLabel: useOpenPickerButtonAriaLabel,
    }),
    [enableAccessibleFieldDOMStructure, dateSeparator],
  );
}

function useOpenPickerButtonAriaLabel() {
  const utils = useUtils();
  const translations = usePickerTranslations();
  const rangePositionContext = useNullablePickerRangePositionContext();

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

export interface UseDateTimeRangeManagerParameters<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends RangeFieldSeparatorProps {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}

export type UseDateTimeRangeManagerReturnValue<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerManager<
    PickerRangeValue,
    TEnableAccessibleFieldDOMStructure,
    DateTimeRangeValidationError,
    DateTimeRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    DateTimeRangeManagerFieldInternalPropsWithDefaults<TEnableAccessibleFieldDOMStructure>
  >;

export interface DateTimeRangeManagerFieldInternalProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
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

interface DateTimeRangeManagerFieldInternalPropsWithDefaults<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseFieldInternalProps<
      PickerRangeValue,
      TEnableAccessibleFieldDOMStructure,
      DateTimeRangeValidationError
    >,
    ValidateDateTimeRangeProps,
    RangeFieldSeparatorProps {}
