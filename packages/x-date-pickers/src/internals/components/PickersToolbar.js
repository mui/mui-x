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
exports.PickersToolbar = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var Typography_1 = require("@mui/material/Typography");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var createStyled_1 = require("@mui/system/createStyled");
var pickersToolbarClasses_1 = require("./pickersToolbarClasses");
var useToolbarOwnerState_1 = require("../hooks/useToolbarOwnerState");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        title: ['title'],
        content: ['content'],
    };
    return (0, composeClasses_1.default)(slots, pickersToolbarClasses_1.getPickersToolbarUtilityClass, classes);
};
var PickersToolbarRoot = (0, styles_1.styled)('div', {
    name: 'MuiPickersToolbar',
    slot: 'Root',
})(function (_a) {
    var theme = _a.theme;
    return ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: theme.spacing(2, 3),
        variants: [
            {
                props: { pickerOrientation: 'landscape' },
                style: {
                    height: 'auto',
                    maxWidth: 160,
                    padding: 16,
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                },
            },
        ],
    });
});
var PickersToolbarContent = (0, styles_1.styled)('div', {
    name: 'MuiPickersToolbar',
    slot: 'Content',
    shouldForwardProp: function (prop) { return (0, createStyled_1.shouldForwardProp)(prop) && prop !== 'landscapeDirection'; },
})({
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    variants: [
        {
            props: { pickerOrientation: 'landscape' },
            style: {
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexDirection: 'column',
            },
        },
        {
            props: { pickerOrientation: 'landscape', landscapeDirection: 'row' },
            style: {
                flexDirection: 'row',
            },
        },
    ],
});
exports.PickersToolbar = React.forwardRef(function PickersToolbar(inProps, ref) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiPickersToolbar' });
    var children = props.children, className = props.className, classesProp = props.classes, toolbarTitle = props.toolbarTitle, hidden = props.hidden, titleId = props.titleId, inClasses = props.classes, landscapeDirection = props.landscapeDirection, other = __rest(props, ["children", "className", "classes", "toolbarTitle", "hidden", "titleId", "classes", "landscapeDirection"]);
    var ownerState = (0, useToolbarOwnerState_1.useToolbarOwnerState)();
    var classes = useUtilityClasses(classesProp);
    if (hidden) {
        return null;
    }
    return (<PickersToolbarRoot ref={ref} data-testid="picker-toolbar" className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState} {...other}>
      <Typography_1.default data-testid="picker-toolbar-title" color="text.secondary" variant="overline" id={titleId} className={classes.title}>
        {toolbarTitle}
      </Typography_1.default>
      <PickersToolbarContent className={classes.content} ownerState={ownerState} landscapeDirection={landscapeDirection}>
        {children}
      </PickersToolbarContent>
    </PickersToolbarRoot>);
});
