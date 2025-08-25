"use strict";
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
exports.PickersFilledInput = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var system_1 = require("@mui/system");
var refType_1 = require("@mui/utils/refType");
var composeClasses_1 = require("@mui/utils/composeClasses");
var pickersFilledInputClasses_1 = require("./pickersFilledInputClasses");
var PickersInputBase_1 = require("../PickersInputBase");
var PickersInputBase_2 = require("../PickersInputBase/PickersInputBase");
var usePickerTextFieldOwnerState_1 = require("../usePickerTextFieldOwnerState");
var PickersFilledInputRoot = (0, styles_1.styled)(PickersInputBase_2.PickersInputBaseRoot, {
    name: 'MuiPickersFilledInput',
    slot: 'Root',
    shouldForwardProp: function (prop) { return (0, system_1.shouldForwardProp)(prop) && prop !== 'disableUnderline'; },
})(function (_a) {
    var _b, _c;
    var _d;
    var theme = _a.theme;
    var light = theme.palette.mode === 'light';
    var bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)';
    var backgroundColor = light ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.09)';
    var hoverBackground = light ? 'rgba(0, 0, 0, 0.09)' : 'rgba(255, 255, 255, 0.13)';
    var disabledBackground = light ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)';
    return _b = {
            backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor,
            borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
            borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
            transition: theme.transitions.create('background-color', {
                duration: theme.transitions.duration.shorter,
                easing: theme.transitions.easing.easeOut,
            }),
            '&:hover': {
                backgroundColor: theme.vars ? theme.vars.palette.FilledInput.hoverBg : hoverBackground,
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor,
                },
            }
        },
        _b["&.".concat(pickersFilledInputClasses_1.pickersFilledInputClasses.focused)] = {
            backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor,
        },
        _b["&.".concat(pickersFilledInputClasses_1.pickersFilledInputClasses.disabled)] = {
            backgroundColor: theme.vars ? theme.vars.palette.FilledInput.disabledBg : disabledBackground,
        },
        _b.variants = __spreadArray(__spreadArray([], Object.keys(((_d = theme.vars) !== null && _d !== void 0 ? _d : theme).palette)
            // @ts-ignore
            .filter(function (key) { var _a; return ((_a = theme.vars) !== null && _a !== void 0 ? _a : theme).palette[key].main; })
            .map(function (color) {
            var _a;
            return ({
                props: { inputColor: color, disableUnderline: false },
                style: {
                    '&::after': {
                        // @ts-ignore
                        borderBottom: "2px solid ".concat((_a = (theme.vars || theme).palette[color]) === null || _a === void 0 ? void 0 : _a.main),
                    },
                },
            });
        }), true), [
            {
                props: { disableUnderline: false },
                style: (_c = {
                        '&::after': {
                            left: 0,
                            bottom: 0,
                            // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
                            content: '""',
                            position: 'absolute',
                            right: 0,
                            transform: 'scaleX(0)',
                            transition: theme.transitions.create('transform', {
                                duration: theme.transitions.duration.shorter,
                                easing: theme.transitions.easing.easeOut,
                            }),
                            pointerEvents: 'none', // Transparent to the hover style.
                        }
                    },
                    _c["&.".concat(pickersFilledInputClasses_1.pickersFilledInputClasses.focused, ":after")] = {
                        // translateX(0) is a workaround for Safari transform scale bug
                        // See https://github.com/mui/material-ui/issues/31766
                        transform: 'scaleX(1) translateX(0)',
                    },
                    _c["&.".concat(pickersFilledInputClasses_1.pickersFilledInputClasses.error)] = {
                        '&:before, &:after': {
                            borderBottomColor: (theme.vars || theme).palette.error.main,
                        },
                    },
                    _c['&::before'] = {
                        borderBottom: "1px solid ".concat(theme.vars
                            ? "rgba(".concat(theme.vars.palette.common.onBackgroundChannel, " / ").concat(theme.vars.opacity.inputUnderline, ")")
                            : bottomLineColor),
                        left: 0,
                        bottom: 0,
                        // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
                        content: '"\\00a0"',
                        position: 'absolute',
                        right: 0,
                        transition: theme.transitions.create('border-bottom-color', {
                            duration: theme.transitions.duration.shorter,
                        }),
                        pointerEvents: 'none', // Transparent to the hover style.
                    },
                    _c["&:hover:not(.".concat(pickersFilledInputClasses_1.pickersFilledInputClasses.disabled, ", .").concat(pickersFilledInputClasses_1.pickersFilledInputClasses.error, "):before")] = {
                        borderBottom: "1px solid ".concat((theme.vars || theme).palette.text.primary),
                    },
                    _c["&.".concat(pickersFilledInputClasses_1.pickersFilledInputClasses.disabled, ":before")] = {
                        borderBottomStyle: 'dotted',
                    },
                    _c),
            },
            {
                props: { hasStartAdornment: true },
                style: {
                    paddingLeft: 12,
                },
            },
            {
                props: { hasEndAdornment: true },
                style: {
                    paddingRight: 12,
                },
            },
        ], false),
        _b;
});
var PickersFilledSectionsContainer = (0, styles_1.styled)(PickersInputBase_2.PickersInputBaseSectionsContainer, {
    name: 'MuiPickersFilledInput',
    slot: 'sectionsContainer',
    shouldForwardProp: function (prop) { return (0, system_1.shouldForwardProp)(prop) && prop !== 'hiddenLabel'; },
})({
    paddingTop: 25,
    paddingRight: 12,
    paddingBottom: 8,
    paddingLeft: 12,
    variants: [
        {
            props: { inputSize: 'small' },
            style: {
                paddingTop: 21,
                paddingBottom: 4,
            },
        },
        {
            props: { hasStartAdornment: true },
            style: {
                paddingLeft: 0,
            },
        },
        {
            props: { hasEndAdornment: true },
            style: {
                paddingRight: 0,
            },
        },
        {
            props: { hiddenLabel: true },
            style: {
                paddingTop: 16,
                paddingBottom: 17,
            },
        },
        {
            props: { hiddenLabel: true, inputSize: 'small' },
            style: {
                paddingTop: 8,
                paddingBottom: 9,
            },
        },
    ],
});
var useUtilityClasses = function (classes, ownerState) {
    var inputHasUnderline = ownerState.inputHasUnderline;
    var slots = {
        root: ['root', inputHasUnderline && 'underline'],
        input: ['input'],
    };
    var composedClasses = (0, composeClasses_1.default)(slots, pickersFilledInputClasses_1.getPickersFilledInputUtilityClass, classes);
    return __assign(__assign({}, classes), composedClasses);
};
/**
 * @ignore - internal component.
 */
