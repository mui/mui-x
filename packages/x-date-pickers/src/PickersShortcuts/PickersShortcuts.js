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
exports.PickersShortcuts = PickersShortcuts;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var prop_types_1 = require("prop-types");
var List_1 = require("@mui/material/List");
var ListItem_1 = require("@mui/material/ListItem");
var Chip_1 = require("@mui/material/Chip");
var dimensions_1 = require("../internals/constants/dimensions");
var hooks_1 = require("../hooks");
var PickersShortcutsRoot = (0, styles_1.styled)(List_1.default, {
    name: 'MuiPickersLayout',
    slot: 'Shortcuts',
})({});
/**
 * Demos:
 *
 * - [Shortcuts](https://mui.com/x/react-date-pickers/shortcuts/)
 *
 * API:
 *
 * - [PickersShortcuts API](https://mui.com/x/api/date-pickers/pickers-shortcuts/)
 */
function PickersShortcuts(props) {
    var items = props.items, _a = props.changeImportance, changeImportance = _a === void 0 ? 'accept' : _a, other = __rest(props, ["items", "changeImportance"]);
    var setValue = (0, hooks_1.usePickerActionsContext)().setValue;
    var isValidValue = (0, hooks_1.useIsValidValue)();
    if (items == null || items.length === 0) {
        return null;
    }
    var resolvedItems = items.map(function (_a) {
        var getValue = _a.getValue, item = __rest(_a, ["getValue"]);
        var newValue = getValue({ isValid: isValidValue });
        return __assign(__assign({}, item), { label: item.label, onClick: function () {
                setValue(newValue, { changeImportance: changeImportance, shortcut: item });
            }, disabled: !isValidValue(newValue) });
    });
    return (<PickersShortcutsRoot dense sx={__spreadArray([
            {
                maxHeight: dimensions_1.VIEW_HEIGHT,
                maxWidth: 200,
                overflow: 'auto',
            }
        ], (Array.isArray(other.sx) ? other.sx : [other.sx]), true)} {...other}>
      {resolvedItems.map(function (item) {
            var _a;
            return (<ListItem_1.default key={(_a = item.id) !== null && _a !== void 0 ? _a : item.label}>
            <Chip_1.default {...item}/>
          </ListItem_1.default>);
        })}
    </PickersShortcutsRoot>);
}
PickersShortcuts.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Importance of the change when picking a shortcut:
     * - "accept": fires `onChange`, fires `onAccept` and closes the Picker.
     * - "set": fires `onChange` but do not fire `onAccept` and does not close the Picker.
     * @default "accept"
     */
    changeImportance: prop_types_1.default.oneOf(['accept', 'set']),
    className: prop_types_1.default.string,
    component: prop_types_1.default.elementType,
    /**
     * If `true`, compact vertical padding designed for keyboard and mouse input is used for
     * the list and list items.
     * The prop is available to descendant components as the `dense` context.
     * @default false
     */
    dense: prop_types_1.default.bool,
    /**
     * If `true`, vertical padding is removed from the list.
     * @default false
     */
    disablePadding: prop_types_1.default.bool,
    /**
     * Ordered array of shortcuts to display.
     * If empty, does not display the shortcuts.
     * @default []
     */
    items: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        getValue: prop_types_1.default.func.isRequired,
        id: prop_types_1.default.string,
        label: prop_types_1.default.string.isRequired,
    })),
    style: prop_types_1.default.object,
    /**
     * The content of the subheader, normally `ListSubheader`.
     */
    subheader: prop_types_1.default.node,
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
