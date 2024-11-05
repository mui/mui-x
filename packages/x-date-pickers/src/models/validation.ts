import type { InferPickerValue } from '../internals/models';

/**
 * Validation error types applicable to both date and time validation
 */
type CommonDateTimeValidationError = 'invalidDate' | 'disableFuture' | 'disablePast' | null;

export type DateValidationError =
  | CommonDateTimeValidationError
  | 'shouldDisableDate'
  | 'shouldDisableMonth'
  | 'shouldDisableYear'
  | 'minDate'
  | 'maxDate';

export type TimeValidationError =
  | CommonDateTimeValidationError
  | 'minutesStep'
  | 'minTime'
  | 'maxTime'
  | 'shouldDisableTime-hours'
  | 'shouldDisableTime-minutes'
  | 'shouldDisableTime-seconds';

export type DateTimeValidationError = DateValidationError | TimeValidationError;

export interface OnErrorProps<TIsRange extends boolean, TError> {
  /**
   * Callback fired when the error associated with the current value changes.
   * When a validation error is detected, the `error` parameter contains a non-null value.
   * This can be used to render an appropriate form error.
   * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
   * @template TIsRange `true` if the value comes from a range picker, `false` otherwise.
   * @param {TError} error The reason why the current value is not valid.
   * @param {InferPickerValue<TIsRange>} value The value associated with the error.
   */
  onError?: (error: TError, value: InferPickerValue<TIsRange>) => void;
}

export type InferError<TProps> = TProps extends { onError?: (error: any, value: any) => void }
  ? Parameters<Exclude<TProps['onError'], undefined>>[0]
  : never;
