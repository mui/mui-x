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
import { usePickerAdapter, usePickerTranslations } from '../hooks';

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
      internal_useOpenPickerButtonAriaLabel: createUseOpenPickerButtonAriaLabel(ampm),
    }),
    [ampm],
  );
}

function createUseOpenPickerButtonAriaLabel(ampm: boolean | undefined) {
  return function useOpenPickerButtonAriaLabel(value: PickerValue) {
    const adapter = usePickerAdapter();
    const translations = usePickerTranslations();

    return React.useMemo(() => {
      const formatKey =
        (ampm ?? adapter.is12HourCycleInCurrentLocale()) ? 'fullTime12h' : 'fullTime24h';
      const formattedValue = adapter.isValid(value) ? adapter.format(value, formatKey) : null;
      return translations.openTimePickerDialogue(formattedValue);
    }, [value, translations, adapter]);
  };
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
