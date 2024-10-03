import * as React from 'react';
import { UseFieldForwardedProps, UseFieldInternalProps } from './useField.types';
import { PickerAnyValueManagerV8 } from '../../../models';
import { UseFieldStateResponse } from './useFieldState';
import { useValidation } from '../../../validation';

export const useFieldValidation = <TManager extends PickerAnyValueManagerV8>(
  parameters: UseFieldValidationParameters<TManager>,
) => {
  const {
    internalProps,
    forwardedProps: { error: errorProp },
    stateResponse: { state, timezone },
    valueManager: { validator },
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

interface UseFieldValidationParameters<TManager extends PickerAnyValueManagerV8> {
  forwardedProps: UseFieldForwardedProps<true>;
  internalProps: UseFieldInternalProps<TManager>;
  stateResponse: UseFieldStateResponse<TManager>;
  valueManager: TManager;
}
