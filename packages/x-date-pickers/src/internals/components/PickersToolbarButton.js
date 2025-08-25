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
exports.PickersToolbarButton = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var Button_1 = require("@mui/material/Button");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var PickersToolbarText_1 = require("./PickersToolbarText");
var pickersToolbarClasses_1 = require("./pickersToolbarClasses");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
    };
    return (0, composeClasses_1.default)(slots, pickersToolbarClasses_1.getPickersToolbarUtilityClass, classes);
};
var PickersToolbarButtonRoot = (0, styles_1.styled)(Button_1.default, {
    name: 'MuiPickersToolbarButton',
    slot: 'Root',
})({
    padding: 0,
    minWidth: 16,
    textTransform: 'none',
});
exports.PickersToolbarButton = React.forwardRef(function PickersToolbarButton(inProps, ref) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiPickersToolbarButton' });
    var align = props.align, className = props.className, classesProp = props.classes, selected = props.selected, typographyClassName = props.typographyClassName, value = props.value, variant = props.variant, width = props.width, other = __rest(props, ["align", "className", "classes", "selected", "typographyClassName", "value", "variant", "width"]);
    var classes = useUtilityClasses(classesProp);
    return (<PickersToolbarButtonRoot data-testid="toolbar-button" variant="text" ref={ref} className={(0, clsx_1.default)(classes.root, className)} ownerState={props} {...(width ? { sx: { width: width } } : {})} {...other}>
      <PickersToolbarText_1.PickersToolbarText align={align} className={typographyClassName} variant={variant} value={value} selected={selected}/>
    </PickersToolbarButtonRoot>);
});
