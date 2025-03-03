'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { PickerManager } from '@mui/x-date-pickers/models';
import { usePickerTranslations } from '@mui/x-date-pickers/hooks';
import {
  AmPmProps,
  PickerRangeValue,
  UseFieldInternalProps,
  getTimeFieldInternalPropsDefaults,
  useUtils,
} from '@mui/x-date-pickers/internals';
import { TimeRangeValidationError, RangeFieldSeparatorProps } from '../models';
import { getRangeFieldValueManager, rangeValueManager } from '../internals/utils/valueManagers';
import { validateTimeRange } from '../validation';
import {
  ExportedValidateTimeRangeProps,
  ValidateTimeRangeProps,
} from '../validation/validateTimeRange';
import { usePickerRangePositionContext } from '../hooks';

export function useTimeRangeManager<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  parameters: UseTimeRangeManagerParameters<TEnableAccessibleFieldDOMStructure> = {},
): UseTimeRangeManagerReturnValue<TEnableAccessibleFieldDOMStructure> {
  const {
    enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure,
    dateSeparator,
    ampm,
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
      internal_useOpenPickerButtonAriaLabel: createUseOpenPickerButtonAriaLabel(ampm),
    }),
    [enableAccessibleFieldDOMStructure, dateSeparator, ampm],
  );
}

function createUseOpenPickerButtonAriaLabel(ampm: boolean | undefined) {
  return function useOpenPickerButtonAriaLabel() {
    const utils = useUtils();
    const translations = usePickerTranslations();
    const rangePositionContext = usePickerRangePositionContext();

    return React.useCallback(
      (value: PickerRangeValue) => {
        if (rangePositionContext == null) {
          return '';
        }

        const date = rangePositionContext.rangePosition === 'start' ? value[0] : value[1];
        const formatKey =
          (ampm ?? utils.is12HourCycleInCurrentLocale()) ? 'fullTime12h' : 'fullTime24h';
        const formattedValue = utils.isValid(date) ? utils.format(date, formatKey) : null;
        return translations.openTimeRangePickerDialogue(
          formattedValue,
          rangePositionContext.rangePosition,
        );
      },
      [rangePositionContext, translations, utils],
    );
  };
}

export interface UseTimeRangeManagerParameters<TEnableAccessibleFieldDOMStructure extends boolean>
  extends RangeFieldSeparatorProps,
    AmPmProps {
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

export interface TimeRangeManagerFieldInternalProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
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
