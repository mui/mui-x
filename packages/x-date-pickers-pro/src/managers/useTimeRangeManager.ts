'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { PickerManager } from '@mui/x-date-pickers/models';
import { usePickerAdapter } from '@mui/x-date-pickers/hooks';
import {
  AmPmProps,
  PickerManagerFieldInternalPropsWithDefaults,
  PickerRangeValue,
  UseFieldInternalProps,
  useApplyDefaultValuesToTimeValidationProps,
  createUseOpenPickerButtonAriaLabel,
} from '@mui/x-date-pickers/internals';
import { TimeRangeValidationError, RangeFieldSeparatorProps } from '../models';
import { getRangeFieldValueManager, rangeValueManager } from '../internals/utils/valueManagers';
import { validateTimeRange } from '../validation';
import {
  ExportedValidateTimeRangeProps,
  ValidateTimeRangeProps,
} from '../validation/validateTimeRange';
import { formatRange } from '../internals/utils/date-utils';

export function useTimeRangeManager(
  parameters: UseTimeRangeManagerParameters = {},
): UseTimeRangeManagerReturnValue {
  const { dateSeparator, ampm } = parameters;

  return React.useMemo(
    () => ({
      valueType: 'time',
      validator: validateTimeRange,
      internal_valueManager: rangeValueManager,
      internal_fieldValueManager: getRangeFieldValueManager({ dateSeparator }),
      internal_useApplyDefaultValuesToFieldInternalProps:
        useApplyDefaultValuesToTimeRangeFieldInternalProps,
      internal_useOpenPickerButtonAriaLabel: createUseOpenPickerButtonAriaLabel<PickerRangeValue>({
        formatValue: (adapter, value) => {
          const formatKey =
            (ampm ?? adapter.is12HourCycleInCurrentLocale()) ? 'fullTime12h' : 'fullTime24h';
          return formatRange(adapter, value, formatKey);
        },
        translationKey: 'openRangePickerDialogue',
      }),
    }),
    [dateSeparator, ampm],
  );
}

function useApplyDefaultValuesToTimeRangeFieldInternalProps(
  internalProps: TimeRangeManagerFieldInternalProps,
): PickerManagerFieldInternalPropsWithDefaults<UseTimeRangeManagerReturnValue> {
  const adapter = usePickerAdapter();
  const validationProps = useApplyDefaultValuesToTimeValidationProps(internalProps);

  const ampm = React.useMemo(
    () => internalProps.ampm ?? adapter.is12HourCycleInCurrentLocale(),
    [internalProps.ampm, adapter],
  );

  return React.useMemo(
    () => ({
      ...internalProps,
      ...validationProps,
      format:
        internalProps.format ?? (ampm ? adapter.formats.fullTime12h : adapter.formats.fullTime24h),
    }),
    [internalProps, validationProps, ampm, adapter],
  );
}

export interface UseTimeRangeManagerParameters extends RangeFieldSeparatorProps, AmPmProps {}

export type UseTimeRangeManagerReturnValue = PickerManager<
  PickerRangeValue,
  TimeRangeValidationError,
  ValidateTimeRangeProps,
  TimeRangeManagerFieldInternalProps
>;

export interface TimeRangeManagerFieldInternalProps
  extends
    MakeOptional<UseFieldInternalProps<PickerRangeValue, TimeRangeValidationError>, 'format'>,
    ExportedValidateTimeRangeProps,
    AmPmProps,
    RangeFieldSeparatorProps {}
