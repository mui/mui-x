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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTextFieldProps = useTextFieldProps;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var managers_1 = require("@mui/x-date-pickers/managers");
var internals_1 = require("@mui/x-date-pickers/internals");
var useNullablePickerRangePositionContext_1 = require("../../internals/hooks/useNullablePickerRangePositionContext");
/**
 * @ignore - internal hook.
 */
function useTextFieldProps(parameters) {
    var _a;
    var pickerContext = (0, internals_1.useNullablePickerContext)();
    var fieldPrivateContext = (0, internals_1.useNullableFieldPrivateContext)();
    var pickerPrivateContext = (0, internals_1.usePickerPrivateContext)();
    var rangePositionContext = (0, useNullablePickerRangePositionContext_1.useNullablePickerRangePositionContext)();
    var rangePosition = (_a = rangePositionContext === null || rangePositionContext === void 0 ? void 0 : rangePositionContext.rangePosition) !== null && _a !== void 0 ? _a : 'start';
    var setRangePosition = rangePositionContext === null || rangePositionContext === void 0 ? void 0 : rangePositionContext.setRangePosition;
    var previousRangePosition = React.useRef(rangePosition);
    var forwardedProps = parameters.forwardedProps, sharedInternalProps = parameters.sharedInternalProps, selectedSectionProps = parameters.selectedSectionProps, valueType = parameters.valueType, position = parameters.position, value = parameters.value, onChange = parameters.onChange, autoFocus = parameters.autoFocus, validation = parameters.validation;
    var useManager;
    switch (valueType) {
        case 'date': {
            useManager = managers_1.useDateManager;
            break;
        }
        case 'time': {
            useManager = managers_1.useTimeManager;
            break;
        }
        case 'date-time': {
            useManager = managers_1.useDateTimeManager;
            break;
        }
        default: {
            throw new Error("Unknown valueType: ".concat(valueType));
        }
    }
    var manager = useManager({
        enableAccessibleFieldDOMStructure: sharedInternalProps.enableAccessibleFieldDOMStructure,
    });
    var openPickerIfPossible = function (event) {
        if (!pickerContext) {
            return;
        }
        setRangePosition === null || setRangePosition === void 0 ? void 0 : setRangePosition(position);
        if (pickerContext.triggerStatus === 'enabled') {
            event.preventDefault();
            pickerContext.setOpen(true);
        }
    };
    var handleKeyDown = (0, useEventCallback_1.default)(function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            openPickerIfPossible(event);
        }
    });
    // Registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
    // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
    var handleClick = (0, useEventCallback_1.default)(function (event) {
        openPickerIfPossible(event);
    });
    var handleFocus = (0, useEventCallback_1.default)(function (event) {
        var _a, _b;
        (_a = forwardedProps.onFocus) === null || _a === void 0 ? void 0 : _a.call(forwardedProps, event);
        if (pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.open) {
            setRangePosition === null || setRangePosition === void 0 ? void 0 : setRangePosition(position);
            if (previousRangePosition.current !== position && pickerContext.initialView) {
                (_b = pickerContext.setView) === null || _b === void 0 ? void 0 : _b.call(pickerContext, pickerContext.initialView);
            }
        }
    });
    var handleChange = (0, useEventCallback_1.default)(function (newSingleValue, rawContext) {
        var newRange = position === 'start' ? [newSingleValue, value[1]] : [value[0], newSingleValue];
        var context = __assign(__assign({}, rawContext), { validationError: validation.getValidationErrorForNewValue(newRange) });
        onChange(newRange, context);
    });
    var allProps = __assign(__assign(__assign(__assign({ value: position === 'start' ? value[0] : value[1], error: position === 'start' ? !!validation.validationError[0] : !!validation.validationError[1], id: "".concat(pickerPrivateContext.labelId, "-").concat(position), autoFocus: position === 'start' ? autoFocus : undefined }, forwardedProps), sharedInternalProps), selectedSectionProps), { onClick: handleClick, onFocus: handleFocus, onKeyDown: handleKeyDown, onChange: handleChange });
    var _b = (0, internals_1.useField)({
        manager: manager,
        props: allProps,
        skipContextFieldRefAssignment: rangePosition !== position,
    }), clearable = _b.clearable, onClear = _b.onClear, openPickerAriaLabel = _b.openPickerAriaLabel, fieldResponse = __rest(_b, ["clearable", "onClear", "openPickerAriaLabel"]);
    React.useEffect(function () {
        var _a;
        if (!(pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.open) || (pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.variant) === 'mobile') {
            return;
        }
        (_a = fieldPrivateContext === null || fieldPrivateContext === void 0 ? void 0 : fieldPrivateContext.fieldRef.current) === null || _a === void 0 ? void 0 : _a.focusField();
        if (!(fieldPrivateContext === null || fieldPrivateContext === void 0 ? void 0 : fieldPrivateContext.fieldRef.current) ||
            pickerContext.view === pickerContext.initialView) {
            // could happen when the user is switching between the inputs
            previousRangePosition.current = rangePosition;
            return;
        }
        // bring back focus to the field
        // currentView is present on DateTimeRangePicker
        fieldPrivateContext === null || fieldPrivateContext === void 0 ? void 0 : fieldPrivateContext.fieldRef.current.setSelectedSections(
        // use the current view or `0` when the range position has just been swapped
        previousRangePosition.current === rangePosition ? pickerContext.view : 0);
        previousRangePosition.current = rangePosition;
    }, [
        rangePosition,
        pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.open,
        pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.variant,
        pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.initialView,
        pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.view,
        fieldPrivateContext === null || fieldPrivateContext === void 0 ? void 0 : fieldPrivateContext.fieldRef,
    ]);
    return fieldResponse;
}
