"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesktopDateTimePickerLayout = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var Divider_1 = require("@mui/material/Divider");
var PickersLayout_1 = require("../PickersLayout");
var usePickerContext_1 = require("../hooks/usePickerContext");
/**
 * @ignore - internal component.
 */
var DesktopDateTimePickerLayout = React.forwardRef(function DesktopDateTimePickerLayout(props, ref) {
    var _a;
    var _b, _c;
    var _d = (0, PickersLayout_1.usePickerLayout)(props), toolbar = _d.toolbar, tabs = _d.tabs, content = _d.content, actionBar = _d.actionBar, shortcuts = _d.shortcuts, ownerState = _d.ownerState;
    var orientation = (0, usePickerContext_1.usePickerContext)().orientation;
    var sx = props.sx, className = props.className, classes = props.classes;
    var isActionBarVisible = actionBar && ((_c = (_b = actionBar.props.actions) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 0;
    return (<PickersLayout_1.PickersLayoutRoot ref={ref} className={(0, clsx_1.default)(PickersLayout_1.pickersLayoutClasses.root, classes === null || classes === void 0 ? void 0 : classes.root, className)} sx={__spreadArray([
            (_a = {},
                _a["& .".concat(PickersLayout_1.pickersLayoutClasses.tabs)] = { gridRow: 4, gridColumn: '1 / 4' },
                _a["& .".concat(PickersLayout_1.pickersLayoutClasses.actionBar)] = { gridRow: 5 },
                _a)
        ], (Array.isArray(sx) ? sx : [sx]), true)} ownerState={ownerState}>
      {orientation === 'landscape' ? shortcuts : toolbar}
      {orientation === 'landscape' ? toolbar : shortcuts}
      <PickersLayout_1.PickersLayoutContentWrapper className={(0, clsx_1.default)(PickersLayout_1.pickersLayoutClasses.contentWrapper, classes === null || classes === void 0 ? void 0 : classes.contentWrapper)} ownerState={ownerState} sx={{ display: 'grid' }}>
        {content}
        {tabs}
        {isActionBarVisible && <Divider_1.default sx={{ gridRow: 3, gridColumn: '1 / 4' }}/>}
      </PickersLayout_1.PickersLayoutContentWrapper>
      {actionBar}
    </PickersLayout_1.PickersLayoutRoot>);
});
exports.DesktopDateTimePickerLayout = DesktopDateTimePickerLayout;
DesktopDateTimePickerLayout.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    children: prop_types_1.default.node,
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable component slots.
     * @default {}
     */
    slots: prop_types_1.default.object,
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
