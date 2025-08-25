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
exports.PickersSlideTransition = PickersSlideTransition;
var React = require("react");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var react_transition_group_1 = require("react-transition-group");
var pickersSlideTransitionClasses_1 = require("./pickersSlideTransitionClasses");
var usePickerPrivateContext_1 = require("../internals/hooks/usePickerPrivateContext");
var useUtilityClasses = function (classes, ownerState) {
    var slideDirection = ownerState.slideDirection;
    var slots = {
        root: ['root'],
        exit: ['slideExit'],
        enterActive: ['slideEnterActive'],
        enter: ["slideEnter-".concat(slideDirection)],
        exitActive: ["slideExitActiveLeft-".concat(slideDirection)],
    };
    return (0, composeClasses_1.default)(slots, pickersSlideTransitionClasses_1.getPickersSlideTransitionUtilityClass, classes);
};
var PickersSlideTransitionRoot = (0, styles_1.styled)(react_transition_group_1.TransitionGroup, {
    name: 'MuiPickersSlideTransition',
    slot: 'Root',
    overridesResolver: function (_, styles) {
        var _a, _b, _c, _d, _e, _f;
        return [
            styles.root,
            (_a = {}, _a[".".concat(pickersSlideTransitionClasses_1.pickersSlideTransitionClasses['slideEnter-left'])] = styles['slideEnter-left'], _a),
            (_b = {}, _b[".".concat(pickersSlideTransitionClasses_1.pickersSlideTransitionClasses['slideEnter-right'])] = styles['slideEnter-right'], _b),
            (_c = {}, _c[".".concat(pickersSlideTransitionClasses_1.pickersSlideTransitionClasses.slideEnterActive)] = styles.slideEnterActive, _c),
            (_d = {}, _d[".".concat(pickersSlideTransitionClasses_1.pickersSlideTransitionClasses.slideExit)] = styles.slideExit, _d),
            (_e = {},
                _e[".".concat(pickersSlideTransitionClasses_1.pickersSlideTransitionClasses['slideExitActiveLeft-left'])] = styles['slideExitActiveLeft-left'],
                _e),
            (_f = {},
                _f[".".concat(pickersSlideTransitionClasses_1.pickersSlideTransitionClasses['slideExitActiveLeft-right'])] = styles['slideExitActiveLeft-right'],
                _f),
        ];
    },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    var slideTransition = theme.transitions.create('transform', {
        duration: theme.transitions.duration.complex,
        easing: 'cubic-bezier(0.35, 0.8, 0.4, 1)',
    });
    return _b = {
            display: 'block',
            position: 'relative',
            overflowX: 'hidden',
            '& > *': {
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
            }
        },
        _b["& .".concat(pickersSlideTransitionClasses_1.pickersSlideTransitionClasses['slideEnter-left'])] = {
            willChange: 'transform',
            transform: 'translate(100%)',
            zIndex: 1,
        },
        _b["& .".concat(pickersSlideTransitionClasses_1.pickersSlideTransitionClasses['slideEnter-right'])] = {
            willChange: 'transform',
            transform: 'translate(-100%)',
            zIndex: 1,
        },
        _b["& .".concat(pickersSlideTransitionClasses_1.pickersSlideTransitionClasses.slideEnterActive)] = {
            transform: 'translate(0%)',
            transition: slideTransition,
        },
        _b["& .".concat(pickersSlideTransitionClasses_1.pickersSlideTransitionClasses.slideExit)] = {
            transform: 'translate(0%)',
        },
        _b["& .".concat(pickersSlideTransitionClasses_1.pickersSlideTransitionClasses['slideExitActiveLeft-left'])] = {
            willChange: 'transform',
            transform: 'translate(-100%)',
            transition: slideTransition,
            zIndex: 0,
        },
        _b["& .".concat(pickersSlideTransitionClasses_1.pickersSlideTransitionClasses['slideExitActiveLeft-right'])] = {
            willChange: 'transform',
            transform: 'translate(100%)',
            transition: slideTransition,
            zIndex: 0,
        },
        _b;
});
/**
 * @ignore - do not document.
 */
function PickersSlideTransition(inProps) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiPickersSlideTransition' });
    var children = props.children, className = props.className, reduceAnimations = props.reduceAnimations, slideDirection = props.slideDirection, transKey = props.transKey, classesProp = props.classes, other = __rest(props, ["children", "className", "reduceAnimations", "slideDirection", "transKey", "classes"]);
    var pickerOwnerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var ownerState = __assign(__assign({}, pickerOwnerState), { slideDirection: slideDirection });
    var classes = useUtilityClasses(classesProp, ownerState);
    var theme = (0, styles_1.useTheme)();
    if (reduceAnimations) {
        return <div className={(0, clsx_1.default)(classes.root, className)}>{children}</div>;
    }
    var transitionClasses = {
        exit: classes.exit,
        enterActive: classes.enterActive,
        enter: classes.enter,
        exitActive: classes.exitActive,
    };
    return (<PickersSlideTransitionRoot className={(0, clsx_1.default)(classes.root, className)} childFactory={function (element) {
            return React.cloneElement(element, {
                classNames: transitionClasses,
            });
        }} role="presentation" ownerState={ownerState}>
      <react_transition_group_1.CSSTransition mountOnEnter unmountOnExit key={transKey} timeout={theme.transitions.duration.complex} classNames={transitionClasses} {...other}>
        {children}
      </react_transition_group_1.CSSTransition>
    </PickersSlideTransitionRoot>);
}
