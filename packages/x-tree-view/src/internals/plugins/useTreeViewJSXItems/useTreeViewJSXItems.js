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
exports.useTreeViewJSXItems = void 0;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useForkRef_1 = require("@mui/utils/useForkRef");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var publishTreeViewEvent_1 = require("../../utils/publishTreeViewEvent");
var TreeViewProvider_1 = require("../../TreeViewProvider");
var TreeViewChildrenItemProvider_1 = require("../../TreeViewProvider/TreeViewChildrenItemProvider");
var useTreeViewItems_utils_1 = require("../useTreeViewItems/useTreeViewItems.utils");
var TreeViewItemDepthContext_1 = require("../../TreeViewItemDepthContext");
var useTreeViewId_utils_1 = require("../../corePlugins/useTreeViewId/useTreeViewId.utils");
var useTreeItemUtils_1 = require("../../../hooks/useTreeItemUtils/useTreeItemUtils");
var useSelector_1 = require("../../hooks/useSelector");
var useTreeViewId_selectors_1 = require("../../corePlugins/useTreeViewId/useTreeViewId.selectors");
var useTreeViewJSXItems = function (_a) {
    var instance = _a.instance, store = _a.store;
    instance.preventItemUpdates();
    var insertJSXItem = (0, useEventCallback_1.default)(function (item) {
        store.update(function (prevState) {
            var _a, _b;
            var _c;
            if (prevState.items.itemMetaLookup[item.id] != null) {
                throw new Error([
                    'MUI X: The Tree View component requires all items to have a unique `id` property.',
                    'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
                    "Two items were provided with the same id in the `items` prop: \"".concat(item.id, "\""),
                ].join('\n'));
            }
            return __assign(__assign({}, prevState), { items: __assign(__assign({}, prevState.items), { itemMetaLookup: __assign(__assign({}, prevState.items.itemMetaLookup), (_a = {}, _a[item.id] = item, _a)), 
                    // For Simple Tree View, we don't have a proper `item` object, so we create a very basic one.
                    itemModelLookup: __assign(__assign({}, prevState.items.itemModelLookup), (_b = {}, _b[item.id] = { id: item.id, label: (_c = item.label) !== null && _c !== void 0 ? _c : '' }, _b)) }) });
        });
        return function () {
            store.update(function (prevState) {
                var newItemMetaLookup = __assign({}, prevState.items.itemMetaLookup);
                var newItemModelLookup = __assign({}, prevState.items.itemModelLookup);
                delete newItemMetaLookup[item.id];
                delete newItemModelLookup[item.id];
                return __assign(__assign({}, prevState), { items: __assign(__assign({}, prevState.items), { itemMetaLookup: newItemMetaLookup, itemModelLookup: newItemModelLookup }) });
            });
            (0, publishTreeViewEvent_1.publishTreeViewEvent)(instance, 'removeItem', { id: item.id });
        };
    });
    var setJSXItemsOrderedChildrenIds = function (parentId, orderedChildrenIds) {
        var parentIdWithDefault = parentId !== null && parentId !== void 0 ? parentId : useTreeViewItems_utils_1.TREE_VIEW_ROOT_PARENT_ID;
        store.update(function (prevState) {
            var _a, _b;
            return (__assign(__assign({}, prevState), { items: __assign(__assign({}, prevState.items), { itemOrderedChildrenIdsLookup: __assign(__assign({}, prevState.items.itemOrderedChildrenIdsLookup), (_a = {}, _a[parentIdWithDefault] = orderedChildrenIds, _a)), itemChildrenIndexesLookup: __assign(__assign({}, prevState.items.itemChildrenIndexesLookup), (_b = {}, _b[parentIdWithDefault] = (0, useTreeViewItems_utils_1.buildSiblingIndexes)(orderedChildrenIds), _b)) }) }));
        });
    };
    var mapFirstCharFromJSX = (0, useEventCallback_1.default)(function (itemId, firstChar) {
        instance.updateFirstCharMap(function (firstCharMap) {
            firstCharMap[itemId] = firstChar;
            return firstCharMap;
        });
        return function () {
            instance.updateFirstCharMap(function (firstCharMap) {
                var newMap = __assign({}, firstCharMap);
                delete newMap[itemId];
                return newMap;
            });
        };
    });
    return {
        instance: {
            insertJSXItem: insertJSXItem,
            setJSXItemsOrderedChildrenIds: setJSXItemsOrderedChildrenIds,
            mapFirstCharFromJSX: mapFirstCharFromJSX,
        },
    };
};
exports.useTreeViewJSXItems = useTreeViewJSXItems;
var useTreeViewJSXItemsItemPlugin = function (_a) {
    var props = _a.props, rootRef = _a.rootRef, contentRef = _a.contentRef;
    var _b = (0, TreeViewProvider_1.useTreeViewContext)(), instance = _b.instance, store = _b.store;
    var children = props.children, _c = props.disabled, disabled = _c === void 0 ? false : _c, label = props.label, itemId = props.itemId, id = props.id;
    var parentContext = React.useContext(TreeViewChildrenItemProvider_1.TreeViewChildrenItemContext);
    if (parentContext == null) {
        throw new Error([
            'MUI X: Could not find the Tree View Children Item context.',
            'It looks like you rendered your component outside of a SimpleTreeView parent component.',
            'This can also happen if you are bundling multiple versions of the Tree View.',
        ].join('\n'));
    }
    var registerChild = parentContext.registerChild, unregisterChild = parentContext.unregisterChild, parentId = parentContext.parentId;
    var expandable = (0, useTreeItemUtils_1.itemHasChildren)(children);
    var pluginContentRef = React.useRef(null);
    var handleContentRef = (0, useForkRef_1.default)(pluginContentRef, contentRef);
    var treeId = (0, useSelector_1.useSelector)(store, useTreeViewId_selectors_1.selectorTreeViewId);
    // Prevent any flashing
    (0, useEnhancedEffect_1.default)(function () {
        var idAttribute = (0, useTreeViewId_utils_1.generateTreeItemIdAttribute)({ itemId: itemId, treeId: treeId, id: id });
        registerChild(idAttribute, itemId);
        return function () {
            unregisterChild(idAttribute);
            unregisterChild(idAttribute);
        };
    }, [store, instance, registerChild, unregisterChild, itemId, id, treeId]);
    (0, useEnhancedEffect_1.default)(function () {
        return instance.insertJSXItem({
            id: itemId,
            idAttribute: id,
            parentId: parentId,
            expandable: expandable,
            disabled: disabled,
        });
    }, [instance, parentId, itemId, expandable, disabled, id]);
    React.useEffect(function () {
        var _a, _b;
        if (label) {
            return instance.mapFirstCharFromJSX(itemId, ((_b = (_a = pluginContentRef.current) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : '').substring(0, 1).toLowerCase());
        }
        return undefined;
    }, [instance, itemId, label]);
    return {
        contentRef: handleContentRef,
        rootRef: rootRef,
    };
};
exports.useTreeViewJSXItems.itemPlugin = useTreeViewJSXItemsItemPlugin;
exports.useTreeViewJSXItems.wrapItem = function (_a) {
    var children = _a.children, itemId = _a.itemId, idAttribute = _a.idAttribute;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var depthContext = React.useContext(TreeViewItemDepthContext_1.TreeViewItemDepthContext);
    return (<TreeViewChildrenItemProvider_1.TreeViewChildrenItemProvider itemId={itemId} idAttribute={idAttribute}>
      <TreeViewItemDepthContext_1.TreeViewItemDepthContext.Provider value={depthContext + 1}>
        {children}
      </TreeViewItemDepthContext_1.TreeViewItemDepthContext.Provider>
    </TreeViewChildrenItemProvider_1.TreeViewChildrenItemProvider>);
};
exports.useTreeViewJSXItems.wrapRoot = function (_a) {
    var children = _a.children;
    return (<TreeViewChildrenItemProvider_1.TreeViewChildrenItemProvider itemId={null} idAttribute={null}>
    <TreeViewItemDepthContext_1.TreeViewItemDepthContext.Provider value={0}>{children}</TreeViewItemDepthContext_1.TreeViewItemDepthContext.Provider>
  </TreeViewChildrenItemProvider_1.TreeViewChildrenItemProvider>);
};
exports.useTreeViewJSXItems.params = {};
