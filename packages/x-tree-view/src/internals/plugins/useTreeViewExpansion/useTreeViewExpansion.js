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
exports.useTreeViewExpansion = void 0;
var useAssertModelConsistency_1 = require("@mui/x-internals/useAssertModelConsistency");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var useTreeViewExpansion_selectors_1 = require("./useTreeViewExpansion.selectors");
var useTreeViewExpansion_utils_1 = require("./useTreeViewExpansion.utils");
var useTreeViewItems_selectors_1 = require("../useTreeViewItems/useTreeViewItems.selectors");
var publishTreeViewEvent_1 = require("../../utils/publishTreeViewEvent");
var useTreeViewExpansion = function (_a) {
    var instance = _a.instance, store = _a.store, params = _a.params;
    (0, useAssertModelConsistency_1.useAssertModelConsistency)({
        componentName: 'Tree View',
        propName: 'expandedItems',
        controlled: params.expandedItems,
        defaultValue: params.defaultExpandedItems,
    });
    (0, useEnhancedEffect_1.default)(function () {
        store.update(function (prevState) {
            var newExpansionTrigger = (0, useTreeViewExpansion_utils_1.getExpansionTrigger)({
                isItemEditable: params.isItemEditable,
                expansionTrigger: params.expansionTrigger,
            });
            if (prevState.expansion.expansionTrigger === newExpansionTrigger) {
                return prevState;
            }
            return __assign(__assign({}, prevState), { expansion: __assign(__assign({}, prevState.expansion), { expansionTrigger: newExpansionTrigger }) });
        });
    }, [store, params.isItemEditable, params.expansionTrigger]);
    var setExpandedItems = function (event, value) {
        var _a;
        if (params.expandedItems === undefined) {
            store.update(function (prevState) { return (__assign(__assign({}, prevState), { expansion: __assign(__assign({}, prevState.expansion), { expandedItems: value }) })); });
        }
        (_a = params.onExpandedItemsChange) === null || _a === void 0 ? void 0 : _a.call(params, event, value);
    };
    var resetItemExpansion = (0, useEventCallback_1.default)(function () {
        setExpandedItems(null, []);
    });
    var applyItemExpansion = (0, useEventCallback_1.default)(function (_a) {
        var itemId = _a.itemId, event = _a.event, shouldBeExpanded = _a.shouldBeExpanded;
        var oldExpanded = (0, useTreeViewExpansion_selectors_1.selectorExpandedItems)(store.value);
        var newExpanded;
        if (shouldBeExpanded) {
            newExpanded = [itemId].concat(oldExpanded);
        }
        else {
            newExpanded = oldExpanded.filter(function (id) { return id !== itemId; });
        }
        if (params.onItemExpansionToggle) {
            params.onItemExpansionToggle(event, itemId, shouldBeExpanded);
        }
        setExpandedItems(event, newExpanded);
    });
    var setItemExpansion = (0, useEventCallback_1.default)(function (_a) {
        var itemId = _a.itemId, _b = _a.event, event = _b === void 0 ? null : _b, shouldBeExpanded = _a.shouldBeExpanded;
        var isExpandedBefore = (0, useTreeViewExpansion_selectors_1.selectorIsItemExpanded)(store.value, itemId);
        var cleanShouldBeExpanded = shouldBeExpanded !== null && shouldBeExpanded !== void 0 ? shouldBeExpanded : !isExpandedBefore;
        if (isExpandedBefore === cleanShouldBeExpanded) {
            return;
        }
        var eventParameters = {
            isExpansionPrevented: false,
            shouldBeExpanded: cleanShouldBeExpanded,
            event: event,
            itemId: itemId,
        };
        (0, publishTreeViewEvent_1.publishTreeViewEvent)(instance, 'beforeItemToggleExpansion', eventParameters);
        if (eventParameters.isExpansionPrevented) {
            return;
        }
        instance.applyItemExpansion({ itemId: itemId, event: event, shouldBeExpanded: cleanShouldBeExpanded });
    });
    var expandAllSiblings = function (event, itemId) {
        var itemMeta = (0, useTreeViewItems_selectors_1.selectorItemMeta)(store.value, itemId);
        if (itemMeta == null) {
            return;
        }
        var siblings = (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(store.value, itemMeta.parentId);
        var diff = siblings.filter(function (child) {
            return (0, useTreeViewExpansion_selectors_1.selectorIsItemExpandable)(store.value, child) && !(0, useTreeViewExpansion_selectors_1.selectorIsItemExpanded)(store.value, child);
        });
        var newExpanded = (0, useTreeViewExpansion_selectors_1.selectorExpandedItems)(store.value).concat(diff);
        if (diff.length > 0) {
            if (params.onItemExpansionToggle) {
                diff.forEach(function (newlyExpandedItemId) {
                    params.onItemExpansionToggle(event, newlyExpandedItemId, true);
                });
            }
            setExpandedItems(event, newExpanded);
        }
    };
    /**
     * Update the controlled model when the `expandedItems` prop changes.
     */
    (0, useEnhancedEffect_1.default)(function () {
        var expandedItems = params.expandedItems;
        if (expandedItems !== undefined) {
            store.update(function (prevState) { return (__assign(__assign({}, prevState), { expansion: __assign(__assign({}, prevState.expansion), { expandedItems: expandedItems }) })); });
        }
    }, [store, params.expandedItems]);
    return {
        publicAPI: {
            setItemExpansion: setItemExpansion,
        },
        instance: {
            setItemExpansion: setItemExpansion,
            applyItemExpansion: applyItemExpansion,
            expandAllSiblings: expandAllSiblings,
            resetItemExpansion: resetItemExpansion,
        },
    };
};
exports.useTreeViewExpansion = useTreeViewExpansion;
var DEFAULT_EXPANDED_ITEMS = [];
exports.useTreeViewExpansion.applyDefaultValuesToParams = function (_a) {
    var _b;
    var params = _a.params;
    return (__assign(__assign({}, params), { defaultExpandedItems: (_b = params.defaultExpandedItems) !== null && _b !== void 0 ? _b : DEFAULT_EXPANDED_ITEMS }));
};
exports.useTreeViewExpansion.getInitialState = function (params) { return ({
    expansion: {
        expandedItems: params.expandedItems === undefined ? params.defaultExpandedItems : params.expandedItems,
        expansionTrigger: (0, useTreeViewExpansion_utils_1.getExpansionTrigger)(params),
    },
}); };
exports.useTreeViewExpansion.params = {
    expandedItems: true,
    defaultExpandedItems: true,
    onExpandedItemsChange: true,
    onItemExpansionToggle: true,
    expansionTrigger: true,
};
