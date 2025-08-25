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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTreeViewSelectionItemPlugin = void 0;
var fastObjectShallowCompare_1 = require("@mui/x-internals/fastObjectShallowCompare");
var TreeViewProvider_1 = require("../../TreeViewProvider");
var useTreeViewItems_selectors_1 = require("../useTreeViewItems/useTreeViewItems.selectors");
var useTreeViewSelection_selectors_1 = require("./useTreeViewSelection.selectors");
var useSelector_1 = require("../../hooks/useSelector");
function selectorItemCheckboxStatus(state, itemId) {
    var isCheckboxSelectionEnabled = (0, useTreeViewSelection_selectors_1.selectorIsCheckboxSelectionEnabled)(state);
    var isSelectionEnabledForItem = (0, useTreeViewSelection_selectors_1.selectorIsItemSelectionEnabled)(state, itemId);
    if ((0, useTreeViewSelection_selectors_1.selectorIsItemSelected)(state, itemId)) {
        return {
            disabled: !isSelectionEnabledForItem,
            visible: isCheckboxSelectionEnabled,
            indeterminate: false,
            checked: true,
        };
    }
    var children = (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(state, itemId);
    if (children.length === 0) {
        return {
            disabled: !isSelectionEnabledForItem,
            visible: isCheckboxSelectionEnabled,
            indeterminate: false,
            checked: false,
        };
    }
    var hasSelectedDescendant = false;
    var hasUnSelectedDescendant = false;
    var traverseDescendants = function (itemToTraverseId) {
        if (itemToTraverseId !== itemId) {
            if ((0, useTreeViewSelection_selectors_1.selectorIsItemSelected)(state, itemToTraverseId)) {
                hasSelectedDescendant = true;
            }
            else {
                hasUnSelectedDescendant = true;
            }
        }
        (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(state, itemToTraverseId).forEach(traverseDescendants);
    };
    traverseDescendants(itemId);
    return {
        disabled: !isSelectionEnabledForItem,
        visible: isCheckboxSelectionEnabled,
        indeterminate: hasSelectedDescendant && hasUnSelectedDescendant,
        checked: (0, useTreeViewSelection_selectors_1.selectorSelectionPropagationRules)(state).parents
            ? hasSelectedDescendant && !hasUnSelectedDescendant
            : false,
    };
}
var useTreeViewSelectionItemPlugin = function (_a) {
    var props = _a.props;
    var itemId = props.itemId;
    var store = (0, TreeViewProvider_1.useTreeViewContext)().store;
    var checkboxStatus = (0, useSelector_1.useSelector)(store, selectorItemCheckboxStatus, itemId, fastObjectShallowCompare_1.fastObjectShallowCompare);
    return {
        propsEnhancers: {
            checkbox: function (_a) {
                var externalEventHandlers = _a.externalEventHandlers, interactions = _a.interactions;
                var handleChange = function (event) {
                    var _a;
                    (_a = externalEventHandlers.onChange) === null || _a === void 0 ? void 0 : _a.call(externalEventHandlers, event);
                    if (event.defaultMuiPrevented) {
                        return;
                    }
                    if (!(0, useTreeViewSelection_selectors_1.selectorIsItemSelectionEnabled)(store.value, itemId)) {
                        return;
                    }
                    interactions.handleCheckboxSelection(event);
                };
                return __assign({ tabIndex: -1, onChange: handleChange }, checkboxStatus);
            },
        },
    };
};
exports.useTreeViewSelectionItemPlugin = useTreeViewSelectionItemPlugin;
