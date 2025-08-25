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
exports.PickersFadeTransitionGroup = PickersFadeTransitionGroup;
var React = require("react");
var clsx_1 = require("clsx");
var react_transition_group_1 = require("react-transition-group");
var Fade_1 = require("@mui/material/Fade");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var pickersFadeTransitionGroupClasses_1 = require("./pickersFadeTransitionGroupClasses");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
    };
    return (0, composeClasses_1.default)(slots, pickersFadeTransitionGroupClasses_1.getPickersFadeTransitionGroupUtilityClass, classes);
};
var PickersFadeTransitionGroupRoot = (0, styles_1.styled)(react_transition_group_1.TransitionGroup, {
    name: 'MuiPickersFadeTransitionGroup',
    slot: 'Root',
})({
    display: 'block',
    position: 'relative',
});
/**
 * @ignore - do not document.
 */
function PickersFadeTransitionGroup(inProps) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiPickersFadeTransitionGroup' });
    var className = props.className, reduceAnimations = props.reduceAnimations, transKey = props.transKey, classesProp = props.classes;
    var children = props.children, other = __rest(props, ["children"]);
    var classes = useUtilityClasses(classesProp);
    var theme = (0, styles_1.useTheme)();
    if (reduceAnimations) {
        return children;
    }
    return (<PickersFadeTransitionGroupRoot className={(0, clsx_1.default)(classes.root, className)} ownerState={other}>
      <Fade_1.default appear={false} mountOnEnter unmountOnExit key={transKey} timeout={{
            appear: theme.transitions.duration.enteringScreen,
            enter: theme.transitions.duration.enteringScreen,
            exit: 0,
        }}>
        {children}
      </Fade_1.default>
    </PickersFadeTransitionGroupRoot>);
}
