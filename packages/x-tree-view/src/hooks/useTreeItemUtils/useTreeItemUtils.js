"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTreeItemUtils = exports.itemHasChildren = void 0;
var TreeViewProvider_1 = require("../../internals/TreeViewProvider");
var useTreeViewLabel_1 = require("../../internals/plugins/useTreeViewLabel");
var plugins_1 = require("../../internals/utils/plugins");
var useSelector_1 = require("../../internals/hooks/useSelector");
var useTreeViewExpansion_selectors_1 = require("../../internals/plugins/useTreeViewExpansion/useTreeViewExpansion.selectors");
var useTreeViewFocus_selectors_1 = require("../../internals/plugins/useTreeViewFocus/useTreeViewFocus.selectors");
var useTreeViewItems_selectors_1 = require("../../internals/plugins/useTreeViewItems/useTreeViewItems.selectors");
var useTreeViewSelection_selectors_1 = require("../../internals/plugins/useTreeViewSelection/useTreeViewSelection.selectors");
var useTreeViewLazyLoading_selectors_1 = require("../../internals/plugins/useTreeViewLazyLoading/useTreeViewLazyLoading.selectors");
var useTreeViewLabel_selectors_1 = require("../../internals/plugins/useTreeViewLabel/useTreeViewLabel.selectors");
var itemHasChildren = function (reactChildren) {
    if (Array.isArray(reactChildren)) {
        return reactChildren.length > 0 && reactChildren.some(exports.itemHasChildren);
    }
    return Boolean(reactChildren);
};
exports.itemHasChildren = itemHasChildren;
var useTreeItemUtils = function (_a) {
    var itemId = _a.itemId, children = _a.children;
    var _b = (0, TreeViewProvider_1.useTreeViewContext)(), instance = _b.instance, store = _b.store, publicAPI = _b.publicAPI;
    var isItemExpandable = (0, useSelector_1.useSelector)(store, useTreeViewExpansion_selectors_1.selectorIsItemExpandable, itemId);
    var isLazyLoadingEnabled = (0, useSelector_1.useSelector)(store, useTreeViewLazyLoading_selectors_1.selectorIsLazyLoadingEnabled);
    var isMultiSelectEnabled = (0, useSelector_1.useSelector)(store, useTreeViewSelection_selectors_1.selectorIsMultiSelectEnabled);
    var loading = (0, useSelector_1.useSelector)(store, function (state) {
        return isLazyLoadingEnabled ? (0, useTreeViewLazyLoading_selectors_1.selectorIsItemLoading)(state, itemId) : false;
    });
    var error = (0, useSelector_1.useSelector)(store, function (state) {
        return isLazyLoadingEnabled ? Boolean((0, useTreeViewLazyLoading_selectors_1.selectorGetTreeItemError)(state, itemId)) : false;
    });
    var isExpandable = (0, exports.itemHasChildren)(children) || isItemExpandable;
    var isExpanded = (0, useSelector_1.useSelector)(store, useTreeViewExpansion_selectors_1.selectorIsItemExpanded, itemId);
    var isFocused = (0, useSelector_1.useSelector)(store, useTreeViewFocus_selectors_1.selectorIsItemFocused, itemId);
    var isSelected = (0, useSelector_1.useSelector)(store, useTreeViewSelection_selectors_1.selectorIsItemSelected, itemId);
    var isDisabled = (0, useSelector_1.useSelector)(store, useTreeViewItems_selectors_1.selectorIsItemDisabled, itemId);
    var isEditing = (0, useSelector_1.useSelector)(store, useTreeViewLabel_selectors_1.selectorIsItemBeingEdited, itemId);
    var isEditable = (0, useSelector_1.useSelector)(store, useTreeViewLabel_selectors_1.selectorIsItemEditable, itemId);
    var status = {
        expandable: isExpandable,
        expanded: isExpanded,
        focused: isFocused,
        selected: isSelected,
        disabled: isDisabled,
        editing: isEditing,
        editable: isEditable,
        loading: loading,
        error: error,
    };
    var handleExpansion = function (event) {
        if (status.disabled) {
            return;
        }
        if (!status.focused) {
            instance.focusItem(event, itemId);
        }
        var multiple = isMultiSelectEnabled && (event.shiftKey || event.ctrlKey || event.metaKey);
        // If already expanded and trying to toggle selection don't close
        if (status.expandable && !(multiple && (0, useTreeViewExpansion_selectors_1.selectorIsItemExpanded)(store.value, itemId))) {
            // make sure the children selection is propagated again
            instance.setItemExpansion({ event: event, itemId: itemId });
        }
    };
    var handleSelection = function (event) {
        if (status.disabled) {
            return;
        }
        if (!status.focused && !status.editing) {
            instance.focusItem(event, itemId);
        }
        var multiple = isMultiSelectEnabled && (event.shiftKey || event.ctrlKey || event.metaKey);
        if (multiple) {
            if (event.shiftKey) {
                instance.expandSelectionRange(event, itemId);
            }
            else {
                instance.setItemSelection({ event: event, itemId: itemId, keepExistingSelection: true });
            }
        }
        else {
            instance.setItemSelection({ event: event, itemId: itemId, shouldBeSelected: true });
        }
    };
    var handleCheckboxSelection = function (event) {
        var hasShift = event.nativeEvent.shiftKey;
        if (isMultiSelectEnabled && hasShift) {
            instance.expandSelectionRange(event, itemId);
        }
        else {
            instance.setItemSelection({
                event: event,
                itemId: itemId,
                keepExistingSelection: isMultiSelectEnabled,
                shouldBeSelected: event.target.checked,
            });
        }
    };
    var toggleItemEditing = function () {
        if (!(0, plugins_1.hasPlugin)(instance, useTreeViewLabel_1.useTreeViewLabel)) {
            return;
        }
        if (isEditing) {
            instance.setEditedItem(null);
        }
        else {
            instance.setEditedItem(itemId);
        }
    };
    var handleSaveItemLabel = function (event, newLabel) {
        if (!(0, plugins_1.hasPlugin)(instance, useTreeViewLabel_1.useTreeViewLabel)) {
            return;
        }
        // As a side effect of `instance.focusItem` called here and in `handleCancelItemLabelEditing` the `labelInput` is blurred
        // The `onBlur` event is triggered, which calls `handleSaveItemLabel` again.
        // To avoid creating an unwanted behavior we need to check if the item is being edited before calling `updateItemLabel`
        if ((0, useTreeViewLabel_selectors_1.selectorIsItemBeingEdited)(store.value, itemId)) {
            instance.updateItemLabel(itemId, newLabel);
            toggleItemEditing();
            instance.focusItem(event, itemId);
        }
    };
    var handleCancelItemLabelEditing = function (event) {
        if (!(0, plugins_1.hasPlugin)(instance, useTreeViewLabel_1.useTreeViewLabel)) {
            return;
        }
        if ((0, useTreeViewLabel_selectors_1.selectorIsItemBeingEdited)(store.value, itemId)) {
            toggleItemEditing();
            instance.focusItem(event, itemId);
        }
    };
    var interactions = {
        handleExpansion: handleExpansion,
        handleSelection: handleSelection,
        handleCheckboxSelection: handleCheckboxSelection,
        toggleItemEditing: toggleItemEditing,
        handleSaveItemLabel: handleSaveItemLabel,
        handleCancelItemLabelEditing: handleCancelItemLabelEditing,
    };
    return { interactions: interactions, status: status, publicAPI: publicAPI };
};
exports.useTreeItemUtils = useTreeItemUtils;
