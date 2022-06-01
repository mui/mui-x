import * as React from 'react';
import { useLocalizationContext } from '../useUtils';
import { MuiPickersAdapterContextValue } from '../../../LocalizationProvider/LocalizationProvider';

export interface ValidationProps<TError, TInputValue> {
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
type InferError<Props> = Props extends ValidationProps<infer TError, any> ? TError : never;
type InferDate<Props> = Props extends ValidationProps<any, infer TDate> ? TDate : never;

export type Validator<TDate, TProps> = (params: {
  adapter: MuiPickersAdapterContextValue<TDate>;
  value: InferDate<TProps>;
  props: Omit<TProps, 'value' | 'onError'>;
}) => InferError<TProps>;

export function useValidation<TDate, TProps extends ValidationProps<any, any>>(
  props: TProps,
  validate: Validator<TDate, TProps>,
  isSameError: (a: InferError<TProps>, b: InferError<TProps> | null) => boolean,
): InferError<TProps> {
  const { value, onError } = props;
  const adapter = useLocalizationContext<TDate>();
  const previousValidationErrorRef = React.useRef<InferError<TProps> | null>(null);

  const validationError = validate({ adapter, value, props });

  React.useEffect(() => {
    if (onError && !isSameError(validationError, previousValidationErrorRef.current)) {
      onError(validationError, value);
    }

    previousValidationErrorRef.current = validationError;
  }, [isSameError, onError, previousValidationErrorRef, validationError, value]);

  return validationError;
}
