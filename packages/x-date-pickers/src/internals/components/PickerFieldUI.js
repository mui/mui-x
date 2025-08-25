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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickerFieldUIContext = exports.cleanFieldResponse = void 0;
exports.PickerFieldUI = PickerFieldUI;
exports.mergeSlotProps = mergeSlotProps;
exports.useFieldTextFieldProps = useFieldTextFieldProps;
exports.PickerFieldUIContextProvider = PickerFieldUIContextProvider;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useForkRef_1 = require("@mui/utils/useForkRef");
var resolveComponentProps_1 = require("@mui/utils/resolveComponentProps");
var TextField_1 = require("@mui/material/TextField");
var IconButton_1 = require("@mui/material/IconButton");
var InputAdornment_1 = require("@mui/material/InputAdornment");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var useFieldOwnerState_1 = require("../hooks/useFieldOwnerState");
var hooks_1 = require("../../hooks");
var icons_1 = require("../../icons");
var useNullablePickerContext_1 = require("../hooks/useNullablePickerContext");
var PickersTextField_1 = require("../../PickersTextField");
var cleanFieldResponse = function (_a) {
    var enableAccessibleFieldDOMStructure = _a.enableAccessibleFieldDOMStructure, fieldResponse = __rest(_a, ["enableAccessibleFieldDOMStructure"]);
    if (enableAccessibleFieldDOMStructure) {
        var InputProps_1 = fieldResponse.InputProps, readOnly_1 = fieldResponse.readOnly, onClear_1 = fieldResponse.onClear, clearable_1 = fieldResponse.clearable, clearButtonPosition_1 = fieldResponse.clearButtonPosition, openPickerButtonPosition_1 = fieldResponse.openPickerButtonPosition, openPickerAriaLabel_1 = fieldResponse.openPickerAriaLabel, other_1 = __rest(fieldResponse, ["InputProps", "readOnly", "onClear", "clearable", "clearButtonPosition", "openPickerButtonPosition", "openPickerAriaLabel"]);
        return {
            clearable: clearable_1,
            onClear: onClear_1,
            clearButtonPosition: clearButtonPosition_1,
            openPickerButtonPosition: openPickerButtonPosition_1,
            openPickerAriaLabel: openPickerAriaLabel_1,
            textFieldProps: __assign(__assign({}, other_1), { InputProps: __assign(__assign({}, (InputProps_1 !== null && InputProps_1 !== void 0 ? InputProps_1 : {})), { readOnly: readOnly_1 }) }),
        };
    }
    var onPaste = fieldResponse.onPaste, onKeyDown = fieldResponse.onKeyDown, inputMode = fieldResponse.inputMode, readOnly = fieldResponse.readOnly, InputProps = fieldResponse.InputProps, inputProps = fieldResponse.inputProps, inputRef = fieldResponse.inputRef, onClear = fieldResponse.onClear, clearable = fieldResponse.clearable, clearButtonPosition = fieldResponse.clearButtonPosition, openPickerButtonPosition = fieldResponse.openPickerButtonPosition, openPickerAriaLabel = fieldResponse.openPickerAriaLabel, other = __rest(fieldResponse, ["onPaste", "onKeyDown", "inputMode", "readOnly", "InputProps", "inputProps", "inputRef", "onClear", "clearable", "clearButtonPosition", "openPickerButtonPosition", "openPickerAriaLabel"]);
    return {
        clearable: clearable,
        onClear: onClear,
        clearButtonPosition: clearButtonPosition,
        openPickerButtonPosition: openPickerButtonPosition,
        openPickerAriaLabel: openPickerAriaLabel,
        textFieldProps: __assign(__assign({}, other), { InputProps: __assign(__assign({}, (InputProps !== null && InputProps !== void 0 ? InputProps : {})), { readOnly: readOnly }), inputProps: __assign(__assign({}, (inputProps !== null && inputProps !== void 0 ? inputProps : {})), { inputMode: inputMode, onPaste: onPaste, onKeyDown: onKeyDown, ref: inputRef }) }),
    };
};
exports.cleanFieldResponse = cleanFieldResponse;
exports.PickerFieldUIContext = React.createContext({
    slots: {},
    slotProps: {},
    inputRef: undefined,
});
/**
 * Adds the button to open the Picker and the button to clear the value of the field.
 * @ignore - internal component.
 */
