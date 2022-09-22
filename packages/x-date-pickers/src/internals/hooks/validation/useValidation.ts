import * as React from 'react';
import { useLocalizationContext } from '../useUtils';
import { MuiPickersAdapterContextValue } from '../../../LocalizationProvider/LocalizationProvider';

export interface ValidationCommonProps<TError, TInputValue> {
  /**
   * Callback that fired when input value or new `value` prop validation returns **new** validation error (or value is valid after error).
   * In case of validation error detected `reason` prop return non-null value and `TextField` must be displayed in `error` state.
   * This can be used to render appropriate form error.
   *
   * [Read the guide](https://next.material-ui-pickers.dev/guides/forms) about form integration and error displaying.
   * @DateIOType
   *
   * @template TError, TInputValue
   * @param {TError} reason The reason why the current value is not valid.
   * @param {TInputValue} value The invalid value.
   */
  onError?: (reason: TError, value: TInputValue) => void;
  value: TInputValue;
}

export type ValidationProps<
  TError,
  TInputValue,
  TValidationProps extends {},
> = ValidationCommonProps<TError, TInputValue> & TValidationProps;

export type InferError<TProps> = TProps extends Pick<ValidationCommonProps<any, any>, 'onError'>
  ? Parameters<Exclude<TProps['onError'], undefined>>[0]
  : never;

export type Validator<TInputValue, TDate, TError, TValidationProps> = (params: {
  adapter: MuiPickersAdapterContextValue<TDate>;
  value: TInputValue;
  props: Omit<TValidationProps, 'value' | 'onError'>;
}) => TError;

export function useValidation<TInputValue, TDate, TError, TValidationProps extends {}>(
  props: ValidationProps<TError, TInputValue, TValidationProps>,
  validate: Validator<TInputValue, TDate, TError, TValidationProps>,
  isSameError: (a: TError, b: TError | null) => boolean,
): TError {
  const { value, onError } = props;
  const adapter = useLocalizationContext<TDate>();
  const previousValidationErrorRef = React.useRef<TError | null>(null);

  const validationError = validate({ adapter, value, props });

  React.useEffect(() => {
    if (onError && !isSameError(validationError, previousValidationErrorRef.current)) {
      onError(validationError, value);
    }

    previousValidationErrorRef.current = validationError;
  }, [isSameError, onError, previousValidationErrorRef, validationError, value]);

  return validationError;
}
