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
exports.PickersInput = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var createStyled_1 = require("@mui/system/createStyled");
var refType_1 = require("@mui/utils/refType");
var composeClasses_1 = require("@mui/utils/composeClasses");
var pickersInputClasses_1 = require("./pickersInputClasses");
var PickersInputBase_1 = require("../PickersInputBase");
var PickersInputBase_2 = require("../PickersInputBase/PickersInputBase");
var usePickerTextFieldOwnerState_1 = require("../usePickerTextFieldOwnerState");
var PickersInputRoot = (0, styles_1.styled)(PickersInputBase_2.PickersInputBaseRoot, {
    name: 'MuiPickersInput',
    slot: 'Root',
    shouldForwardProp: function (prop) { return (0, createStyled_1.shouldForwardProp)(prop) && prop !== 'disableUnderline'; },
})(function (_a) {
    var _b;
    var _c;
    var theme = _a.theme;
    var light = theme.palette.mode === 'light';
    var bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)';
    if (theme.vars) {
        bottomLineColor = "rgba(".concat(theme.vars.palette.common.onBackgroundChannel, " / ").concat(theme.vars.opacity.inputUnderline, ")");
    }
    return {
        'label + &': {
            marginTop: 16,
        },
        variants: __spreadArray(__spreadArray([], Object.keys(((_c = theme.vars) !== null && _c !== void 0 ? _c : theme).palette)
            // @ts-ignore
            .filter(function (key) { var _a; return ((_a = theme.vars) !== null && _a !== void 0 ? _a : theme).palette[key].main; })
            .map(function (color) { return ({
            props: {
                inputColor: color,
                inputHasUnderline: true,
            },
            style: {
                '&::after': {
                    // @ts-ignore
                    borderBottom: "2px solid ".concat((theme.vars || theme).palette[color].main),
                },
            },
        }); }), true), [
            {
                props: { inputHasUnderline: true },
                style: (_b = {
                        '&::after': {
                            background: 'red',
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
                    _b["&.".concat(pickersInputClasses_1.pickersInputClasses.focused, ":after")] = {
                        // translateX(0) is a workaround for Safari transform scale bug
                        // See https://github.com/mui/material-ui/issues/31766
                        transform: 'scaleX(1) translateX(0)',
                    },
                    _b["&.".concat(pickersInputClasses_1.pickersInputClasses.error)] = {
                        '&:before, &:after': {
                            borderBottomColor: (theme.vars || theme).palette.error.main,
                        },
                    },
                    _b['&::before'] = {
                        borderBottom: "1px solid ".concat(bottomLineColor),
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
                    _b["&:hover:not(.".concat(pickersInputClasses_1.pickersInputClasses.disabled, ", .").concat(pickersInputClasses_1.pickersInputClasses.error, "):before")] = {
                        borderBottom: "2px solid ".concat((theme.vars || theme).palette.text.primary),
                        // Reset on touch devices, it doesn't add specificity
                        '@media (hover: none)': {
                            borderBottom: "1px solid ".concat(bottomLineColor),
                        },
                    },
                    _b["&.".concat(pickersInputClasses_1.pickersInputClasses.disabled, ":before")] = {
                        borderBottomStyle: 'dotted',
                    },
                    _b),
            },
        ], false),
    };
});
var useUtilityClasses = function (classes, ownerState) {
    var inputHasUnderline = ownerState.inputHasUnderline;
    var slots = {
        root: ['root', !inputHasUnderline && 'underline'],
        input: ['input'],
    };
    var composedClasses = (0, composeClasses_1.default)(slots, pickersInputClasses_1.getPickersInputUtilityClass, classes);
    return __assign(__assign({}, classes), composedClasses);
};
/**
 * @ignore - internal component.
 */
var PickersInput = React.forwardRef(function PickersInput(inProps, ref) {
    var props = (0, styles_1.useThemeProps)({
        props: inProps,
        name: 'MuiPickersInput',
    });
    var label = props.label, autoFocus = props.autoFocus, _a = props.disableUnderline, disableUnderline = _a === void 0 ? false : _a, ownerStateProp = props.ownerState, classesProp = props.classes, other = __rest(props, ["label", "autoFocus", "disableUnderline", "ownerState", "classes"]);
    var pickerTextFieldOwnerState = (0, usePickerTextFieldOwnerState_1.usePickerTextFieldOwnerState)();
    var ownerState = __assign(__assign({}, pickerTextFieldOwnerState), { inputHasUnderline: !disableUnderline });
    var classes = useUtilityClasses(classesProp, ownerState);
    return (<PickersInputBase_1.PickersInputBase slots={{ root: PickersInputRoot }} slotProps={{ root: { disableUnderline: disableUnderline } }} {...other} ownerState={ownerState} label={label} classes={classes} ref={ref}/>);
});
exports.PickersInput = PickersInput;
PickersInput.propTypes = {
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
PickersInput.muiName = 'Input';
