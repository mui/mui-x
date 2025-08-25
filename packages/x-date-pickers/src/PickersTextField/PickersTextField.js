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
exports.PickersTextField = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var refType_1 = require("@mui/utils/refType");
var useForkRef_1 = require("@mui/utils/useForkRef");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useId_1 = require("@mui/utils/useId");
var InputLabel_1 = require("@mui/material/InputLabel");
var FormHelperText_1 = require("@mui/material/FormHelperText");
var FormControl_1 = require("@mui/material/FormControl");
var pickersTextFieldClasses_1 = require("./pickersTextFieldClasses");
var PickersOutlinedInput_1 = require("./PickersOutlinedInput");
var PickersFilledInput_1 = require("./PickersFilledInput");
var PickersInput_1 = require("./PickersInput");
var useFieldOwnerState_1 = require("../internals/hooks/useFieldOwnerState");
var usePickerTextFieldOwnerState_1 = require("./usePickerTextFieldOwnerState");
var VARIANT_COMPONENT = {
    standard: PickersInput_1.PickersInput,
    filled: PickersFilledInput_1.PickersFilledInput,
    outlined: PickersOutlinedInput_1.PickersOutlinedInput,
};
var PickersTextFieldRoot = (0, styles_1.styled)(FormControl_1.default, {
    name: 'MuiPickersTextField',
    slot: 'Root',
})({
    maxWidth: '100%',
});
var useUtilityClasses = function (classes, ownerState) {
    var isFieldFocused = ownerState.isFieldFocused, isFieldDisabled = ownerState.isFieldDisabled, isFieldRequired = ownerState.isFieldRequired;
    var slots = {
        root: [
            'root',
            isFieldFocused && !isFieldDisabled && 'focused',
            isFieldDisabled && 'disabled',
            isFieldRequired && 'required',
        ],
    };
    return (0, composeClasses_1.default)(slots, pickersTextFieldClasses_1.getPickersTextFieldUtilityClass, classes);
};
var PickersTextField = React.forwardRef(function PickersTextField(inProps, ref) {
    var props = (0, styles_1.useThemeProps)({
        props: inProps,
        name: 'MuiPickersTextField',
    });
    var 
    // Props used by FormControl
    onFocus = props.onFocus, onBlur = props.onBlur, className = props.className, classesProp = props.classes, _a = props.color, color = _a === void 0 ? 'primary' : _a, _b = props.disabled, disabled = _b === void 0 ? false : _b, _c = props.error, error = _c === void 0 ? false : _c, _d = props.variant, variant = _d === void 0 ? 'outlined' : _d, _e = props.required, required = _e === void 0 ? false : _e, _f = props.hiddenLabel, hiddenLabel = _f === void 0 ? false : _f, 
    // Props used by PickersInput
    InputProps = props.InputProps, inputProps = props.inputProps, inputRef = props.inputRef, sectionListRef = props.sectionListRef, elements = props.elements, areAllSectionsEmpty = props.areAllSectionsEmpty, onClick = props.onClick, onKeyDown = props.onKeyDown, onKeyUp = props.onKeyUp, onPaste = props.onPaste, onInput = props.onInput, endAdornment = props.endAdornment, startAdornment = props.startAdornment, tabIndex = props.tabIndex, contentEditable = props.contentEditable, focused = props.focused, value = props.value, onChange = props.onChange, fullWidth = props.fullWidth, idProp = props.id, name = props.name, 
    // Props used by FormHelperText
    helperText = props.helperText, FormHelperTextProps = props.FormHelperTextProps, 
    // Props used by InputLabel
    label = props.label, InputLabelProps = props.InputLabelProps, 
    // @ts-ignore
    dataActiveRangePosition = props["data-active-range-position"], other = __rest(props, ["onFocus", "onBlur", "className", "classes", "color", "disabled", "error", "variant", "required", "hiddenLabel", "InputProps", "inputProps", "inputRef", "sectionListRef", "elements", "areAllSectionsEmpty", "onClick", "onKeyDown", "onKeyUp", "onPaste", "onInput", "endAdornment", "startAdornment", "tabIndex", "contentEditable", "focused", "value", "onChange", "fullWidth", "id", "name", "helperText", "FormHelperTextProps", "label", "InputLabelProps", 'data-active-range-position']);
    var rootRef = React.useRef(null);
    var handleRootRef = (0, useForkRef_1.default)(ref, rootRef);
    var id = (0, useId_1.default)(idProp);
    var helperTextId = helperText && id ? "".concat(id, "-helper-text") : undefined;
    var inputLabelId = label && id ? "".concat(id, "-label") : undefined;
    var fieldOwnerState = (0, useFieldOwnerState_1.useFieldOwnerState)({
        disabled: props.disabled,
        required: props.required,
        readOnly: InputProps === null || InputProps === void 0 ? void 0 : InputProps.readOnly,
    });
    var ownerState = React.useMemo(function () {
        var _a;
        return (__assign(__assign({}, fieldOwnerState), { isFieldValueEmpty: areAllSectionsEmpty, isFieldFocused: focused !== null && focused !== void 0 ? focused : false, hasFieldError: error !== null && error !== void 0 ? error : false, inputSize: (_a = props.size) !== null && _a !== void 0 ? _a : 'medium', inputColor: color !== null && color !== void 0 ? color : 'primary', isInputInFullWidth: fullWidth !== null && fullWidth !== void 0 ? fullWidth : false, hasStartAdornment: Boolean(startAdornment !== null && startAdornment !== void 0 ? startAdornment : InputProps === null || InputProps === void 0 ? void 0 : InputProps.startAdornment), hasEndAdornment: Boolean(endAdornment !== null && endAdornment !== void 0 ? endAdornment : InputProps === null || InputProps === void 0 ? void 0 : InputProps.endAdornment), inputHasLabel: !!label }));
    }, [
        fieldOwnerState,
        areAllSectionsEmpty,
        focused,
        error,
        props.size,
        color,
        fullWidth,
        startAdornment,
        endAdornment,
        InputProps === null || InputProps === void 0 ? void 0 : InputProps.startAdornment,
        InputProps === null || InputProps === void 0 ? void 0 : InputProps.endAdornment,
        label,
    ]);
    var classes = useUtilityClasses(classesProp, ownerState);
    var PickersInputComponent = VARIANT_COMPONENT[variant];
    var inputAdditionalProps = {};
    if (variant === 'outlined') {
        if (InputLabelProps && typeof InputLabelProps.shrink !== 'undefined') {
            inputAdditionalProps.notched = InputLabelProps.shrink;
        }
        inputAdditionalProps.label = label;
    }
    else if (variant === 'filled') {
        inputAdditionalProps.hiddenLabel = hiddenLabel;
    }
    return (<usePickerTextFieldOwnerState_1.PickerTextFieldOwnerStateContext.Provider value={ownerState}>
      <PickersTextFieldRoot className={(0, clsx_1.default)(classes.root, className)} ref={handleRootRef} focused={focused} disabled={disabled} variant={variant} error={error} color={color} fullWidth={fullWidth} required={required} ownerState={ownerState} {...other}>
        {label != null && label !== '' && (<InputLabel_1.default htmlFor={id} id={inputLabelId} {...InputLabelProps}>
            {label}
          </InputLabel_1.default>)}
        <PickersInputComponent elements={elements} areAllSectionsEmpty={areAllSectionsEmpty} onClick={onClick} onKeyDown={onKeyDown} onKeyUp={onKeyUp} onInput={onInput} onPaste={onPaste} onFocus={onFocus} onBlur={onBlur} endAdornment={endAdornment} startAdornment={startAdornment} tabIndex={tabIndex} contentEditable={contentEditable} value={value} onChange={onChange} id={id} fullWidth={fullWidth} inputProps={inputProps} inputRef={inputRef} sectionListRef={sectionListRef} label={label} name={name} role="group" aria-labelledby={inputLabelId} aria-describedby={helperTextId} aria-live={helperTextId ? 'polite' : undefined} data-active-range-position={dataActiveRangePosition} {...inputAdditionalProps} {...InputProps}/>
        {helperText && (<FormHelperText_1.default id={helperTextId} {...FormHelperTextProps}>
            {helperText}
          </FormHelperText_1.default>)}
      </PickersTextFieldRoot>
    </usePickerTextFieldOwnerState_1.PickerTextFieldOwnerStateContext.Provider>);
});
exports.PickersTextField = PickersTextField;
PickersTextField.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Is `true` if the current values equals the empty value.
     * For a single item value, it means that `value === null`
     * For a range value, it means that `value === [null, null]`
     */
    areAllSectionsEmpty: prop_types_1.default.bool.isRequired,
    className: prop_types_1.default.string,
    /**
     * The color of the component.
     * It supports both default and custom theme colors, which can be added as shown in the
     * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
     * @default 'primary'
     */
    color: prop_types_1.default.oneOf(['error', 'info', 'primary', 'secondary', 'success', 'warning']),
    component: prop_types_1.default.elementType,
    /**
     * If true, the whole element is editable.
     * Useful when all the sections are selected.
     */
    contentEditable: prop_types_1.default.bool.isRequired,
    disabled: prop_types_1.default.bool.isRequired,
    /**
     * The elements to render.
     * Each element contains the prop to edit a section of the value.
     */
    elements: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        after: prop_types_1.default.object.isRequired,
        before: prop_types_1.default.object.isRequired,
        container: prop_types_1.default.object.isRequired,
        content: prop_types_1.default.object.isRequired,
    })).isRequired,
    endAdornment: prop_types_1.default.node,
    error: prop_types_1.default.bool.isRequired,
    /**
     * If `true`, the component is displayed in focused state.
     */
    focused: prop_types_1.default.bool,
    FormHelperTextProps: prop_types_1.default.object,
    fullWidth: prop_types_1.default.bool,
    /**
     * The helper text content.
     */
    helperText: prop_types_1.default.node,
    /**
     * If `true`, the label is hidden.
     * This is used to increase density for a `FilledInput`.
     * Be sure to add `aria-label` to the `input` element.
     * @default false
     */
    hiddenLabel: prop_types_1.default.bool,
    id: prop_types_1.default.string,
    InputLabelProps: prop_types_1.default.object,
    inputProps: prop_types_1.default.object,
    /**
     * Props applied to the Input element.
     * It will be a [`FilledInput`](/material-ui/api/filled-input/),
     * [`OutlinedInput`](/material-ui/api/outlined-input/) or [`Input`](/material-ui/api/input/)
     * component depending on the `variant` prop value.
     */
    InputProps: prop_types_1.default.object,
    inputRef: refType_1.default,
    label: prop_types_1.default.node,
    /**
     * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
     * @default 'none'
     */
    margin: prop_types_1.default.oneOf(['dense', 'none', 'normal']),
    name: prop_types_1.default.string,
    onBlur: prop_types_1.default.func.isRequired,
    onChange: prop_types_1.default.func.isRequired,
    onClick: prop_types_1.default.func.isRequired,
    onFocus: prop_types_1.default.func.isRequired,
    onInput: prop_types_1.default.func.isRequired,
    onKeyDown: prop_types_1.default.func.isRequired,
    onPaste: prop_types_1.default.func.isRequired,
    readOnly: prop_types_1.default.bool,
    /**
     * If `true`, the label will indicate that the `input` is required.
     * @default false
     */
    required: prop_types_1.default.bool,
    sectionListRef: prop_types_1.default.oneOfType([
        prop_types_1.default.func,
        prop_types_1.default.shape({
            current: prop_types_1.default.shape({
                getRoot: prop_types_1.default.func.isRequired,
                getSectionContainer: prop_types_1.default.func.isRequired,
                getSectionContent: prop_types_1.default.func.isRequired,
                getSectionIndexFromDOMElement: prop_types_1.default.func.isRequired,
            }),
        }),
    ]),
    /**
     * The size of the component.
     * @default 'medium'
     */
    size: prop_types_1.default.oneOf(['medium', 'small']),
    startAdornment: prop_types_1.default.node,
    style: prop_types_1.default.object,
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
    value: prop_types_1.default.string.isRequired,
    /**
     * The variant to use.
     * @default 'outlined'
     */
    variant: prop_types_1.default.oneOf(['filled', 'outlined', 'standard']),
};
