'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useLocalizationContext } from '../internals/hooks/useUtils';
import { MuiPickersAdapterContextValue } from '../LocalizationProvider/LocalizationProvider';
import { OnErrorProps, PickersTimezone } from '../models';
import type { PickerValueManager } from '../internals/hooks/usePicker';
import { PickerValidValue } from '../internals/models';

export type Validator<TValue extends PickerValidValue, TError, TValidationProps> = {
  (params: {
    adapter: MuiPickersAdapterContextValue;
    value: TValue;
    timezone: PickersTimezone;
    props: TValidationProps;
  }): TError;
  valueManager: PickerValueManager<TValue, any>;
};

interface UseValidationOptions<TValue extends PickerValidValue, TError, TValidationProps extends {}>
  extends OnErrorProps<TValue, TError> {
  /**
   * The value to validate.
   */
  value: TValue;
  /**
   * The timezone to use for the validation.
   */
  timezone: PickersTimezone;
  /**
   * The validator function to use.
   * They can be imported from `@mui/x-date-pickers/validation` and `@mui/x-date-pickers-pro/validation`.
   * It is recommended to only use the validator exported by the MUI X packages,
   * otherwise you may have inconsistent behaviors between the field and the views.
   */
  validator: Validator<TValue, TError, TValidationProps>;
  /**
   * The validation props, they differ depending on the component.
   * For example, the `validateTime` function supports `minTime`, `maxTime`, etc.
   */
  props: TValidationProps;
}

interface UseValidationReturnValue<TValue extends PickerValidValue, TError> {
  /**
   * The validation error associated to the value passed to the `useValidation` hook.
   */
  validationError: TError;
  /**
   * `true` if the current error is not null.
   * For single value components, it means that the value is invalid.
   * For range components, it means that either start or end value is invalid.
   */
  hasValidationError: boolean;
  /**
   * Get the validation error for a new value.
   * This can be used to validate the value in a change handler before updating the state.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @param {TValue} newValue The value to validate.
   * @returns {TError} The validation error associated to the new value.
   */
  getValidationErrorForNewValue: (newValue: TValue) => TError;
}

/**
 * Utility hook to check if a given value is valid based on the provided validation props.
 * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
 * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
 * @param {UseValidationOptions<TValue, TError, TValidationProps>} options The options to configure the hook.
 * @param {TValue} options.value The value to validate.
 * @param {PickersTimezone} options.timezone The timezone to use for the validation.
 * @param {Validator<TValue, TError, TValidationProps>} options.validator The validator function to use.
 * @param {TValidationProps} options.props The validation props, they differ depending on the component.
 * @param {(error: TError, value: TValue) => void} options.onError Callback fired when the error associated with the current value changes.
 */
export function useValidation<TValue extends PickerValidValue, TError, TValidationProps extends {}>(
  options: UseValidationOptions<TValue, TError, TValidationProps>,
): UseValidationReturnValue<TValue, TError> {
  const { props, validator, value, timezone, onError } = options;

  const adapter = useLocalizationContext();
  const previousValidationErrorRef = React.useRef<TError | null>(
    validator.valueManager.defaultErrorState,
  );

  const validationError = validator({ adapter, value, timezone, props });
  const hasValidationError = validator.valueManager.hasError(validationError);

  React.useEffect(() => {
    if (
      onError &&
      !validator.valueManager.isSameError(validationError, previousValidationErrorRef.current)
    ) {
      onError(validationError, value);
    }

    previousValidationErrorRef.current = validationError;
  }, [validator, onError, validationError, value]);

  const getValidationErrorForNewValue = useEventCallback((newValue: TValue) => {
    return validator({ adapter, value: newValue, timezone, props });
  });

  return { validationError, hasValidationError, getValidationErrorForNewValue };
}
