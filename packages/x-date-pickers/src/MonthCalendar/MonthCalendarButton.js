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
exports.MonthCalendarButton = void 0;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var usePickerPrivateContext_1 = require("../internals/hooks/usePickerPrivateContext");
var monthCalendarClasses_1 = require("./monthCalendarClasses");
var useUtilityClasses = function (classes, ownerState) {
    var slots = {
        button: [
            'button',
            ownerState.isMonthDisabled && 'disabled',
            ownerState.isMonthSelected && 'selected',
        ],
    };
    return (0, composeClasses_1.default)(slots, monthCalendarClasses_1.getMonthCalendarUtilityClass, classes);
};
var DefaultMonthButton = (0, styles_1.styled)('button', {
    name: 'MuiMonthCalendar',
    slot: 'Button',
    overridesResolver: function (_, styles) {
        var _a, _b;
        return [
            styles.button,
            (_a = {}, _a["&.".concat(monthCalendarClasses_1.monthCalendarClasses.disabled)] = styles.disabled, _a),
            (_b = {}, _b["&.".concat(monthCalendarClasses_1.monthCalendarClasses.selected)] = styles.selected, _b),
        ];
    },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (__assign(__assign({ color: 'unset', backgroundColor: 'transparent', border: 0, outline: 0 }, theme.typography.subtitle1), (_b = { height: 36, width: 72, borderRadius: 18, cursor: 'pointer', '&:focus': {
                backgroundColor: theme.vars
                    ? "rgba(".concat(theme.vars.palette.action.activeChannel, " / ").concat(theme.vars.palette.action.hoverOpacity, ")")
                    : (0, styles_1.alpha)(theme.palette.action.active, theme.palette.action.hoverOpacity),
            }, '&:hover': {
                backgroundColor: theme.vars
                    ? "rgba(".concat(theme.vars.palette.action.activeChannel, " / ").concat(theme.vars.palette.action.hoverOpacity, ")")
                    : (0, styles_1.alpha)(theme.palette.action.active, theme.palette.action.hoverOpacity),
            }, '&:disabled': {
                cursor: 'auto',
                pointerEvents: 'none',
            } }, _b["&.".concat(monthCalendarClasses_1.monthCalendarClasses.disabled)] = {
        color: (theme.vars || theme).palette.text.secondary,
    }, _b["&.".concat(monthCalendarClasses_1.monthCalendarClasses.selected)] = {
        color: (theme.vars || theme).palette.primary.contrastText,
        backgroundColor: (theme.vars || theme).palette.primary.main,
        '&:focus, &:hover': {
            backgroundColor: (theme.vars || theme).palette.primary.dark,
        },
    }, _b)));
});
/**
 * @ignore - do not document.
 */
exports.MonthCalendarButton = React.memo(function MonthCalendarButton(props) {
    var _a;
    var autoFocus = props.autoFocus, classesProp = props.classes, disabled = props.disabled, selected = props.selected, value = props.value, onClick = props.onClick, onKeyDown = props.onKeyDown, onFocus = props.onFocus, onBlur = props.onBlur, slots = props.slots, slotProps = props.slotProps, other = __rest(props, ["autoFocus", "classes", "disabled", "selected", "value", "onClick", "onKeyDown", "onFocus", "onBlur", "slots", "slotProps"]);
    var ref = React.useRef(null);
    var pickerOwnerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var ownerState = __assign(__assign({}, pickerOwnerState), { isMonthDisabled: disabled, isMonthSelected: selected });
    var classes = useUtilityClasses(classesProp, ownerState);
    // We can't forward the `autoFocus` to the button because it is a native button, not a MUI Button
    (0, useEnhancedEffect_1.default)(function () {
        var _a;
        if (autoFocus) {
            // `ref.current` being `null` would be a bug in MUI.
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, [autoFocus]);
    var MonthButton = (_a = slots === null || slots === void 0 ? void 0 : slots.monthButton) !== null && _a !== void 0 ? _a : DefaultMonthButton;
    var monthButtonProps = (0, useSlotProps_1.default)({
        elementType: MonthButton,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.monthButton,
        externalForwardedProps: other,
        additionalProps: {
            disabled: disabled,
            ref: ref,
            type: 'button',
            role: 'radio',
            'aria-checked': selected,
            onClick: function (event) { return onClick(event, value); },
            onKeyDown: function (event) { return onKeyDown(event, value); },
            onFocus: function (event) { return onFocus(event, value); },
            onBlur: function (event) { return onBlur(event, value); },
        },
        ownerState: ownerState,
        className: classes.button,
    });
    return <MonthButton {...monthButtonProps}/>;
});
