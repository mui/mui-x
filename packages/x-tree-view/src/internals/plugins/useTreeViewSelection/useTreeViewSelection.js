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
exports.useTreeViewSelection = void 0;
var React = require("react");
var useAssertModelConsistency_1 = require("@mui/x-internals/useAssertModelConsistency");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var tree_1 = require("../../utils/tree");
var useTreeViewSelection_utils_1 = require("./useTreeViewSelection.utils");
var useTreeViewSelection_selectors_1 = require("./useTreeViewSelection.selectors");
var useTreeViewSelection_itemPlugin_1 = require("./useTreeViewSelection.itemPlugin");
var useTreeViewSelection = function (_a) {
    var store = _a.store, params = _a.params;
    (0, useAssertModelConsistency_1.useAssertModelConsistency)({
        componentName: 'Tree View',
        propName: 'selectedItems',
        controlled: params.selectedItems,
        defaultValue: params.defaultSelectedItems,
    });
    var lastSelectedItem = React.useRef(null);
    var lastSelectedRange = React.useRef({});
    var setSelectedItems = function (event, newModel, additionalItemsToPropagate) {
        var _a;
        var oldModel = (0, useTreeViewSelection_selectors_1.selectorSelectionModel)(store.value);
        var cleanModel;
        var isMultiSelectEnabled = (0, useTreeViewSelection_selectors_1.selectorIsMultiSelectEnabled)(store.value);
        if (isMultiSelectEnabled &&
            (params.selectionPropagation.descendants || params.selectionPropagation.parents)) {
            cleanModel = (0, useTreeViewSelection_utils_1.propagateSelection)({
                store: store,
                selectionPropagation: params.selectionPropagation,
                newModel: newModel,
                oldModel: oldModel,
                additionalItemsToPropagate: additionalItemsToPropagate,
            });
        }
        else {
            cleanModel = newModel;
        }
        if (params.onItemSelectionToggle) {
            if (isMultiSelectEnabled) {
                var changes = (0, useTreeViewSelection_utils_1.getAddedAndRemovedItems)({
                    store: store,
                    newModel: cleanModel,
                    oldModel: oldModel,
                });
                if (params.onItemSelectionToggle) {
                    changes.added.forEach(function (itemId) {
                        params.onItemSelectionToggle(event, itemId, true);
                    });
                    changes.removed.forEach(function (itemId) {
                        params.onItemSelectionToggle(event, itemId, false);
                    });
                }
            }
            else if (params.onItemSelectionToggle && cleanModel !== oldModel) {
                if (oldModel != null) {
                    params.onItemSelectionToggle(event, oldModel, false);
                }
                if (cleanModel != null) {
                    params.onItemSelectionToggle(event, cleanModel, true);
                }
            }
        }
        if (params.selectedItems === undefined) {
            store.update(function (prevState) { return (__assign(__assign({}, prevState), { selection: __assign(__assign({}, prevState.selection), { selectedItems: cleanModel }) })); });
        }
        (_a = params.onSelectedItemsChange) === null || _a === void 0 ? void 0 : _a.call(params, event, cleanModel);
    };
    var setItemSelection = function (_a) {
        var itemId = _a.itemId, _b = _a.event, event = _b === void 0 ? null : _b, _c = _a.keepExistingSelection, keepExistingSelection = _c === void 0 ? false : _c, shouldBeSelected = _a.shouldBeSelected;
        if (!(0, useTreeViewSelection_selectors_1.selectorIsSelectionEnabled)(store.value)) {
            return;
        }
        var newSelected;
        var isMultiSelectEnabled = (0, useTreeViewSelection_selectors_1.selectorIsMultiSelectEnabled)(store.value);
        if (keepExistingSelection) {
            var oldSelected = (0, useTreeViewSelection_selectors_1.selectorSelectionModelArray)(store.value);
            var isSelectedBefore = (0, useTreeViewSelection_selectors_1.selectorIsItemSelected)(store.value, itemId);
            if (isSelectedBefore && (shouldBeSelected === false || shouldBeSelected == null)) {
                newSelected = oldSelected.filter(function (id) { return id !== itemId; });
            }
            else if (!isSelectedBefore && (shouldBeSelected === true || shouldBeSelected == null)) {
                newSelected = [itemId].concat(oldSelected);
            }
            else {
                newSelected = oldSelected;
            }
        }
        else {
            // eslint-disable-next-line no-lonely-if
            if (shouldBeSelected === false ||
                (shouldBeSelected == null && (0, useTreeViewSelection_selectors_1.selectorIsItemSelected)(store.value, itemId))) {
                newSelected = isMultiSelectEnabled ? [] : null;
            }
            else {
                newSelected = isMultiSelectEnabled ? [itemId] : itemId;
            }
        }
        setSelectedItems(event, newSelected, 
        // If shouldBeSelected === selectorIsItemSelected(store, itemId), we still want to propagate the select.
        // This is useful when the element is in an indeterminate state.
        [itemId]);
        lastSelectedItem.current = itemId;
        lastSelectedRange.current = {};
    };
    var selectRange = function (event, _a) {
        var start = _a[0], end = _a[1];
        var isMultiSelectEnabled = (0, useTreeViewSelection_selectors_1.selectorIsMultiSelectEnabled)(store.value);
        if (!isMultiSelectEnabled) {
            return;
        }
        var newSelectedItems = (0, useTreeViewSelection_selectors_1.selectorSelectionModelArray)(store.value).slice();
        // If the last selection was a range selection,
        // remove the items that were part of the last range from the model
        if (Object.keys(lastSelectedRange.current).length > 0) {
            newSelectedItems = newSelectedItems.filter(function (id) { return !lastSelectedRange.current[id]; });
        }
        // Add to the model the items that are part of the new range and not already part of the model.
        var selectedItemsLookup = (0, useTreeViewSelection_utils_1.getLookupFromArray)(newSelectedItems);
        var range = (0, tree_1.getNonDisabledItemsInRange)(store.value, start, end);
        var itemsToAddToModel = range.filter(function (id) { return !selectedItemsLookup[id]; });
        newSelectedItems = newSelectedItems.concat(itemsToAddToModel);
        setSelectedItems(event, newSelectedItems);
        lastSelectedRange.current = (0, useTreeViewSelection_utils_1.getLookupFromArray)(range);
    };
    var expandSelectionRange = function (event, itemId) {
        if (lastSelectedItem.current != null) {
            var _a = (0, tree_1.findOrderInTremauxTree)(store.value, itemId, lastSelectedItem.current), start = _a[0], end = _a[1];
            selectRange(event, [start, end]);
        }
    };
    var selectRangeFromStartToItem = function (event, itemId) {
        selectRange(event, [(0, tree_1.getFirstNavigableItem)(store.value), itemId]);
    };
    var selectRangeFromItemToEnd = function (event, itemId) {
        selectRange(event, [itemId, (0, tree_1.getLastNavigableItem)(store.value)]);
    };
    var selectAllNavigableItems = function (event) {
        var isMultiSelectEnabled = (0, useTreeViewSelection_selectors_1.selectorIsMultiSelectEnabled)(store.value);
        if (!isMultiSelectEnabled) {
            return;
        }
        var navigableItems = (0, tree_1.getAllNavigableItems)(store.value);
        setSelectedItems(event, navigableItems);
        lastSelectedRange.current = (0, useTreeViewSelection_utils_1.getLookupFromArray)(navigableItems);
    };
    var selectItemFromArrowNavigation = function (event, currentItem, nextItem) {
        var _a;
        var isMultiSelectEnabled = (0, useTreeViewSelection_selectors_1.selectorIsMultiSelectEnabled)(store.value);
        if (!isMultiSelectEnabled) {
            return;
        }
        var newSelectedItems = (0, useTreeViewSelection_selectors_1.selectorSelectionModelArray)(store.value).slice();
        if (Object.keys(lastSelectedRange.current).length === 0) {
            newSelectedItems.push(nextItem);
            lastSelectedRange.current = (_a = {}, _a[currentItem] = true, _a[nextItem] = true, _a);
        }
        else {
            if (!lastSelectedRange.current[currentItem]) {
                lastSelectedRange.current = {};
            }
            if (lastSelectedRange.current[nextItem]) {
                newSelectedItems = newSelectedItems.filter(function (id) { return id !== currentItem; });
                delete lastSelectedRange.current[currentItem];
            }
            else {
                newSelectedItems.push(nextItem);
                lastSelectedRange.current[nextItem] = true;
            }
        }
        setSelectedItems(event, newSelectedItems);
    };
    (0, useEnhancedEffect_1.default)(function () {
        store.update(function (prevState) { return (__assign(__assign({}, prevState), { selection: {
                selectedItems: params.selectedItems === undefined
                    ? prevState.selection.selectedItems
                    : params.selectedItems,
                isEnabled: !params.disableSelection,
                isMultiSelectEnabled: params.multiSelect,
                isCheckboxSelectionEnabled: params.checkboxSelection,
                selectionPropagation: {
                    descendants: params.selectionPropagation.descendants,
                    parents: params.selectionPropagation.parents,
                },
            } })); });
    }, [
        store,
        params.selectedItems,
        params.multiSelect,
        params.checkboxSelection,
        params.disableSelection,
        params.selectionPropagation.descendants,
        params.selectionPropagation.parents,
    ]);
    return {
        getRootProps: function () { return ({
            'aria-multiselectable': params.multiSelect,
        }); },
        publicAPI: {
            setItemSelection: setItemSelection,
        },
        instance: {
            setItemSelection: setItemSelection,
            selectAllNavigableItems: selectAllNavigableItems,
            expandSelectionRange: expandSelectionRange,
            selectRangeFromStartToItem: selectRangeFromStartToItem,
            selectRangeFromItemToEnd: selectRangeFromItemToEnd,
            selectItemFromArrowNavigation: selectItemFromArrowNavigation,
        },
    };
};
exports.useTreeViewSelection = useTreeViewSelection;
exports.useTreeViewSelection.itemPlugin = useTreeViewSelection_itemPlugin_1.useTreeViewSelectionItemPlugin;
var DEFAULT_SELECTED_ITEMS = [];
var EMPTY_SELECTION_PROPAGATION = {};
exports.useTreeViewSelection.applyDefaultValuesToParams = function (_a) {
    var _b, _c, _d, _e, _f;
    var params = _a.params;
    return (__assign(__assign({}, params), { disableSelection: (_b = params.disableSelection) !== null && _b !== void 0 ? _b : false, multiSelect: (_c = params.multiSelect) !== null && _c !== void 0 ? _c : false, checkboxSelection: (_d = params.checkboxSelection) !== null && _d !== void 0 ? _d : false, defaultSelectedItems: (_e = params.defaultSelectedItems) !== null && _e !== void 0 ? _e : (params.multiSelect ? DEFAULT_SELECTED_ITEMS : null), selectionPropagation: (_f = params.selectionPropagation) !== null && _f !== void 0 ? _f : EMPTY_SELECTION_PROPAGATION }));
};
exports.useTreeViewSelection.getInitialState = function (params) { return ({
    selection: {
        selectedItems: params.selectedItems === undefined ? params.defaultSelectedItems : params.selectedItems,
        isEnabled: !params.disableSelection,
        isMultiSelectEnabled: params.multiSelect,
        isCheckboxSelectionEnabled: params.checkboxSelection,
        selectionPropagation: params.selectionPropagation,
    },
}); };
exports.useTreeViewSelection.params = {
    disableSelection: true,
    multiSelect: true,
    checkboxSelection: true,
    defaultSelectedItems: true,
    selectedItems: true,
    onSelectedItemsChange: true,
    onItemSelectionToggle: true,
    selectionPropagation: true,
};
