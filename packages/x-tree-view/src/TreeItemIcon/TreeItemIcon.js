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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeItemIcon = TreeItemIcon;
var React = require("react");
var prop_types_1 = require("prop-types");
var resolveComponentProps_1 = require("@mui/utils/resolveComponentProps");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var TreeViewStyleContext_1 = require("../internals/TreeViewProvider/TreeViewStyleContext");
var icons_1 = require("../icons");
function TreeItemIcon(props) {
    var _a, _b, _c, _d, _e;
    var slotsFromTreeItem = props.slots, slotPropsFromTreeItem = props.slotProps, status = props.status;
    var _f = (0, TreeViewStyleContext_1.useTreeViewStyleContext)(), slotsFromTreeView = _f.slots, slotPropsFromTreeView = _f.slotProps;
    var slots = {
        collapseIcon: (_b = (_a = slotsFromTreeItem === null || slotsFromTreeItem === void 0 ? void 0 : slotsFromTreeItem.collapseIcon) !== null && _a !== void 0 ? _a : slotsFromTreeView.collapseIcon) !== null && _b !== void 0 ? _b : icons_1.TreeViewCollapseIcon,
        expandIcon: (_d = (_c = slotsFromTreeItem === null || slotsFromTreeItem === void 0 ? void 0 : slotsFromTreeItem.expandIcon) !== null && _c !== void 0 ? _c : slotsFromTreeView.expandIcon) !== null && _d !== void 0 ? _d : icons_1.TreeViewExpandIcon,
        endIcon: (_e = slotsFromTreeItem === null || slotsFromTreeItem === void 0 ? void 0 : slotsFromTreeItem.endIcon) !== null && _e !== void 0 ? _e : slotsFromTreeView.endIcon,
        icon: slotsFromTreeItem === null || slotsFromTreeItem === void 0 ? void 0 : slotsFromTreeItem.icon,
    };
    var iconName;
    if (slots === null || slots === void 0 ? void 0 : slots.icon) {
        iconName = 'icon';
    }
    else if (status.expandable) {
        if (status.expanded) {
            iconName = 'collapseIcon';
        }
        else {
            iconName = 'expandIcon';
        }
    }
    else {
        iconName = 'endIcon';
    }
    var Icon = slots[iconName];
    var iconProps = (0, useSlotProps_1.default)({
        elementType: Icon,
        externalSlotProps: function (tempOwnerState) { return (__assign(__assign({}, (0, resolveComponentProps_1.default)(slotPropsFromTreeView[iconName], tempOwnerState)), (0, resolveComponentProps_1.default)(slotPropsFromTreeItem === null || slotPropsFromTreeItem === void 0 ? void 0 : slotPropsFromTreeItem[iconName], tempOwnerState))); },
        // TODO: Add proper ownerState
        ownerState: {},
    });
    if (!Icon) {
        return null;
    }
    return <Icon {...iconProps}/>;
}
TreeItemIcon.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
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
    status: prop_types_1.default.shape({
        disabled: prop_types_1.default.bool.isRequired,
        editable: prop_types_1.default.bool.isRequired,
        editing: prop_types_1.default.bool.isRequired,
        error: prop_types_1.default.bool.isRequired,
        expandable: prop_types_1.default.bool.isRequired,
        expanded: prop_types_1.default.bool.isRequired,
        focused: prop_types_1.default.bool.isRequired,
        loading: prop_types_1.default.bool.isRequired,
        selected: prop_types_1.default.bool.isRequired,
    }).isRequired,
};
