"use strict";
'use client';
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickersLayout = exports.PickersLayoutContentWrapper = exports.PickersLayoutRoot = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var pickersLayoutClasses_1 = require("./pickersLayoutClasses");
var usePickerLayout_1 = require("./usePickerLayout");
var usePickerContext_1 = require("../hooks/usePickerContext");
var useUtilityClasses = function (classes, ownerState) {
    var pickerOrientation = ownerState.pickerOrientation;
    var slots = {
        root: ['root', pickerOrientation === 'landscape' && 'landscape'],
        contentWrapper: ['contentWrapper'],
    };
    return (0, composeClasses_1.default)(slots, pickersLayoutClasses_1.getPickersLayoutUtilityClass, classes);
};
exports.PickersLayoutRoot = (0, styles_1.styled)('div', {
    name: 'MuiPickersLayout',
    slot: 'Root',
})((_a = {
        display: 'grid',
        gridAutoColumns: 'max-content auto max-content',
        gridAutoRows: 'max-content auto max-content'
    },
    _a["& .".concat(pickersLayoutClasses_1.pickersLayoutClasses.actionBar)] = { gridColumn: '1 / 4', gridRow: 3 },
    _a.variants = [
        {
            props: { pickerOrientation: 'landscape', hasShortcuts: false },
            style: (_b = {},
                _b["& .".concat(pickersLayoutClasses_1.pickersLayoutClasses.toolbar)] = {
                    gridColumn: 1,
                    gridRow: '1 / 3',
                },
                _b),
        },
        {
            props: {
                pickerOrientation: 'landscape',
                hasShortcuts: true,
            },
            style: (_c = {},
                _c["& .".concat(pickersLayoutClasses_1.pickersLayoutClasses.toolbar)] = {
                    gridColumn: '2 / 4',
                    gridRow: 1,
                    maxWidth: 'max-content',
                },
                _c["& .".concat(pickersLayoutClasses_1.pickersLayoutClasses.shortcuts)] = {
                    gridColumn: 1,
                    gridRow: 2,
                },
                _c),
        },
        {
            props: { pickerOrientation: 'portrait' },
            style: (_d = {},
                _d["& .".concat(pickersLayoutClasses_1.pickersLayoutClasses.toolbar)] = { gridColumn: '2 / 4', gridRow: 1 },
                _d["& .".concat(pickersLayoutClasses_1.pickersLayoutClasses.shortcuts)] = {
                    gridColumn: 1,
                    gridRow: '2 / 3',
                },
                _d),
        },
        {
            props: { hasShortcuts: true, layoutDirection: 'rtl' },
            style: (_e = {},
                _e["& .".concat(pickersLayoutClasses_1.pickersLayoutClasses.shortcuts)] = {
                    gridColumn: 4,
                },
                _e),
        },
    ],
    _a));
exports.PickersLayoutContentWrapper = (0, styles_1.styled)('div', {
    name: 'MuiPickersLayout',
    slot: 'ContentWrapper',
})({
    gridColumn: '2 / 4',
    gridRow: 2,
    display: 'flex',
    flexDirection: 'column',
});
/**
 * Demos:
 *
 * - [Custom layout](https://mui.com/x/react-date-pickers/custom-layout/)
 *
 * API:
 *
 * - [PickersLayout API](https://mui.com/x/api/date-pickers/pickers-layout/)
 */
var PickersLayout = React.forwardRef(function PickersLayout(inProps, ref) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiPickersLayout' });
    var _a = (0, usePickerLayout_1.default)(props), toolbar = _a.toolbar, content = _a.content, tabs = _a.tabs, actionBar = _a.actionBar, shortcuts = _a.shortcuts, ownerState = _a.ownerState;
    var _b = (0, usePickerContext_1.usePickerContext)(), orientation = _b.orientation, variant = _b.variant;
    var sx = props.sx, className = props.className, classesProp = props.classes;
    var classes = useUtilityClasses(classesProp, ownerState);
    return (<exports.PickersLayoutRoot ref={ref} sx={sx} className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState}>
      {orientation === 'landscape' ? shortcuts : toolbar}
      {orientation === 'landscape' ? toolbar : shortcuts}
      <exports.PickersLayoutContentWrapper className={classes.contentWrapper} ownerState={ownerState}>
        {variant === 'desktop' ? (<React.Fragment>
            {content}
            {tabs}
          </React.Fragment>) : (<React.Fragment>
            {tabs}
            {content}
          </React.Fragment>)}
      </exports.PickersLayoutContentWrapper>
      {actionBar}
    </exports.PickersLayoutRoot>);
});
exports.PickersLayout = PickersLayout;
PickersLayout.propTypes = {
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
