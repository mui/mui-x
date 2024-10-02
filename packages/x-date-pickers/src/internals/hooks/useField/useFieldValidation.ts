import * as React from 'react';
import { UseFieldForwardedProps, UseFieldInternalProps } from './useField.types';
import { FieldSection, PickerValidDate } from '../../../models';
import { UseFieldStateResponse } from './useFieldState';
import { useValidation, Validator } from '../../../validation';

export const useFieldValidation = <
  TValue,
  TDate extends PickerValidDate,
  TSection extends FieldSection,
>(
  parameters: UseFieldValidationParameters<TValue, TDate, TSection>,
) => {
  const {
    internalProps,
    forwardedProps: { error: errorProp },
    stateResponse: { state, timezone },
    validator,
  } = parameters;

  const { hasValidationError } = useValidation({
    props: internalProps,
    validator,
    timezone,
    value: state.value,
    onError: internalProps.onError,
  });

  const error = React.useMemo(() => {
    // only override when `error` is undefined.
    // in case of multi input fields, the `error` value is provided externally and will always be defined.
    if (errorProp !== undefined) {
      return errorProp;
    }

    return hasValidationError;
  }, [hasValidationError, errorProp]);

  return error;
};

interface UseFieldValidationParameters<
  TValue,
  TDate extends PickerValidDate,
  TSection extends FieldSection,
> {
  forwardedProps: UseFieldForwardedProps<true>;
  internalProps: UseFieldInternalProps<TValue, TDate, TSection, true, unknown>;
  stateResponse: UseFieldStateResponse<TValue, TDate, TSection>;
  validator: Validator<
    TValue,
    TDate,
    unknown,
    UseFieldInternalProps<TValue, TDate, TSection, true, unknown>
  >;
}
