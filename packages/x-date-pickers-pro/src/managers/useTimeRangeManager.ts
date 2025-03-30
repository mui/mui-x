'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { PickerManager } from '@mui/x-date-pickers/models';
import { usePickerTranslations } from '@mui/x-date-pickers/hooks';
import {
  AmPmProps,
  PickerManagerFieldInternalPropsWithDefaults,
  PickerRangeValue,
  UseFieldInternalProps,
  useApplyDefaultValuesToTimeValidationProps,
  useUtils,
} from '@mui/x-date-pickers/internals';
import { TimeRangeValidationError, RangeFieldSeparatorProps } from '../models';
import { getRangeFieldValueManager, rangeValueManager } from '../internals/utils/valueManagers';
import { validateTimeRange } from '../validation';
import {
  ExportedValidateTimeRangeProps,
  ValidateTimeRangeProps,
} from '../validation/validateTimeRange';
import { formatRange } from '../internals/utils/date-utils';

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
      internal_useApplyDefaultValuesToFieldInternalProps:
        useApplyDefaultValuesToTimeRangeFieldInternalProps,
      internal_useOpenPickerButtonAriaLabel: createUseOpenPickerButtonAriaLabel(ampm),
    }),
    [enableAccessibleFieldDOMStructure, dateSeparator, ampm],
  );
}

function createUseOpenPickerButtonAriaLabel(ampm: boolean | undefined) {
  return function useOpenPickerButtonAriaLabel(value: PickerRangeValue) {
    const utils = useUtils();
    const translations = usePickerTranslations();

    return React.useMemo(() => {
      const formatKey =
        (ampm ?? utils.is12HourCycleInCurrentLocale()) ? 'fullTime12h' : 'fullTime24h';

      return translations.openRangePickerDialogue(formatRange(utils, value, formatKey));
    }, [value, translations, utils]);
  };
}

function useApplyDefaultValuesToTimeRangeFieldInternalProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
>(
  internalProps: TimeRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
): PickerManagerFieldInternalPropsWithDefaults<
  UseTimeRangeManagerReturnValue<TEnableAccessibleFieldDOMStructure>
> {
  const utils = useUtils();
  const validationProps = useApplyDefaultValuesToTimeValidationProps(internalProps);

  const ampm = React.useMemo(
    () => internalProps.ampm ?? utils.is12HourCycleInCurrentLocale(),
    [internalProps.ampm, utils],
  );

  return React.useMemo(
    () => ({
      ...internalProps,
      ...validationProps,
      format:
        internalProps.format ?? (ampm ? utils.formats.fullTime12h : utils.formats.fullTime24h),
    }),
    [internalProps, validationProps, ampm, utils],
  );
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
    ValidateTimeRangeProps,
    TimeRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>
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
