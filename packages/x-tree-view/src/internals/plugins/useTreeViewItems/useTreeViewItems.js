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
exports.useTreeViewItems = void 0;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var publishTreeViewEvent_1 = require("../../utils/publishTreeViewEvent");
var useTreeViewItems_utils_1 = require("./useTreeViewItems.utils");
var TreeViewItemDepthContext_1 = require("../../TreeViewItemDepthContext");
var useTreeViewItems_selectors_1 = require("./useTreeViewItems.selectors");
var useTreeViewId_selectors_1 = require("../../corePlugins/useTreeViewId/useTreeViewId.selectors");
var useTreeViewId_utils_1 = require("../../corePlugins/useTreeViewId/useTreeViewId.utils");
var checkId = function (id, item, itemMetaLookup) {
    if (id == null) {
        throw new Error([
            'MUI X: The Tree View component requires all items to have a unique `id` property.',
            'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
            'An item was provided without id in the `items` prop:',
            JSON.stringify(item),
        ].join('\n'));
    }
    if (itemMetaLookup[id] != null) {
        throw new Error([
            'MUI X: The Tree View component requires all items to have a unique `id` property.',
            'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
            "Two items were provided with the same id in the `items` prop: \"".concat(id, "\""),
        ].join('\n'));
    }
};
var processItemsLookups = function (_a) {
    var _b;
    var disabledItemsFocusable = _a.disabledItemsFocusable, items = _a.items, isItemDisabled = _a.isItemDisabled, getItemLabel = _a.getItemLabel, getItemChildren = _a.getItemChildren, getItemId = _a.getItemId, _c = _a.initialDepth, initialDepth = _c === void 0 ? 0 : _c, _d = _a.initialParentId, initialParentId = _d === void 0 ? null : _d, getChildrenCount = _a.getChildrenCount, _e = _a.ignoreChildren, ignoreChildren = _e === void 0 ? false : _e;
    var itemMetaLookup = {};
    var itemModelLookup = {};
    var itemOrderedChildrenIdsLookup = (_b = {},
        _b[useTreeViewItems_utils_1.TREE_VIEW_ROOT_PARENT_ID] = [],
        _b);
    var processItem = function (item, depth, parentId) {
        var id = getItemId ? getItemId(item) : item.id;
        checkId(id, item, itemMetaLookup);
        var label = getItemLabel ? getItemLabel(item) : item.label;
        if (label == null) {
            throw new Error([
                'MUI X: The Tree View component requires all items to have a `label` property.',
                'Alternatively, you can use the `getItemLabel` prop to specify a custom label for each item.',
                'An item was provided without label in the `items` prop:',
                JSON.stringify(item),
            ].join('\n'));
        }
        var children = getItemChildren
            ? getItemChildren(item)
            : item.children;
        itemMetaLookup[id] = {
            id: id,
            label: label,
            parentId: parentId,
            idAttribute: undefined,
            expandable: getChildrenCount ? getChildrenCount(item) > 0 : !!(children === null || children === void 0 ? void 0 : children.length),
            disabled: isItemDisabled ? isItemDisabled(item) : false,
            depth: depth,
        };
        itemModelLookup[id] = item;
        var parentIdWithDefault = parentId !== null && parentId !== void 0 ? parentId : useTreeViewItems_utils_1.TREE_VIEW_ROOT_PARENT_ID;
        if (!itemOrderedChildrenIdsLookup[parentIdWithDefault]) {
            itemOrderedChildrenIdsLookup[parentIdWithDefault] = [];
        }
        itemOrderedChildrenIdsLookup[parentIdWithDefault].push(id);
        // if lazy loading is enabled, we don't want to process children passed through the `items` prop
        if (!ignoreChildren) {
            children === null || children === void 0 ? void 0 : children.forEach(function (child) { return processItem(child, depth + 1, id); });
        }
    };
    items === null || items === void 0 ? void 0 : items.forEach(function (item) { return processItem(item, initialDepth, initialParentId); });
    var itemChildrenIndexesLookup = {};
    Object.keys(itemOrderedChildrenIdsLookup).forEach(function (parentId) {
        itemChildrenIndexesLookup[parentId] = (0, useTreeViewItems_utils_1.buildSiblingIndexes)(itemOrderedChildrenIdsLookup[parentId]);
    });
    return {
        disabledItemsFocusable: disabledItemsFocusable,
        itemMetaLookup: itemMetaLookup,
        itemModelLookup: itemModelLookup,
        itemOrderedChildrenIdsLookup: itemOrderedChildrenIdsLookup,
        itemChildrenIndexesLookup: itemChildrenIndexesLookup,
    };
};
var useTreeViewItems = function (_a) {
    var instance = _a.instance, params = _a.params, store = _a.store;
    var getItem = React.useCallback(function (itemId) { return (0, useTreeViewItems_selectors_1.selectorItemModel)(store.value, itemId); }, [store]);
    var getParentId = React.useCallback(function (itemId) {
        var itemMeta = (0, useTreeViewItems_selectors_1.selectorItemMeta)(store.value, itemId);
        return (itemMeta === null || itemMeta === void 0 ? void 0 : itemMeta.parentId) || null;
    }, [store]);
    var setTreeViewLoading = (0, useEventCallback_1.default)(function (isLoading) {
        store.update(function (prevState) { return (__assign(__assign({}, prevState), { items: __assign(__assign({}, prevState.items), { loading: isLoading }) })); });
    });
    var setTreeViewError = (0, useEventCallback_1.default)(function (error) {
        store.update(function (prevState) { return (__assign(__assign({}, prevState), { items: __assign(__assign({}, prevState.items), { error: error }) })); });
    });
    var setIsItemDisabled = (0, useEventCallback_1.default)(function (_a) {
        var itemId = _a.itemId, shouldBeDisabled = _a.shouldBeDisabled;
        store.update(function (prevState) {
            if (!prevState.items.itemMetaLookup[itemId]) {
                return prevState;
            }
            var itemMetaLookup = __assign({}, prevState.items.itemMetaLookup);
            itemMetaLookup[itemId] = __assign(__assign({}, itemMetaLookup[itemId]), { disabled: shouldBeDisabled !== null && shouldBeDisabled !== void 0 ? shouldBeDisabled : !itemMetaLookup[itemId].disabled });
            return __assign(__assign({}, prevState), { items: __assign(__assign({}, prevState.items), { itemMetaLookup: itemMetaLookup }) });
        });
    });
    var getItemTree = React.useCallback(function () {
        var getItemFromItemId = function (itemId) {
            var item = (0, useTreeViewItems_selectors_1.selectorItemModel)(store.value, itemId);
            var newChildren = (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(store.value, itemId);
            if (newChildren.length > 0) {
                item.children = newChildren.map(getItemFromItemId);
            }
            else {
                delete item.children;
            }
            return item;
        };
        return (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(store.value, null).map(getItemFromItemId);
    }, [store]);
    var getItemOrderedChildrenIds = React.useCallback(function (itemId) { return (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(store.value, itemId); }, [store]);
    var getItemDOMElement = function (itemId) {
        var itemMeta = (0, useTreeViewItems_selectors_1.selectorItemMeta)(store.value, itemId);
        if (itemMeta == null) {
            return null;
        }
        var idAttribute = (0, useTreeViewId_utils_1.generateTreeItemIdAttribute)({
            treeId: (0, useTreeViewId_selectors_1.selectorTreeViewId)(store.value),
            itemId: itemId,
            id: itemMeta.idAttribute,
        });
        return document.getElementById(idAttribute);
    };
    var areItemUpdatesPreventedRef = React.useRef(false);
    var preventItemUpdates = React.useCallback(function () {
        areItemUpdatesPreventedRef.current = true;
    }, []);
    var areItemUpdatesPrevented = React.useCallback(function () { return areItemUpdatesPreventedRef.current; }, []);
    var addItems = function (_a) {
        var items = _a.items, parentId = _a.parentId, depth = _a.depth, getChildrenCount = _a.getChildrenCount;
        if (items) {
            var newState_1 = processItemsLookups({
                disabledItemsFocusable: params.disabledItemsFocusable,
                items: items,
                isItemDisabled: params.isItemDisabled,
                getItemId: params.getItemId,
                getItemLabel: params.getItemLabel,
                getItemChildren: params.getItemChildren,
                getChildrenCount: getChildrenCount,
                initialDepth: depth,
                initialParentId: parentId,
                ignoreChildren: true,
            });
            store.update(function (prevState) {
                var newItems;
                if (parentId) {
                    newItems = {
                        itemModelLookup: __assign(__assign({}, prevState.items.itemModelLookup), newState_1.itemModelLookup),
                        itemMetaLookup: __assign(__assign({}, prevState.items.itemMetaLookup), newState_1.itemMetaLookup),
                        itemOrderedChildrenIdsLookup: __assign(__assign({}, newState_1.itemOrderedChildrenIdsLookup), prevState.items.itemOrderedChildrenIdsLookup),
                        itemChildrenIndexesLookup: __assign(__assign({}, newState_1.itemChildrenIndexesLookup), prevState.items.itemChildrenIndexesLookup),
                    };
                }
                else {
                    newItems = {
                        itemModelLookup: newState_1.itemModelLookup,
                        itemMetaLookup: newState_1.itemMetaLookup,
                        itemOrderedChildrenIdsLookup: newState_1.itemOrderedChildrenIdsLookup,
                        itemChildrenIndexesLookup: newState_1.itemChildrenIndexesLookup,
                    };
                }
                Object.values(prevState.items.itemMetaLookup).forEach(function (item) {
                    if (!newItems.itemMetaLookup[item.id]) {
                        (0, publishTreeViewEvent_1.publishTreeViewEvent)(instance, 'removeItem', { id: item.id });
                    }
                });
                return __assign(__assign({}, prevState), { items: __assign(__assign({}, prevState.items), newItems) });
            });
        }
    };
    var removeChildren = function (parentId) {
        store.update(function (prevState) {
            if (!parentId) {
                return __assign(__assign({}, prevState), { items: __assign(__assign({}, prevState.items), { itemMetaLookup: {}, itemOrderedChildrenIdsLookup: {}, itemChildrenIndexesLookup: {} }) });
            }
            var newMetaMap = Object.keys(prevState.items.itemMetaLookup).reduce(function (acc, key) {
                var _a;
                var item = prevState.items.itemMetaLookup[key];
                if (item.parentId === parentId) {
                    (0, publishTreeViewEvent_1.publishTreeViewEvent)(instance, 'removeItem', { id: item.id });
                    return acc;
                }
                return __assign(__assign({}, acc), (_a = {}, _a[item.id] = item, _a));
            }, {});
            var newItemOrderedChildrenIdsLookup = prevState.items.itemOrderedChildrenIdsLookup;
            var newItemChildrenIndexesLookup = prevState.items.itemChildrenIndexesLookup;
            delete newItemChildrenIndexesLookup[parentId];
            delete newItemOrderedChildrenIdsLookup[parentId];
            return __assign(__assign({}, prevState), { items: __assign(__assign({}, prevState.items), { itemMetaLookup: newMetaMap, itemOrderedChildrenIdsLookup: newItemOrderedChildrenIdsLookup, itemChildrenIndexesLookup: newItemChildrenIndexesLookup }) });
        });
    };
    React.useEffect(function () {
        if (instance.areItemUpdatesPrevented()) {
            return;
        }
        store.update(function (prevState) {
            var newState = processItemsLookups({
                disabledItemsFocusable: params.disabledItemsFocusable,
                items: params.items,
                isItemDisabled: params.isItemDisabled,
                getItemId: params.getItemId,
                getItemLabel: params.getItemLabel,
                getItemChildren: params.getItemChildren,
            });
            Object.values(prevState.items.itemMetaLookup).forEach(function (item) {
                if (!newState.itemMetaLookup[item.id]) {
                    (0, publishTreeViewEvent_1.publishTreeViewEvent)(instance, 'removeItem', { id: item.id });
                }
            });
            return __assign(__assign({}, prevState), { items: __assign(__assign({}, prevState.items), newState) });
        });
    }, [
        instance,
        store,
        params.items,
        params.disabledItemsFocusable,
        params.isItemDisabled,
        params.getItemId,
        params.getItemLabel,
        params.getItemChildren,
    ]);
    // Wrap `props.onItemClick` with `useEventCallback` to prevent unneeded context updates.
    var handleItemClick = (0, useEventCallback_1.default)(function (event, itemId) {
        if (params.onItemClick) {
            params.onItemClick(event, itemId);
        }
    });
    return {
        getRootProps: function () { return ({
            style: {
                '--TreeView-itemChildrenIndentation': typeof params.itemChildrenIndentation === 'number'
                    ? "".concat(params.itemChildrenIndentation, "px")
                    : params.itemChildrenIndentation,
            },
        }); },
        publicAPI: {
            getItem: getItem,
            getItemDOMElement: getItemDOMElement,
            getItemTree: getItemTree,
            getItemOrderedChildrenIds: getItemOrderedChildrenIds,
            setIsItemDisabled: setIsItemDisabled,
            getParentId: getParentId,
        },
        instance: {
            getItemDOMElement: getItemDOMElement,
            preventItemUpdates: preventItemUpdates,
            areItemUpdatesPrevented: areItemUpdatesPrevented,
            addItems: addItems,
            setTreeViewLoading: setTreeViewLoading,
            setTreeViewError: setTreeViewError,
            removeChildren: removeChildren,
            handleItemClick: handleItemClick,
        },
    };
};
exports.useTreeViewItems = useTreeViewItems;
exports.useTreeViewItems.getInitialState = function (params) { return ({
    items: __assign(__assign({}, processItemsLookups({
        disabledItemsFocusable: params.disabledItemsFocusable,
        items: params.items,
        isItemDisabled: params.isItemDisabled,
        getItemId: params.getItemId,
        getItemLabel: params.getItemLabel,
        getItemChildren: params.getItemChildren,
    })), { loading: false, error: null }),
}); };
exports.useTreeViewItems.applyDefaultValuesToParams = function (_a) {
    var _b, _c;
    var params = _a.params;
    return (__assign(__assign({}, params), { disabledItemsFocusable: (_b = params.disabledItemsFocusable) !== null && _b !== void 0 ? _b : false, itemChildrenIndentation: (_c = params.itemChildrenIndentation) !== null && _c !== void 0 ? _c : '12px' }));
};
exports.useTreeViewItems.wrapRoot = function (_a) {
    var children = _a.children;
    return (<TreeViewItemDepthContext_1.TreeViewItemDepthContext.Provider value={useTreeViewItems_selectors_1.selectorItemDepth}>
      {children}
    </TreeViewItemDepthContext_1.TreeViewItemDepthContext.Provider>);
};
exports.useTreeViewItems.params = {
    disabledItemsFocusable: true,
    items: true,
    isItemDisabled: true,
    getItemLabel: true,
    getItemChildren: true,
    getItemId: true,
    onItemClick: true,
    itemChildrenIndentation: true,
};
