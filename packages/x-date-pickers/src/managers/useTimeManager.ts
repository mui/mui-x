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
import { useUtils } from '../internals/hooks/useUtils';
import { usePickerTranslations } from '../hooks/usePickerTranslations';

export function useTimeManager<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  parameters: UseTimeManagerParameters<TEnableAccessibleFieldDOMStructure> = {},
): UseTimeManagerReturnValue<TEnableAccessibleFieldDOMStructure> {
  const { enableAccessibleFieldDOMStructure = true as TEnableAccessibleFieldDOMStructure, ampm } =
    parameters;

  return React.useMemo(
    () => ({
      valueType: 'time',
      validator: validateTime,
      internal_valueManager: singleItemValueManager,
      internal_fieldValueManager: singleItemFieldValueManager,
      internal_enableAccessibleFieldDOMStructure: enableAccessibleFieldDOMStructure,
      internal_useApplyDefaultValuesToFieldInternalProps:
        useApplyDefaultValuesToTimeFieldInternalProps,
      internal_useOpenPickerButtonAriaLabel: createUseOpenPickerButtonAriaLabel(ampm),
    }),
    [ampm, enableAccessibleFieldDOMStructure],
  );
}

function createUseOpenPickerButtonAriaLabel(ampm: boolean | undefined) {
  return function useOpenPickerButtonAriaLabel(value: PickerValue) {
    const utils = useUtils();
    const translations = usePickerTranslations();

    return React.useMemo(() => {
      const formatKey =
        (ampm ?? utils.is12HourCycleInCurrentLocale()) ? 'fullTime12h' : 'fullTime24h';
      const formattedValue = utils.isValid(value) ? utils.format(value, formatKey) : null;
      return translations.openTimePickerDialogue(formattedValue);
    }, [value, translations, utils]);
  };
}

function useApplyDefaultValuesToTimeFieldInternalProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
>(
  internalProps: TimeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
): PickerManagerFieldInternalPropsWithDefaults<
  UseTimeManagerReturnValue<TEnableAccessibleFieldDOMStructure>
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

export interface UseTimeManagerParameters<TEnableAccessibleFieldDOMStructure extends boolean>
  extends AmPmProps {
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
}

export type UseTimeManagerReturnValue<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerManager<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    TimeValidationError,
    ValidateTimeProps,
    TimeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>
  >;

export interface TimeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<PickerValue, TEnableAccessibleFieldDOMStructure, TimeValidationError>,
      'format'
    >,
    ExportedValidateTimeProps,
    AmPmProps {}