function PickerFieldUI(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var slots = props.slots, slotProps = props.slotProps, fieldResponse = props.fieldResponse, defaultOpenPickerIcon = props.defaultOpenPickerIcon;
    var translations = (0, hooks_1.usePickerTranslations)();
    var pickerContext = (0, useNullablePickerContext_1.useNullablePickerContext)();
    var pickerFieldUIContext = React.useContext(exports.PickerFieldUIContext);
    var _o = (0, exports.cleanFieldResponse)(fieldResponse), textFieldProps = _o.textFieldProps, onClear = _o.onClear, clearable = _o.clearable, openPickerAriaLabel = _o.openPickerAriaLabel, _p = _o.clearButtonPosition, clearButtonPositionProp = _p === void 0 ? 'end' : _p, _q = _o.openPickerButtonPosition, openPickerButtonPositionProp = _q === void 0 ? 'end' : _q;
    var ownerState = (0, useFieldOwnerState_1.useFieldOwnerState)(textFieldProps);
    var handleClickOpeningButton = (0, useEventCallback_1.default)(function (event) {
        event.preventDefault();
        pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.setOpen(function (prev) { return !prev; });
    });
    var triggerStatus = pickerContext ? pickerContext.triggerStatus : 'hidden';
    var clearButtonPosition = clearable ? clearButtonPositionProp : null;
    var openPickerButtonPosition = triggerStatus !== 'hidden' ? openPickerButtonPositionProp : null;
    var TextField = (_b = (_a = slots === null || slots === void 0 ? void 0 : slots.textField) !== null && _a !== void 0 ? _a : pickerFieldUIContext.slots.textField) !== null && _b !== void 0 ? _b : (fieldResponse.enableAccessibleFieldDOMStructure === false ? TextField_1.default : PickersTextField_1.PickersTextField);
    var InputAdornment = (_d = (_c = slots === null || slots === void 0 ? void 0 : slots.inputAdornment) !== null && _c !== void 0 ? _c : pickerFieldUIContext.slots.inputAdornment) !== null && _d !== void 0 ? _d : InputAdornment_1.default;
    var _r = (0, useSlotProps_1.default)({
        elementType: InputAdornment,
        externalSlotProps: mergeSlotProps(pickerFieldUIContext.slotProps.inputAdornment, slotProps === null || slotProps === void 0 ? void 0 : slotProps.inputAdornment),
        additionalProps: {
            position: 'start',
        },
        ownerState: __assign(__assign({}, ownerState), { position: 'start' }),
    }), startInputAdornmentOwnerState = _r.ownerState, startInputAdornmentProps = __rest(_r, ["ownerState"]);
    var _s = (0, useSlotProps_1.default)({
        elementType: InputAdornment,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.inputAdornment,
        additionalProps: {
            position: 'end',
        },
        ownerState: __assign(__assign({}, ownerState), { position: 'end' }),
    }), endInputAdornmentOwnerState = _s.ownerState, endInputAdornmentProps = __rest(_s, ["ownerState"]);
    var OpenPickerButton = (_e = pickerFieldUIContext.slots.openPickerButton) !== null && _e !== void 0 ? _e : IconButton_1.default;
    // We don't want to forward the `ownerState` to the `<IconButton />` component, see mui/material-ui#34056
    var _t = (0, useSlotProps_1.default)({
        elementType: OpenPickerButton,
        externalSlotProps: pickerFieldUIContext.slotProps.openPickerButton,
        additionalProps: {
            disabled: triggerStatus === 'disabled',
            onClick: handleClickOpeningButton,
            'aria-label': openPickerAriaLabel,
            edge: 
            // open button is always rendered at the edge
            textFieldProps.variant !== 'standard' ? openPickerButtonPosition : false,
        },
        ownerState: ownerState,
    }), openPickerButtonOwnerState = _t.ownerState, openPickerButtonProps = __rest(_t, ["ownerState"]);
    var OpenPickerIcon = (_f = pickerFieldUIContext.slots.openPickerIcon) !== null && _f !== void 0 ? _f : defaultOpenPickerIcon;
    var openPickerIconProps = (0, useSlotProps_1.default)({
        elementType: OpenPickerIcon,
        externalSlotProps: pickerFieldUIContext.slotProps.openPickerIcon,
        ownerState: ownerState,
    });
    var ClearButton = (_h = (_g = slots === null || slots === void 0 ? void 0 : slots.clearButton) !== null && _g !== void 0 ? _g : pickerFieldUIContext.slots.clearButton) !== null && _h !== void 0 ? _h : IconButton_1.default;
    // We don't want to forward the `ownerState` to the `<IconButton />` component, see mui/material-ui#34056
    var _u = (0, useSlotProps_1.default)({
        elementType: ClearButton,
        externalSlotProps: mergeSlotProps(pickerFieldUIContext.slotProps.clearButton, slotProps === null || slotProps === void 0 ? void 0 : slotProps.clearButton),
        className: 'clearButton',
        additionalProps: {
            title: translations.fieldClearLabel,
            tabIndex: -1,
            onClick: onClear,
            disabled: fieldResponse.disabled || fieldResponse.readOnly,
            edge: 
            // clear button can only be at the edge if it's position differs from the open button
            textFieldProps.variant !== 'standard' && clearButtonPosition !== openPickerButtonPosition
                ? clearButtonPosition
                : false,
        },
        ownerState: ownerState,
    }), clearButtonOwnerState = _u.ownerState, clearButtonProps = __rest(_u, ["ownerState"]);
    var ClearIcon = (_k = (_j = slots === null || slots === void 0 ? void 0 : slots.clearIcon) !== null && _j !== void 0 ? _j : pickerFieldUIContext.slots.clearIcon) !== null && _k !== void 0 ? _k : icons_1.ClearIcon;
    var clearIconProps = (0, useSlotProps_1.default)({
        elementType: ClearIcon,
        externalSlotProps: mergeSlotProps(pickerFieldUIContext.slotProps.clearIcon, slotProps === null || slotProps === void 0 ? void 0 : slotProps.clearIcon),
        additionalProps: {
            fontSize: 'small',
        },
        ownerState: ownerState,
    });
    textFieldProps.ref = (0, useForkRef_1.default)(textFieldProps.ref, pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.rootRef);
    if (!textFieldProps.InputProps) {
        textFieldProps.InputProps = {};
    }
    if (pickerContext) {
        textFieldProps.InputProps.ref = pickerContext.triggerRef;
    }
    if (!((_l = textFieldProps.InputProps) === null || _l === void 0 ? void 0 : _l.startAdornment) &&
        (clearButtonPosition === 'start' || openPickerButtonPosition === 'start')) {
        textFieldProps.InputProps.startAdornment = (<InputAdornment {...startInputAdornmentProps}>
        {openPickerButtonPosition === 'start' && (<OpenPickerButton {...openPickerButtonProps}>
            <OpenPickerIcon {...openPickerIconProps}/>
          </OpenPickerButton>)}
        {clearButtonPosition === 'start' && (<ClearButton {...clearButtonProps}>
            <ClearIcon {...clearIconProps}/>
          </ClearButton>)}
      </InputAdornment>);
    }
    if (!((_m = textFieldProps.InputProps) === null || _m === void 0 ? void 0 : _m.endAdornment) &&
        (clearButtonPosition === 'end' || openPickerButtonPosition === 'end')) {
        textFieldProps.InputProps.endAdornment = (<InputAdornment {...endInputAdornmentProps}>
        {clearButtonPosition === 'end' && (<ClearButton {...clearButtonProps}>
            <ClearIcon {...clearIconProps}/>
          </ClearButton>)}
        {openPickerButtonPosition === 'end' && (<OpenPickerButton {...openPickerButtonProps}>
            <OpenPickerIcon {...openPickerIconProps}/>
          </OpenPickerButton>)}
      </InputAdornment>);
    }
    if (clearButtonPosition != null) {
        textFieldProps.sx = __spreadArray([
            {
                '& .clearButton': {
                    opacity: 1,
                },
                '@media (pointer: fine)': {
                    '& .clearButton': {
                        opacity: 0,
                    },
                    '&:hover, &:focus-within': {
                        '.clearButton': {
                            opacity: 1,
                        },
                    },
                },
            }
        ], (Array.isArray(textFieldProps.sx) ? textFieldProps.sx : [textFieldProps.sx]), true);
    }
    return <TextField {...textFieldProps}/>;
}
function mergeSlotProps(slotPropsA, slotPropsB) {
    if (!slotPropsA) {
        return slotPropsB;
    }
    if (!slotPropsB) {
        return slotPropsA;
    }
    return function (ownerState) {
        return __assign(__assign({}, (0, resolveComponentProps_1.default)(slotPropsB, ownerState)), (0, resolveComponentProps_1.default)(slotPropsA, ownerState));
    };
}
/**
 * The `textField` slot props cannot be handled inside `PickerFieldUI` because it would be a breaking change to not pass the enriched props to `useField`.
 * Once the non-accessible DOM structure will be removed, we will be able to remove the `textField` slot and clean this logic.
 */
