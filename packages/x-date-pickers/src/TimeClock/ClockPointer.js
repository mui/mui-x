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
exports.ClockPointer = ClockPointer;
var React = require("react");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var shared_1 = require("./shared");
var clockPointerClasses_1 = require("./clockPointerClasses");
var usePickerPrivateContext_1 = require("../internals/hooks/usePickerPrivateContext");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        thumb: ['thumb'],
    };
    return (0, composeClasses_1.default)(slots, clockPointerClasses_1.getClockPointerUtilityClass, classes);
};
var ClockPointerRoot = (0, styles_1.styled)('div', {
    name: 'MuiClockPointer',
    slot: 'Root',
})(function (_a) {
    var theme = _a.theme;
    return ({
        width: 2,
        backgroundColor: (theme.vars || theme).palette.primary.main,
        position: 'absolute',
        left: 'calc(50% - 1px)',
        bottom: '50%',
        transformOrigin: 'center bottom 0px',
        variants: [
            {
                props: { isClockPointerAnimated: true },
                style: {
                    transition: theme.transitions.create(['transform', 'height']),
                },
            },
        ],
    });
});
var ClockPointerThumb = (0, styles_1.styled)('div', {
    name: 'MuiClockPointer',
    slot: 'Thumb',
})(function (_a) {
    var theme = _a.theme;
    return ({
        width: 4,
        height: 4,
        backgroundColor: (theme.vars || theme).palette.primary.contrastText,
        borderRadius: '50%',
        position: 'absolute',
        top: -21,
        left: "calc(50% - ".concat(shared_1.CLOCK_HOUR_WIDTH / 2, "px)"),
        border: "".concat((shared_1.CLOCK_HOUR_WIDTH - 4) / 2, "px solid ").concat((theme.vars || theme).palette.primary.main),
        boxSizing: 'content-box',
        variants: [
            {
                props: { isClockPointerBetweenTwoValues: false },
                style: {
                    backgroundColor: (theme.vars || theme).palette.primary.main,
                },
            },
        ],
    });
});
/**
 * @ignore - internal component.
 */
function ClockPointer(inProps) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiClockPointer' });
    var className = props.className, classesProp = props.classes, isBetweenTwoClockValues = props.isBetweenTwoClockValues, isInner = props.isInner, type = props.type, viewValue = props.viewValue, other = __rest(props, ["className", "classes", "isBetweenTwoClockValues", "isInner", "type", "viewValue"]);
    var previousType = React.useRef(type);
    React.useEffect(function () {
        previousType.current = type;
    }, [type]);
    var pickerOwnerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var ownerState = __assign(__assign({}, pickerOwnerState), { isClockPointerAnimated: previousType.current !== type, isClockPointerBetweenTwoValues: isBetweenTwoClockValues });
    var classes = useUtilityClasses(classesProp);
    var getAngleStyle = function () {
        var max = type === 'hours' ? 12 : 60;
        var angle = (360 / max) * viewValue;
        if (type === 'hours' && viewValue > 12) {
            angle -= 360; // round up angle to max 360 degrees
        }
        return {
            height: Math.round((isInner ? 0.26 : 0.4) * shared_1.CLOCK_WIDTH),
            transform: "rotateZ(".concat(angle, "deg)"),
        };
    };
    return (<ClockPointerRoot style={getAngleStyle()} className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState} {...other}>
      <ClockPointerThumb ownerState={ownerState} className={classes.thumb}/>
    </ClockPointerRoot>);
}
