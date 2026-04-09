'use client';
import * as React from 'react';
import {
  PickerManagerEnableAccessibleFieldDOMStructure,
  PickerManagerError,
  PickerManagerFieldInternalProps,
  useControlledValue,
  useFieldInternalPropsWithDefaults,
  UseFieldReturnValue,
  usePickerPrivateContext,
} from '@mui/x-date-pickers/internals';
import { useValidation } from '@mui/x-date-pickers/validation';
import { UseTextFieldBaseForwardedProps, useTextFieldProps } from './useTextFieldProps';
import { useMultiInputRangeFieldSelectedSections } from './useMultiInputRangeFieldSelectedSections';
import { PickerAnyRangeManager } from '../../internals/models/managers';
import {
  useMultiInputRangeFieldRootProps,
  UseMultiInputRangeFieldRootPropsReturnValue,
} from './useMultiInputRangeFieldRootProps';

/**
 * Basic example:
 *
 * ```tsx
 * import Box from '@mui/material/Box';
 * import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
 * import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
 * import { useDateRangeManager } from '@mui/x-date-pickers-pro/managers';
 *
 * function MultiInputField(props) {
 *   const manager = useDateRangeManager();
 *   const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
 *   const response = useMultiInputRangeField({
 *     manager,
 *     internalProps,
 *     startTextFieldProps: {},
 *     endTextFieldProps: {},
 *     rootProps: forwardedProps,
 *   });
 *
 *   return (
 *     <Box {...response.root}>
 *       <PickersTextField {...response.startTextField} />
 *       <span>{' – '}</span>
 *       <PickersTextField {...response.endTextField} />
 *     </Box>
 *   );
 * }
 * ```
 *
 * @param {UseMultiInputRangeFieldParameters<TManager, TTextFieldProps, TRootProps>} parameters The parameters of the hook.
 * @param {TManager} parameters.manager The manager of the field.
 * @param {PickerManagerFieldInternalProps<TManager>} parameters.internalProps The internal props of the field.
 * @param {TTextFieldProps} parameters.startForwardedProps The forwarded props of the start field.
 * @param {TTextFieldProps} parameters.endForwardedProps The forwarded props of the end field.
 * @returns {UseMultiInputRangeFieldReturnValue<TTextFieldProps, TRootProps>} The props to pass to the start and the end components.
 */
export function useMultiInputRangeField<
  TManager extends PickerAnyRangeManager,
  TTextFieldProps extends UseTextFieldBaseForwardedProps,
  TRootProps extends { [key: string]: any },
>(
  parameters: UseMultiInputRangeFieldParameters<TManager, TTextFieldProps, TRootProps>,
): UseMultiInputRangeFieldReturnValue<TTextFieldProps, TRootProps> {
  type TError = PickerManagerError<TManager>;
  const { manager, internalProps, rootProps, startTextFieldProps, endTextFieldProps } = parameters;

  const internalPropsWithDefaults = useFieldInternalPropsWithDefaults({
    manager,
    internalProps,
  });

  const {
    value: valueProp,
    defaultValue,
    format,
    formatDensity,
    shouldRespectLeadingZeros,
    onChange,
    disabled,
    readOnly,
    selectedSections,
    onSelectedSectionsChange,
    timezone: timezoneProp,
    autoFocus,
    referenceDate,
    startFieldRef,
    endFieldRef,
  } = internalPropsWithDefaults;

  const { value, handleValueChange, timezone } = useControlledValue({
    name: 'useMultiInputRangeField',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate,
    onChange,
    valueManager: manager.internal_valueManager,
  });

  const { isPartiallyFilled } = usePickerPrivateContext();

  const validation = useValidation({
    props: internalPropsWithDefaults,
    value,
    timezone,
    validator: manager.validator,
    isPartiallyFilled,
    onError: internalPropsWithDefaults.onError,
  });

  const selectedSectionsResponse = useMultiInputRangeFieldSelectedSections({
    selectedSections,
    onSelectedSectionsChange,
    startFieldRef,
    endFieldRef,
  });

  const sharedInternalProps = {
    disabled,
    readOnly,
    timezone,
    format,
    formatDensity,
    shouldRespectLeadingZeros,
  };

  const rootResponse = useMultiInputRangeFieldRootProps(rootProps);

  const startOnError = React.useCallback(
    (error: any, val: any) => {
      internalPropsWithDefaults.onError?.(
        [error, validation.validationError[1]],
        [val, internalPropsWithDefaults.value?.[1] ?? null],
      );
    },
    [internalPropsWithDefaults, validation.validationError],
  );

  const endOnError = React.useCallback(
    (error: any, val: any) => {
      internalPropsWithDefaults.onError?.(
        [validation.validationError[0], error],
        [internalPropsWithDefaults.value?.[0] ?? null, val],
      );
    },
    [internalPropsWithDefaults, validation.validationError],
  );

  const startTextFieldResponse = useTextFieldProps<TManager, TTextFieldProps, TError>({
    valueType: manager.valueType,
    position: 'start',
    value,
    onChange: handleValueChange,
    autoFocus,
    validation,
    forwardedProps: startTextFieldProps,
    selectedSectionProps: selectedSectionsResponse.start,
    sharedInternalProps,
    isPartiallyFilled,
    onError: startOnError,
  });

  const endTextFieldResponse = useTextFieldProps<TManager, TTextFieldProps, TError>({
    valueType: manager.valueType,
    position: 'end',
    value,
    onChange: handleValueChange,
    autoFocus,
    validation,
    forwardedProps: endTextFieldProps,
    selectedSectionProps: selectedSectionsResponse.end,
    sharedInternalProps,
    isPartiallyFilled,
    onError: endOnError,
  });

  return {
    root: rootResponse,
    startTextField: startTextFieldResponse,
    endTextField: endTextFieldResponse,
  };
}

interface UseMultiInputRangeFieldParameters<
  TManager extends PickerAnyRangeManager,
  TTextFieldProps extends { [key: string]: any },
  TRootProps extends { [key: string]: any },
> {
  manager: TManager;
  internalProps: PickerManagerFieldInternalProps<TManager>;
  rootProps: TRootProps;
  startTextFieldProps: TTextFieldProps;
  endTextFieldProps: TTextFieldProps;
}

interface UseMultiInputRangeFieldReturnValue<
  TTextFieldProps extends { [key: string]: any },
  TRootProps extends { [key: string]: any },
> {
  root: UseMultiInputRangeFieldRootPropsReturnValue<TRootProps>;
  startTextField: UseMultiInputRangeFieldTextFieldProps<TTextFieldProps>;
  endTextField: UseMultiInputRangeFieldTextFieldProps<TTextFieldProps>;
}

export type UseMultiInputRangeFieldTextFieldProps<
  TForwardedProps extends UseTextFieldBaseForwardedProps = UseTextFieldBaseForwardedProps,
> = Omit<
  UseFieldReturnValue<
    TForwardedProps & {
      onKeyDown: React.KeyboardEventHandler;
      onClick: React.MouseEventHandler;
      onFocus: React.FocusEventHandler;
      id: string;
    }
  >,
  'onClear' | 'clearable' | 'openPickerAriaLabel'
>;