var PickersFilledInput = React.forwardRef(function PickersFilledInput(inProps, ref) {
    var props = (0, styles_1.useThemeProps)({
        props: inProps,
        name: 'MuiPickersFilledInput',
    });
    var label = props.label, autoFocus = props.autoFocus, _a = props.disableUnderline, disableUnderline = _a === void 0 ? false : _a, _b = props.hiddenLabel, hiddenLabel = _b === void 0 ? false : _b, classesProp = props.classes, other = __rest(props, ["label", "autoFocus", "disableUnderline", "hiddenLabel", "classes"]);
    var pickerTextFieldOwnerState = (0, usePickerTextFieldOwnerState_1.usePickerTextFieldOwnerState)();
    var ownerState = __assign(__assign({}, pickerTextFieldOwnerState), { inputHasUnderline: !disableUnderline });
    var classes = useUtilityClasses(classesProp, ownerState);
    return (<PickersInputBase_1.PickersInputBase slots={{ root: PickersFilledInputRoot, input: PickersFilledSectionsContainer }} slotProps={{ root: { disableUnderline: disableUnderline }, input: { hiddenLabel: hiddenLabel } }} {...other} label={label} classes={classes} ref={ref} ownerState={ownerState}/>);
});
exports.PickersFilledInput = PickersFilledInput;
PickersFilledInput.propTypes = {
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
    component: prop_types_1.default.elementType,
    /**
     * If true, the whole element is editable.
     * Useful when all the sections are selected.
     */
    contentEditable: prop_types_1.default.bool.isRequired,
    'data-multi-input': prop_types_1.default.string,
    disableUnderline: prop_types_1.default.bool,
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
    fullWidth: prop_types_1.default.bool,
    hiddenLabel: prop_types_1.default.bool,
    id: prop_types_1.default.string,
    inputProps: prop_types_1.default.object,
    inputRef: refType_1.default,
    label: prop_types_1.default.node,
    margin: prop_types_1.default.oneOf(['dense', 'none', 'normal']),
    name: prop_types_1.default.string,
    onChange: prop_types_1.default.func.isRequired,
    onClick: prop_types_1.default.func.isRequired,
    onInput: prop_types_1.default.func.isRequired,
    onKeyDown: prop_types_1.default.func.isRequired,
    onPaste: prop_types_1.default.func.isRequired,
    ownerState: prop_types_1.default /* @typescript-to-proptypes-ignore */.any,
    readOnly: prop_types_1.default.bool,
    renderSuffix: prop_types_1.default.func,
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
     * The props used for each component slot.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    /**
     * The components used for each slot inside.
     *
     * @default {}
     */
    slots: prop_types_1.default.object,
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
};
PickersFilledInput.muiName = 'Input';
