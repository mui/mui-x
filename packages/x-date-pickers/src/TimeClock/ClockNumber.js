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
exports.ClockNumber = ClockNumber;
var React = require("react");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var shared_1 = require("./shared");
var clockNumberClasses_1 = require("./clockNumberClasses");
var usePickerPrivateContext_1 = require("../internals/hooks/usePickerPrivateContext");
var useUtilityClasses = function (classes, ownerState) {
    var slots = {
        root: [
            'root',
            ownerState.isClockNumberSelected && 'selected',
            ownerState.isClockNumberDisabled && 'disabled',
        ],
    };
    return (0, composeClasses_1.default)(slots, clockNumberClasses_1.getClockNumberUtilityClass, classes);
};
var ClockNumberRoot = (0, styles_1.styled)('span', {
    name: 'MuiClockNumber',
    slot: 'Root',
    overridesResolver: function (_, styles) {
        var _a, _b;
        return [
            styles.root,
            (_a = {}, _a["&.".concat(clockNumberClasses_1.clockNumberClasses.disabled)] = styles.disabled, _a),
            (_b = {}, _b["&.".concat(clockNumberClasses_1.clockNumberClasses.selected)] = styles.selected, _b),
        ];
    },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            height: shared_1.CLOCK_HOUR_WIDTH,
            width: shared_1.CLOCK_HOUR_WIDTH,
            position: 'absolute',
            left: "calc((100% - ".concat(shared_1.CLOCK_HOUR_WIDTH, "px) / 2)"),
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            color: (theme.vars || theme).palette.text.primary,
            fontFamily: theme.typography.fontFamily,
            '&:focused': {
                backgroundColor: (theme.vars || theme).palette.background.paper,
            }
        },
        _b["&.".concat(clockNumberClasses_1.clockNumberClasses.selected)] = {
            color: (theme.vars || theme).palette.primary.contrastText,
        },
        _b["&.".concat(clockNumberClasses_1.clockNumberClasses.disabled)] = {
            pointerEvents: 'none',
            color: (theme.vars || theme).palette.text.disabled,
        },
        _b.variants = [
            {
                props: { isClockNumberInInnerRing: true },
                style: __assign(__assign({}, theme.typography.body2), { color: (theme.vars || theme).palette.text.secondary }),
            },
        ],
        _b);
});
/**
 * @ignore - internal component.
 */
function ClockNumber(inProps) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiClockNumber' });
    var className = props.className, classesProp = props.classes, disabled = props.disabled, index = props.index, inner = props.inner, label = props.label, selected = props.selected, other = __rest(props, ["className", "classes", "disabled", "index", "inner", "label", "selected"]);
    var pickerOwnerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var ownerState = __assign(__assign({}, pickerOwnerState), { isClockNumberInInnerRing: inner, isClockNumberSelected: selected, isClockNumberDisabled: disabled });
    var classes = useUtilityClasses(classesProp, ownerState);
    var angle = ((index % 12) / 12) * Math.PI * 2 - Math.PI / 2;
    var length = ((shared_1.CLOCK_WIDTH - shared_1.CLOCK_HOUR_WIDTH - 2) / 2) * (inner ? 0.65 : 1);
    var x = Math.round(Math.cos(angle) * length);
    var y = Math.round(Math.sin(angle) * length);
    return (<ClockNumberRoot className={(0, clsx_1.default)(classes.root, className)} aria-disabled={disabled ? true : undefined} aria-selected={selected ? true : undefined} role="option" style={{
            transform: "translate(".concat(x, "px, ").concat(y + (shared_1.CLOCK_WIDTH - shared_1.CLOCK_HOUR_WIDTH) / 2, "px"),
        }} ownerState={ownerState} {...other}>
      {label}
    </ClockNumberRoot>);
}
