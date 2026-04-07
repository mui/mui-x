'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { PickerManager } from '@mui/x-date-pickers/models';
import { usePickerAdapter, usePickerTranslations } from '@mui/x-date-pickers/hooks';
import {
  AmPmProps,
  PickerManagerFieldInternalPropsWithDefaults,
  PickerRangeValue,
  UseFieldInternalProps,
  useApplyDefaultValuesToDateTimeValidationProps,
} from '@mui/x-date-pickers/internals';
import { DateTimeRangeValidationError, RangeFieldSeparatorProps } from '../models';
import { getRangeFieldValueManager, rangeValueManager } from '../internals/utils/valueManagers';
import { validateDateTimeRange } from '../validation';
import {
  ExportedValidateDateTimeRangeProps,
  ValidateDateTimeRangeProps,
} from '../validation/validateDateTimeRange';
import { formatRange } from '../internals/utils/date-utils';

export function useDateTimeRangeManager(
  parameters: UseDateTimeRangeManagerParameters = {},
): UseDateTimeRangeManagerReturnValue {
  const { dateSeparator } = parameters;

  return React.useMemo(
    () => ({
      valueType: 'date-time',
      validator: validateDateTimeRange,
      internal_valueManager: rangeValueManager,
      internal_fieldValueManager: getRangeFieldValueManager({ dateSeparator }),
      internal_useApplyDefaultValuesToFieldInternalProps:
        useApplyDefaultValuesToDateTimeRangeFieldInternalProps,
      internal_useOpenPickerButtonAriaLabel: useOpenPickerButtonAriaLabel,
    }),
    [dateSeparator],
  );
}

function useOpenPickerButtonAriaLabel(value: PickerRangeValue) {
  const adapter = usePickerAdapter();
  const translations = usePickerTranslations();

  return React.useMemo(() => {
    return translations.openRangePickerDialogue(formatRange(adapter, value, 'fullDate'));
  }, [value, translations, adapter]);
}

function useApplyDefaultValuesToDateTimeRangeFieldInternalProps(
  internalProps: DateTimeRangeManagerFieldInternalProps,
): PickerManagerFieldInternalPropsWithDefaults<UseDateTimeRangeManagerReturnValue> {
  const adapter = usePickerAdapter();
  const validationProps = useApplyDefaultValuesToDateTimeValidationProps(internalProps);

  const ampm = React.useMemo(
    () => internalProps.ampm ?? adapter.is12HourCycleInCurrentLocale(),
    [internalProps.ampm, adapter],
  );

  return React.useMemo(
    () => ({
      ...internalProps,
      ...validationProps,
      format:
        internalProps.format ??
        (ampm ? adapter.formats.keyboardDateTime12h : adapter.formats.keyboardDateTime24h),
    }),
    [internalProps, validationProps, ampm, adapter],
  );
}

export interface UseDateTimeRangeManagerParameters extends RangeFieldSeparatorProps {}

export type UseDateTimeRangeManagerReturnValue = PickerManager<
  PickerRangeValue,
  DateTimeRangeValidationError,
  ValidateDateTimeRangeProps,
  DateTimeRangeManagerFieldInternalProps
>;

export interface DateTimeRangeManagerFieldInternalProps
  extends
    MakeOptional<UseFieldInternalProps<PickerRangeValue, DateTimeRangeValidationError>, 'format'>,
    ExportedValidateDateTimeRangeProps,
    AmPmProps,
    RangeFieldSeparatorProps {}
