"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidation = useValidation;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var hooks_1 = require("../hooks");
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
function useValidation(options) {
    var props = options.props, validator = options.validator, value = options.value, timezone = options.timezone, onError = options.onError;
    var adapter = (0, hooks_1.usePickerAdapter)();
    var previousValidationErrorRef = React.useRef(validator.valueManager.defaultErrorState);
    var validationError = validator({ adapter: adapter, value: value, timezone: timezone, props: props });
    var hasValidationError = validator.valueManager.hasError(validationError);
    React.useEffect(function () {
        if (onError &&
            !validator.valueManager.isSameError(validationError, previousValidationErrorRef.current)) {
            onError(validationError, value);
        }
        previousValidationErrorRef.current = validationError;
    }, [validator, onError, validationError, value]);
    var getValidationErrorForNewValue = (0, useEventCallback_1.default)(function (newValue) {
        return validator({ adapter: adapter, value: newValue, timezone: timezone, props: props });
    });
    return { validationError: validationError, hasValidationError: hasValidationError, getValidationErrorForNewValue: getValidationErrorForNewValue };
}
