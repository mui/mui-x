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
var React = require("react");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var composeClasses_1 = require("@mui/utils/composeClasses");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var PickersActionBar_1 = require("../PickersActionBar");
var pickersLayoutClasses_1 = require("./pickersLayoutClasses");
var PickersShortcuts_1 = require("../PickersShortcuts");
var usePickerPrivateContext_1 = require("../internals/hooks/usePickerPrivateContext");
var hooks_1 = require("../hooks");
function toolbarHasView(toolbarProps) {
    return toolbarProps.view !== null;
}
var useUtilityClasses = function (classes, ownerState) {
    var pickerOrientation = ownerState.pickerOrientation;
    var slots = {
        root: ['root', pickerOrientation === 'landscape' && 'landscape'],
        contentWrapper: ['contentWrapper'],
        toolbar: ['toolbar'],
        actionBar: ['actionBar'],
        tabs: ['tabs'],
        landscape: ['landscape'],
        shortcuts: ['shortcuts'],
    };
    return (0, composeClasses_1.default)(slots, pickersLayoutClasses_1.getPickersLayoutUtilityClass, classes);
};
var usePickerLayout = function (props) {
    var _a, _b;
    var _c = (0, usePickerPrivateContext_1.usePickerPrivateContext)(), pickerOwnerState = _c.ownerState, defaultActionBarActions = _c.defaultActionBarActions;
    var view = (0, hooks_1.usePickerContext)().view;
    var isRtl = (0, RtlProvider_1.useRtl)();
    var children = props.children, slots = props.slots, slotProps = props.slotProps, classesProp = props.classes;
    var ownerState = React.useMemo(function () { return (__assign(__assign({}, pickerOwnerState), { layoutDirection: isRtl ? 'rtl' : 'ltr', hasShortcuts: false })); }, [pickerOwnerState, isRtl]);
    var classes = useUtilityClasses(classesProp, ownerState);
    // Action bar
    var ActionBar = (_a = slots === null || slots === void 0 ? void 0 : slots.actionBar) !== null && _a !== void 0 ? _a : PickersActionBar_1.PickersActionBar;
    var _d = (0, useSlotProps_1.default)({
        elementType: ActionBar,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.actionBar,
        additionalProps: {
            actions: defaultActionBarActions,
        },
        className: classes.actionBar,
        ownerState: ownerState,
    }), 
    // PickersActionBar does not use it and providing it breaks memoization
    destructuredOwnerState = _d.ownerState, actionBarProps = __rest(_d, ["ownerState"]);
    var actionBar = <ActionBar {...actionBarProps}/>;
    // Toolbar
    var Toolbar = slots === null || slots === void 0 ? void 0 : slots.toolbar;
    var toolbarProps = (0, useSlotProps_1.default)({
        elementType: Toolbar,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.toolbar,
        className: classes.toolbar,
        ownerState: ownerState,
    });
    var toolbar = toolbarHasView(toolbarProps) && !!Toolbar ? <Toolbar {...toolbarProps}/> : null;
    // Content
    var content = children;
    // Tabs
    var Tabs = slots === null || slots === void 0 ? void 0 : slots.tabs;
    var tabs = view && Tabs ? <Tabs className={classes.tabs} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.tabs}/> : null;
    // Shortcuts
    var Shortcuts = (_b = slots === null || slots === void 0 ? void 0 : slots.shortcuts) !== null && _b !== void 0 ? _b : PickersShortcuts_1.PickersShortcuts;
    var shortcutsProps = (0, useSlotProps_1.default)({
        elementType: Shortcuts,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.shortcuts,
        className: classes.shortcuts,
        ownerState: ownerState,
    });
    var hasShortcuts = Array.isArray(shortcutsProps === null || shortcutsProps === void 0 ? void 0 : shortcutsProps.items) && shortcutsProps.items.length > 0;
    var shortcuts = view && !!Shortcuts ? <Shortcuts {...shortcutsProps}/> : null;
    return {
        toolbar: toolbar,
        content: content,
        tabs: tabs,
        actionBar: actionBar,
        shortcuts: shortcuts,
        ownerState: __assign(__assign({}, ownerState), { hasShortcuts: hasShortcuts }),
    };
};
exports.default = usePickerLayout;
