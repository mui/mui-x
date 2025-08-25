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
exports.createMultiInputRangeField = createMultiInputRangeField;
var React = require("react");
var clsx_1 = require("clsx");
var Stack_1 = require("@mui/material/Stack");
var TextField_1 = require("@mui/material/TextField");
var Typography_1 = require("@mui/material/Typography");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var useForkRef_1 = require("@mui/utils/useForkRef");
var internals_1 = require("@mui/x-date-pickers/internals");
var hooks_1 = require("@mui/x-date-pickers/hooks");
var PickersTextField_1 = require("@mui/x-date-pickers/PickersTextField");
var useMultiInputRangeField_1 = require("../../../hooks/useMultiInputRangeField");
var useTextFieldProps_1 = require("./useTextFieldProps");
function createMultiInputRangeField(_a) {
    var useManager = _a.useManager, name = _a.name, getUtilityClass = _a.getUtilityClass, allowTriggerShifting = _a.allowTriggerShifting;
    var useUtilityClasses = function (classes) {
        var slots = {
            root: ['root'],
            separator: ['separator'],
        };
        return (0, composeClasses_1.default)(slots, getUtilityClass, classes);
    };
    var MultiInputRangeFieldRoot = (0, styles_1.styled)(React.forwardRef(function (props, ref) { return (<Stack_1.default ref={ref} spacing={2} direction="row" alignItems="baseline" {...props}/>); }), {
        name: name,
        slot: 'Root',
    })({});
    var MultiInputRangeFieldSeparator = (0, styles_1.styled)(Typography_1.default, {
        name: name,
        slot: 'Separator',
    })({
        lineHeight: '1.4375em', // 23px
    });
    var MultiInputRangeField = React.forwardRef(function MultiInputRangeField(props, ref) {
        var _a, _b, _c, _d, _e;
        var themeProps = (0, styles_1.useThemeProps)({
            props: props,
            // eslint-disable-next-line material-ui/mui-name-matches-component-name
            name: name,
        });
        var pickerFieldUIContext = React.useContext(internals_1.PickerFieldUIContext);
        var pickerContext = (0, internals_1.useNullablePickerContext)();
        var manager = useManager({
            enableAccessibleFieldDOMStructure: props.enableAccessibleFieldDOMStructure,
            dateSeparator: props.dateSeparator,
        });
        var _f = (0, hooks_1.useSplitFieldProps)(themeProps, manager.valueType), rawInternalProps = _f.internalProps, forwardedProps = _f.forwardedProps;
        var internalProps = (pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.variant) === 'mobile'
            ? __assign(__assign({}, rawInternalProps), { readOnly: true }) : rawInternalProps;
        var slots = forwardedProps.slots, slotProps = forwardedProps.slotProps, className = forwardedProps.className, classesProp = forwardedProps.classes, otherForwardedProps = __rest(forwardedProps, ["slots", "slotProps", "className", "classes"]);
        var classes = useUtilityClasses(classesProp);
        var ownerState = (0, internals_1.useFieldOwnerState)(internalProps);
        var handleRef = (0, useForkRef_1.default)(ref, pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.rootRef);
        var Root = (_a = slots === null || slots === void 0 ? void 0 : slots.root) !== null && _a !== void 0 ? _a : MultiInputRangeFieldRoot;
        var rootProps = (0, useSlotProps_1.default)({
            elementType: Root,
            externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.root,
            externalForwardedProps: otherForwardedProps,
            additionalProps: { ref: handleRef },
            ownerState: ownerState,
            className: (0, clsx_1.default)(className, classes.root),
        });
        var startTextFieldProps = (0, useTextFieldProps_1.useTextFieldProps)({
            slotProps: slotProps,
            ownerState: ownerState,
            position: 'start',
            allowTriggerShifting: allowTriggerShifting,
        });
        var endTextFieldProps = (0, useTextFieldProps_1.useTextFieldProps)({
            slotProps: slotProps,
            ownerState: ownerState,
            position: 'end',
            allowTriggerShifting: allowTriggerShifting,
        });
        var fieldResponse = (0, useMultiInputRangeField_1.useMultiInputRangeField)({
            manager: manager,
            internalProps: internalProps,
            rootProps: rootProps,
            startTextFieldProps: startTextFieldProps,
            endTextFieldProps: endTextFieldProps,
        });
        var Separator = (_b = slots === null || slots === void 0 ? void 0 : slots.separator) !== null && _b !== void 0 ? _b : MultiInputRangeFieldSeparator;
        var separatorProps = (0, useSlotProps_1.default)({
            elementType: Separator,
            externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.separator,
            additionalProps: {
                children: (_c = internalProps.dateSeparator) !== null && _c !== void 0 ? _c : '–',
            },
            ownerState: ownerState,
            className: classes.separator,
        });
        var cleanStartTextFieldResponse = (0, internals_1.cleanFieldResponse)(fieldResponse.startTextField);
        var cleanEndTextFieldResponse = (0, internals_1.cleanFieldResponse)(fieldResponse.endTextField);
        var TextField = (_e = (_d = slots === null || slots === void 0 ? void 0 : slots.textField) !== null && _d !== void 0 ? _d : pickerFieldUIContext.slots.textField) !== null && _e !== void 0 ? _e : (fieldResponse.enableAccessibleFieldDOMStructure === false ? TextField_1.default : PickersTextField_1.PickersTextField);
        return (<Root {...fieldResponse.root}>
        <TextField fullWidth {...cleanStartTextFieldResponse.textFieldProps}/>
        <Separator {...separatorProps}/>
        <TextField fullWidth {...cleanEndTextFieldResponse.textFieldProps}/>
      </Root>);
    });
    MultiInputRangeField.fieldType = 'multi-input';
    return MultiInputRangeField;
}
