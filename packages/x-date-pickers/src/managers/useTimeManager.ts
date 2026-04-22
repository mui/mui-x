'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { PickerManager, TimeValidationError } from '../models';
import { validateTime } from '../validation';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { AmPmProps } from '../internals/models/props/time';
import { ExportedValidateTimeProps, ValidateTimeProps } from '../validation/validateTime';
import { PickerManagerFieldInternalPropsWithDefaults, PickerValue } from '../internals/models';
import { usePickerAdapter } from '../hooks';
import { createUseOpenPickerButtonAriaLabel } from './useOpenPickerButtonAriaLabel';

export function useTimeManager(
  parameters: UseTimeManagerParameters = {},
): UseTimeManagerReturnValue {
  const { ampm } = parameters;

  return React.useMemo(
    () => ({
      valueType: 'time',
      validator: validateTime,
      internal_valueManager: singleItemValueManager,
      internal_fieldValueManager: singleItemFieldValueManager,
      internal_useApplyDefaultValuesToFieldInternalProps:
        useApplyDefaultValuesToTimeFieldInternalProps,
      internal_useOpenPickerButtonAriaLabel: createUseOpenPickerButtonAriaLabel<PickerValue>({
        formatValue: (adapter, value) => {
          const formatKey =
            (ampm ?? adapter.is12HourCycleInCurrentLocale()) ? 'fullTime12h' : 'fullTime24h';
          return adapter.isValid(value) ? adapter.format(value, formatKey) : null;
        },
        translationKey: 'openTimePickerDialogue',
      }),
    }),
    [ampm],
  );
}

function useApplyDefaultValuesToTimeFieldInternalProps(
  internalProps: TimeManagerFieldInternalProps,
): PickerManagerFieldInternalPropsWithDefaults<UseTimeManagerReturnValue> {
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

type SharedTimeAndTimeRangeValidationProps = 'disablePast' | 'disableFuture';

export function useApplyDefaultValuesToTimeValidationProps(
  props: Pick<ExportedValidateTimeProps, SharedTimeAndTimeRangeValidationProps>,
): Pick<ValidateTimeProps, SharedTimeAndTimeRangeValidationProps> {
  return React.useMemo(
    () => ({
      disablePast: props.disablePast ?? false,
      disableFuture: props.disableFuture ?? false,
    }),
    [props.disablePast, props.disableFuture],
  );
}

export interface UseTimeManagerParameters extends AmPmProps {}

export type UseTimeManagerReturnValue = PickerManager<
  PickerValue,
  TimeValidationError,
  ValidateTimeProps,
  TimeManagerFieldInternalProps
>;

export interface TimeManagerFieldInternalProps
  extends
    MakeOptional<UseFieldInternalProps<PickerValue, TimeValidationError>, 'format'>,
    ExportedValidateTimeProps,
    AmPmProps {}