function useFieldTextFieldProps(parameters) {
    var ref = parameters.ref, externalForwardedProps = parameters.externalForwardedProps, slotProps = parameters.slotProps;
    var pickerFieldUIContext = React.useContext(exports.PickerFieldUIContext);
    var pickerContext = (0, useNullablePickerContext_1.useNullablePickerContext)();
    var ownerState = (0, useFieldOwnerState_1.useFieldOwnerState)(externalForwardedProps);
    var InputProps = externalForwardedProps.InputProps, inputProps = externalForwardedProps.inputProps, otherExternalForwardedProps = __rest(externalForwardedProps, ["InputProps", "inputProps"]);
    var textFieldProps = (0, useSlotProps_1.default)({
        elementType: PickersTextField_1.PickersTextField,
        externalSlotProps: mergeSlotProps(pickerFieldUIContext.slotProps.textField, slotProps === null || slotProps === void 0 ? void 0 : slotProps.textField),
        externalForwardedProps: otherExternalForwardedProps,
        additionalProps: {
            ref: ref,
            sx: pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.rootSx,
            label: pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.label,
            name: pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.name,
            className: pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.rootClassName,
            inputRef: pickerFieldUIContext.inputRef,
        },
        ownerState: ownerState,
    });
    // TODO: Remove when mui/material-ui#35088 will be merged
    textFieldProps.inputProps = __assign(__assign({}, inputProps), textFieldProps.inputProps);
    textFieldProps.InputProps = __assign(__assign({}, InputProps), textFieldProps.InputProps);
    return textFieldProps;
}
function PickerFieldUIContextProvider(props) {
    var _a = props.slots, slots = _a === void 0 ? {} : _a, _b = props.slotProps, slotProps = _b === void 0 ? {} : _b, inputRef = props.inputRef, children = props.children;
    var contextValue = React.useMemo(function () { return ({
        inputRef: inputRef,
        slots: {
            openPickerButton: slots.openPickerButton,
            openPickerIcon: slots.openPickerIcon,
            textField: slots.textField,
            inputAdornment: slots.inputAdornment,
            clearIcon: slots.clearIcon,
            clearButton: slots.clearButton,
        },
        slotProps: {
            openPickerButton: slotProps.openPickerButton,
            openPickerIcon: slotProps.openPickerIcon,
            textField: slotProps.textField,
            inputAdornment: slotProps.inputAdornment,
            clearIcon: slotProps.clearIcon,
            clearButton: slotProps.clearButton,
        },
    }); }, [
        inputRef,
        slots.openPickerButton,
        slots.openPickerIcon,
        slots.textField,
        slots.inputAdornment,
        slots.clearIcon,
        slots.clearButton,
        slotProps.openPickerButton,
        slotProps.openPickerIcon,
        slotProps.textField,
        slotProps.inputAdornment,
        slotProps.clearIcon,
        slotProps.clearButton,
    ]);
    return (<exports.PickerFieldUIContext.Provider value={contextValue}>{children}</exports.PickerFieldUIContext.Provider>);
}
