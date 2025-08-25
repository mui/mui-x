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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickersOutlinedInput = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var FormControl_1 = require("@mui/material/FormControl");
var styles_1 = require("@mui/material/styles");
var refType_1 = require("@mui/utils/refType");
var composeClasses_1 = require("@mui/utils/composeClasses");
var pickersOutlinedInputClasses_1 = require("./pickersOutlinedInputClasses");
var Outline_1 = require("./Outline");
var PickersInputBase_1 = require("../PickersInputBase");
var PickersInputBase_2 = require("../PickersInputBase/PickersInputBase");
var PickersOutlinedInputRoot = (0, styles_1.styled)(PickersInputBase_2.PickersInputBaseRoot, {
    name: 'MuiPickersOutlinedInput',
    slot: 'Root',
})(function (_a) {
    var _b, _c, _d;
    var _e;
    var theme = _a.theme;
    var borderColor = theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
    return _b = {
            padding: '0 14px',
            borderRadius: (theme.vars || theme).shape.borderRadius
        },
        _b["&:hover .".concat(pickersOutlinedInputClasses_1.pickersOutlinedInputClasses.notchedOutline)] = {
            borderColor: (theme.vars || theme).palette.text.primary,
        },
        // Reset on touch devices, it doesn't add specificity
        _b['@media (hover: none)'] = (_c = {},
            _c["&:hover .".concat(pickersOutlinedInputClasses_1.pickersOutlinedInputClasses.notchedOutline)] = {
                borderColor: theme.vars
                    ? "rgba(".concat(theme.vars.palette.common.onBackgroundChannel, " / 0.23)")
                    : borderColor,
            },
            _c),
        _b["&.".concat(pickersOutlinedInputClasses_1.pickersOutlinedInputClasses.focused, " .").concat(pickersOutlinedInputClasses_1.pickersOutlinedInputClasses.notchedOutline)] = {
            borderStyle: 'solid',
            borderWidth: 2,
        },
        _b["&.".concat(pickersOutlinedInputClasses_1.pickersOutlinedInputClasses.disabled)] = (_d = {},
            _d["& .".concat(pickersOutlinedInputClasses_1.pickersOutlinedInputClasses.notchedOutline)] = {
                borderColor: (theme.vars || theme).palette.action.disabled,
            },
            _d['*'] = {
                color: (theme.vars || theme).palette.action.disabled,
            },
            _d),
        _b["&.".concat(pickersOutlinedInputClasses_1.pickersOutlinedInputClasses.error, " .").concat(pickersOutlinedInputClasses_1.pickersOutlinedInputClasses.notchedOutline)] = {
            borderColor: (theme.vars || theme).palette.error.main,
        },
        _b.variants = Object.keys(((_e = theme.vars) !== null && _e !== void 0 ? _e : theme).palette)
            // @ts-ignore
            .filter(function (key) { var _a, _b, _c; return (_c = (_b = ((_a = theme.vars) !== null && _a !== void 0 ? _a : theme).palette[key]) === null || _b === void 0 ? void 0 : _b.main) !== null && _c !== void 0 ? _c : false; })
            .map(function (color) {
            var _a;
            return ({
                props: { inputColor: color },
                style: (_a = {},
                    _a["&.".concat(pickersOutlinedInputClasses_1.pickersOutlinedInputClasses.focused, ":not(.").concat(pickersOutlinedInputClasses_1.pickersOutlinedInputClasses.error, ") .").concat(pickersOutlinedInputClasses_1.pickersOutlinedInputClasses.notchedOutline)] = {
                        // @ts-ignore
                        borderColor: (theme.vars || theme).palette[color].main,
                    },
                    _a),
            });
        }),
        _b;
});
var PickersOutlinedInputSectionsContainer = (0, styles_1.styled)(PickersInputBase_2.PickersInputBaseSectionsContainer, {
    name: 'MuiPickersOutlinedInput',
    slot: 'SectionsContainer',
})({
    padding: '16.5px 0',
    variants: [
        {
            props: { inputSize: 'small' },
            style: {
                padding: '8.5px 0',
            },
        },
    ],
});
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        notchedOutline: ['notchedOutline'],
        input: ['input'],
    };
    var composedClasses = (0, composeClasses_1.default)(slots, pickersOutlinedInputClasses_1.getPickersOutlinedInputUtilityClass, classes);
    return __assign(__assign({}, classes), composedClasses);
};
/**
 * @ignore - internal component.
 */
var PickersOutlinedInput = React.forwardRef(function PickersOutlinedInput(inProps, ref) {
    var props = (0, styles_1.useThemeProps)({
        props: inProps,
        name: 'MuiPickersOutlinedInput',
    });
    var label = props.label, autoFocus = props.autoFocus, ownerStateProp = props.ownerState, classesProp = props.classes, notched = props.notched, other = __rest(props, ["label", "autoFocus", "ownerState", "classes", "notched"]);
    var muiFormControl = (0, FormControl_1.useFormControl)();
    var classes = useUtilityClasses(classesProp);
    return (<PickersInputBase_1.PickersInputBase slots={{ root: PickersOutlinedInputRoot, input: PickersOutlinedInputSectionsContainer }} renderSuffix={function (state) { return (<Outline_1.default shrink={Boolean(notched || state.adornedStart || state.focused || state.filled)} notched={Boolean(notched || state.adornedStart || state.focused || state.filled)} className={classes.notchedOutline} label={label != null && label !== '' && (muiFormControl === null || muiFormControl === void 0 ? void 0 : muiFormControl.required) ? (<React.Fragment>
                {label}
                &thinsp;{'*'}
              </React.Fragment>) : (label)}/>); }} {...other} label={label} classes={classes} ref={ref}/>);
});
exports.PickersOutlinedInput = PickersOutlinedInput;
PickersOutlinedInput.propTypes = {
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
    notched: prop_types_1.default.bool,
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
PickersOutlinedInput.muiName = 'Input';
