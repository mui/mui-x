import * as React from 'react';
import { useLocalizationContext } from './useUtils';
import { MuiPickersAdapterContextValue } from '../../LocalizationProvider/LocalizationProvider';
import { PickerValidDate } from '../../models';

interface ValidationCommonProps<TError, TValue> {
  /**
   * Callback fired when the error associated with the current value changes.
   * When a validation error is detected, the `error` parameter contains a non-null value.
   * This can be used to render an appropriate form error.
   * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @param {TError} error The reason why the current value is not valid.
   * @param {TValue} value The value associated with the error.
   */
  onError?: (error: TError, value: TValue) => void;
  value: TValue;
}

export type ValidationProps<TError, TValue, TValidationProps extends {}> = ValidationCommonProps<
  TError,
  TValue
> &
  TValidationProps;

export type InferError<TProps> =
  TProps extends Pick<ValidationCommonProps<any, any>, 'onError'>
    ? Parameters<Exclude<TProps['onError'], undefined>>[0]
    : never;

export type Validator<TValue, TDate extends PickerValidDate, TError, TValidationProps> = (params: {
  adapter: MuiPickersAdapterContextValue<TDate>;
  value: TValue;
  props: Omit<TValidationProps, 'value' | 'onError'>;
}) => TError;

export function useValidation<
  TValue,
  TDate extends PickerValidDate,
  TError,
  TValidationProps extends {},
>(
  props: ValidationProps<TError, TValue, TValidationProps>,
  validate: Validator<TValue, TDate, TError, TValidationProps>,
  isSameError: (a: TError, b: TError | null) => boolean,
  defaultErrorState: TError,
): TError {
  const { value, onError } = props;
  const adapter = useLocalizationContext<TDate>();
  const previousValidationErrorRef = React.useRef<TError | null>(defaultErrorState);

  const validationError = validate({ adapter, value, props });

  React.useEffect(() => {
    if (onError && !isSameError(validationError, previousValidationErrorRef.current)) {
      onError(validationError, value);
    }

    previousValidationErrorRef.current = validationError;
  }, [isSameError, onError, previousValidationErrorRef, validationError, value]);

  return validationError;
}
