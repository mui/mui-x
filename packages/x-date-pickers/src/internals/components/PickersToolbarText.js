"use strict";
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
exports.PickersToolbarText = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var Typography_1 = require("@mui/material/Typography");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var pickersToolbarTextClasses_1 = require("./pickersToolbarTextClasses");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
    };
    return (0, composeClasses_1.default)(slots, pickersToolbarTextClasses_1.getPickersToolbarTextUtilityClass, classes);
};
var PickersToolbarTextRoot = (0, styles_1.styled)(Typography_1.default, {
    name: 'MuiPickersToolbarText',
    slot: 'Root',
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            transition: theme.transitions.create('color'),
            color: (theme.vars || theme).palette.text.secondary
        },
        _b["&[data-selected]"] = {
            color: (theme.vars || theme).palette.text.primary,
        },
        _b);
});
exports.PickersToolbarText = React.forwardRef(function PickersToolbarText(inProps, ref) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiPickersToolbarText' });
    var className = props.className, classesProp = props.classes, selected = props.selected, value = props.value, other = __rest(props, ["className", "classes", "selected", "value"]);
    var classes = useUtilityClasses(classesProp);
    return (<PickersToolbarTextRoot ref={ref} className={(0, clsx_1.default)(classes.root, className)} component="span" ownerState={props} {...(selected && { 'data-selected': true })} {...other}>
        {value}
      </PickersToolbarTextRoot>);
});
