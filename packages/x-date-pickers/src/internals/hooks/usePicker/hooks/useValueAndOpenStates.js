"use strict";
'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValueAndOpenStates = useValueAndOpenStates;
var React = require("react");
var warning_1 = require("@mui/x-internals/warning");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useControlledValue_1 = require("../../useControlledValue");
var usePickerAdapter_1 = require("../../../../hooks/usePickerAdapter");
var validation_1 = require("../../../../validation");
function useValueAndOpenStates(parameters) {
    var props = parameters.props, valueManager = parameters.valueManager, validator = parameters.validator;
    var valueProp = props.value, defaultValueProp = props.defaultValue, onChange = props.onChange, referenceDate = props.referenceDate, timezoneProp = props.timezone, onAccept = props.onAccept, closeOnSelect = props.closeOnSelect, openProp = props.open, onOpen = props.onOpen, onClose = props.onClose;
    var defaultValue = React.useRef(defaultValueProp).current;
    var isValueControlled = React.useRef(valueProp !== undefined).current;
    var isOpenControlled = React.useRef(openProp !== undefined).current;
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    if (process.env.NODE_ENV !== 'production') {
        if (props.renderInput != null) {
            (0, warning_1.warnOnce)([
                'MUI X: The `renderInput` prop has been removed in version 6.0 of the Date and Time Pickers.',
                'You can replace it with the `textField` component slot in most cases.',
                'For more information, please have a look at the migration guide (https://mui.com/x/migration/migration-pickers-v5/#input-renderer-required-in-v5).',
            ]);
        }
    }
    /* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
    if (process.env.NODE_ENV !== 'production') {
        React.useEffect(function () {
            if (isValueControlled !== (valueProp !== undefined)) {
                console.error([
                    "MUI X: A component is changing the ".concat(isValueControlled ? '' : 'un', "controlled value of a Picker to be ").concat(isValueControlled ? 'un' : '', "controlled."),
                    'Elements should not switch from uncontrolled to controlled (or vice versa).',
                    "Decide between using a controlled or uncontrolled value" +
                        'for the lifetime of the component.',
                    "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
                    'More info: https://fb.me/react-controlled-components',
                ].join('\n'));
            }
        }, [valueProp]);
        React.useEffect(function () {
            if (!isValueControlled && defaultValue !== defaultValueProp) {
                console.error([
                    "MUI X: A component is changing the defaultValue of an uncontrolled Picker after being initialized. " +
                        "To suppress this warning opt to use a controlled value.",
                ].join('\n'));
            }
        }, [JSON.stringify(defaultValue)]);
    }
    /* eslint-enable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
    var _a = (0, useControlledValue_1.useControlledValue)({
        name: 'a picker component',
        timezone: timezoneProp,
        value: valueProp,
        defaultValue: defaultValue,
        referenceDate: referenceDate,
        onChange: onChange,
        valueManager: valueManager,
    }), timezone = _a.timezone, value = _a.value, handleValueChange = _a.handleValueChange;
    var _b = React.useState(function () { return ({
        open: false,
        lastExternalValue: value,
        clockShallowValue: undefined,
        lastCommittedValue: value,
        hasBeenModifiedSinceMount: false,
    }); }), state = _b[0], setState = _b[1];
    var getValidationErrorForNewValue = (0, validation_1.useValidation)({
        props: props,
        validator: validator,
        timezone: timezone,
        value: value,
        onError: props.onError,
    }).getValidationErrorForNewValue;
    var setOpen = (0, useEventCallback_1.default)(function (action) {
        var newOpen = typeof action === 'function' ? action(state.open) : action;
        if (!isOpenControlled) {
            setState(function (prevState) { return (__assign(__assign({}, prevState), { open: newOpen })); });
        }
        if (newOpen && onOpen) {
            onOpen();
        }
        if (!newOpen) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
        }
    });
    var setValue = (0, useEventCallback_1.default)(function (newValue, options) {
        var _a = options !== null && options !== void 0 ? options : {}, _b = _a.changeImportance, changeImportance = _b === void 0 ? 'accept' : _b, _c = _a.skipPublicationIfPristine, skipPublicationIfPristine = _c === void 0 ? false : _c, validationError = _a.validationError, shortcut = _a.shortcut, _d = _a.shouldClose, shouldClose = _d === void 0 ? changeImportance === 'accept' : _d;
        var shouldFireOnChange;
        var shouldFireOnAccept;
        if (!skipPublicationIfPristine && !isValueControlled && !state.hasBeenModifiedSinceMount) {
            // If the value is not controlled and the value has never been modified before,
            // Then clicking on any value (including the one equal to `defaultValue`) should call `onChange` and `onAccept`
            shouldFireOnChange = true;
            shouldFireOnAccept = changeImportance === 'accept';
        }
        else {
            shouldFireOnChange = !valueManager.areValuesEqual(adapter, newValue, value);
            shouldFireOnAccept =
                changeImportance === 'accept' &&
                    !valueManager.areValuesEqual(adapter, newValue, state.lastCommittedValue);
        }
        setState(function (prevState) { return (__assign(__assign({}, prevState), { 
            // We reset the shallow value whenever we fire onChange.
            clockShallowValue: shouldFireOnChange ? undefined : prevState.clockShallowValue, lastCommittedValue: shouldFireOnAccept ? newValue : prevState.lastCommittedValue, hasBeenModifiedSinceMount: true })); });
        var cachedContext = null;
        var getContext = function () {
            if (!cachedContext) {
                cachedContext = {
                    validationError: validationError == null ? getValidationErrorForNewValue(newValue) : validationError,
                };
                if (shortcut) {
                    cachedContext.shortcut = shortcut;
                }
            }
            return cachedContext;
        };
        if (shouldFireOnChange) {
            handleValueChange(newValue, getContext());
        }
        if (shouldFireOnAccept && onAccept) {
            onAccept(newValue, getContext());
        }
        if (shouldClose) {
            setOpen(false);
        }
    });
    // If `prop.value` changes, we update the state to reflect the new value
    if (value !== state.lastExternalValue) {
        setState(function (prevState) { return (__assign(__assign({}, prevState), { lastExternalValue: value, clockShallowValue: undefined, hasBeenModifiedSinceMount: true })); });
    }
    var setValueFromView = (0, useEventCallback_1.default)(function (newValue, selectionState) {
        if (selectionState === void 0) { selectionState = 'partial'; }
        // TODO: Expose a new method (private?) like `setView` that only updates the clock shallow value.
        if (selectionState === 'shallow') {
            setState(function (prev) { return (__assign(__assign({}, prev), { clockShallowValue: newValue, hasBeenModifiedSinceMount: true })); });
            return;
        }
        setValue(newValue, {
            changeImportance: selectionState === 'finish' && closeOnSelect ? 'accept' : 'set',
        });
    });
    // It is required to update inner state in useEffect in order to avoid situation when
    // Our component is not mounted yet, but `open` state is set to `true` (for example initially opened)
    React.useEffect(function () {
        if (isOpenControlled) {
            if (openProp === undefined) {
                throw new Error('You must not mix controlling and uncontrolled mode for `open` prop');
            }
            setState(function (prevState) { return (__assign(__assign({}, prevState), { open: openProp })); });
        }
    }, [isOpenControlled, openProp]);
    var viewValue = React.useMemo(function () {
        return valueManager.cleanValue(adapter, state.clockShallowValue === undefined ? value : state.clockShallowValue);
    }, [adapter, valueManager, state.clockShallowValue, value]);
    return { timezone: timezone, state: state, setValue: setValue, setValueFromView: setValueFromView, setOpen: setOpen, value: value, viewValue: viewValue };
}
