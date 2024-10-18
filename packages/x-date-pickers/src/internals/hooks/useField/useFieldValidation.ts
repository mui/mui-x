import * as React from 'react';
import { UseFieldForwardedProps, UseFieldInternalPropsFromManager } from './useField.types';
import { PickerAnyValueManagerV8 } from '../../../models';
import { UseFieldStateReturnValue } from './useFieldState';
import { useValidation } from '../../../validation';

export const useFieldValidation = <TManager extends PickerAnyValueManagerV8>(
  parameters: UseFieldValidationParameters<TManager>,
) => {
  const {
    internalPropsWithDefaults,
    forwardedProps: { error: errorProp },
    stateResponse: { state, timezone },
    valueManager: { validator },
  } = parameters;

  const { hasValidationError } = useValidation({
    props: internalPropsWithDefaults,
    validator,
    timezone,
    value: state.value,
    onError: internalPropsWithDefaults.onError,
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

interface UseFieldValidationParameters<TManager extends PickerAnyValueManagerV8> {
  forwardedProps: UseFieldForwardedProps<true>;
  internalPropsWithDefaults: UseFieldInternalPropsFromManager<TManager>;
  stateResponse: UseFieldStateReturnValue<TManager>;
  valueManager: TManager;
}
