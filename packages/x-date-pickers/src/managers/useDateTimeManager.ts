'use client';
import * as React from 'react';
import type { MakeOptional } from '@mui/x-internals/types';
import { applyDefaultDate } from '../internals/utils/date-utils';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { PickerManager, DateTimeValidationError } from '../models';
import { validateDateTime } from '../validation';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { AmPmProps } from '../internals/models/props/time';
import {
  ExportedValidateDateTimeProps,
  ValidateDateTimeProps,
} from '../validation/validateDateTime';
import { PickerManagerFieldInternalPropsWithDefaults, PickerValue } from '../internals/models';
import { useDefaultDates } from '../internals/hooks/useUtils';
import { usePickerAdapter, usePickerTranslations } from '../hooks';

export function useDateTimeManager(): UseDateTimeManagerReturnValue {
  return React.useMemo(
    () => ({
      valueType: 'date-time',
      validator: validateDateTime,
      internal_valueManager: singleItemValueManager,
      internal_fieldValueManager: singleItemFieldValueManager,
      internal_useApplyDefaultValuesToFieldInternalProps:
        useApplyDefaultValuesToDateTimeFieldInternalProps,
      internal_useOpenPickerButtonAriaLabel: useOpenPickerButtonAriaLabel,
    }),
    [],
  );
}

function useOpenPickerButtonAriaLabel(value: PickerValue) {
  const adapter = usePickerAdapter();
  const translations = usePickerTranslations();

  return React.useMemo(() => {
    const formattedValue = adapter.isValid(value) ? adapter.format(value, 'fullDate') : null;
    return translations.openDatePickerDialogue(formattedValue);
  }, [value, translations, adapter]);
}

function useApplyDefaultValuesToDateTimeFieldInternalProps(
  internalProps: DateTimeManagerFieldInternalProps,
): PickerManagerFieldInternalPropsWithDefaults<UseDateTimeManagerReturnValue> {
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

type SharedDateTimeAndDateTimeRangeValidationProps =
  | 'disablePast'
  | 'disableFuture'
  | 'minTime'
  | 'maxTime'
  | 'minDate'
  | 'maxDate';

export function useApplyDefaultValuesToDateTimeValidationProps(
  props: Pick<
    ExportedValidateDateTimeProps,
    SharedDateTimeAndDateTimeRangeValidationProps | 'minDateTime' | 'maxDateTime'
  >,
): Pick<ValidateDateTimeProps, SharedDateTimeAndDateTimeRangeValidationProps> {
  const adapter = usePickerAdapter();
  const defaultDates = useDefaultDates();

  return React.useMemo(
    () => ({
      disablePast: props.disablePast ?? false,
      disableFuture: props.disableFuture ?? false,
      // TODO: Explore if we can remove it from the public API
      disableIgnoringDatePartForTimeValidation:
        !!props.minDateTime || !!props.maxDateTime || !!props.disableFuture || !!props.disablePast,
      minDate: applyDefaultDate(adapter, props.minDateTime ?? props.minDate, defaultDates.minDate),
      maxDate: applyDefaultDate(adapter, props.maxDateTime ?? props.maxDate, defaultDates.maxDate),
      minTime: props.minDateTime ?? props.minTime,
      maxTime: props.maxDateTime ?? props.maxTime,
    }),
    [
      props.minDateTime,
      props.maxDateTime,
      props.minTime,
      props.maxTime,
      props.minDate,
      props.maxDate,
      props.disableFuture,
      props.disablePast,
      adapter,
      defaultDates,
    ],
  );
}

export type UseDateTimeManagerReturnValue = PickerManager<
  PickerValue,
  DateTimeValidationError,
  ValidateDateTimeProps,
  DateTimeManagerFieldInternalProps
>;

export interface DateTimeManagerFieldInternalProps
  extends
    MakeOptional<UseFieldInternalProps<PickerValue, DateTimeValidationError>, 'format'>,
    ExportedValidateDateTimeProps,
    AmPmProps {}
