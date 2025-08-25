"use strict";
'use client';
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichTreeViewItems = RichTreeViewItems;
var React = require("react");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var fastObjectShallowCompare_1 = require("@mui/x-internals/fastObjectShallowCompare");
var TreeItem_1 = require("../../TreeItem");
var useSelector_1 = require("../hooks/useSelector");
var useTreeViewItems_selectors_1 = require("../plugins/useTreeViewItems/useTreeViewItems.selectors");
var TreeViewProvider_1 = require("../TreeViewProvider");
var RichTreeViewItemsContext = React.createContext(null);
var WrappedTreeItem = React.memo(function WrappedTreeItem(_a) {
    var itemSlot = _a.itemSlot, itemSlotProps = _a.itemSlotProps, itemId = _a.itemId;
    var renderItemForRichTreeView = React.useContext(RichTreeViewItemsContext);
    var store = (0, TreeViewProvider_1.useTreeViewContext)().store;
    var itemMeta = (0, useSelector_1.useSelector)(store, useTreeViewItems_selectors_1.selectorItemMeta, itemId);
    var children = (0, useSelector_1.useSelector)(store, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds, itemId);
    var Item = (itemSlot !== null && itemSlot !== void 0 ? itemSlot : TreeItem_1.TreeItem);
    var _b = (0, useSlotProps_1.default)({
        elementType: Item,
        externalSlotProps: itemSlotProps,
        additionalProps: { label: itemMeta === null || itemMeta === void 0 ? void 0 : itemMeta.label, id: itemMeta === null || itemMeta === void 0 ? void 0 : itemMeta.idAttribute, itemId: itemId },
        ownerState: { itemId: itemId, label: itemMeta === null || itemMeta === void 0 ? void 0 : itemMeta.label },
    }), ownerState = _b.ownerState, itemProps = __rest(_b, ["ownerState"]);
    return <Item {...itemProps}>{children === null || children === void 0 ? void 0 : children.map(renderItemForRichTreeView)}</Item>;
}, fastObjectShallowCompare_1.fastObjectShallowCompare);
function RichTreeViewItems(props) {
    var slots = props.slots, slotProps = props.slotProps;
    var store = (0, TreeViewProvider_1.useTreeViewContext)().store;
    var itemSlot = slots === null || slots === void 0 ? void 0 : slots.item;
    var itemSlotProps = slotProps === null || slotProps === void 0 ? void 0 : slotProps.item;
    var items = (0, useSelector_1.useSelector)(store, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds, null);
    var renderItem = React.useCallback(function (itemId) {
        return (<WrappedTreeItem itemSlot={itemSlot} itemSlotProps={itemSlotProps} key={itemId} itemId={itemId}/>);
    }, [itemSlot, itemSlotProps]);
    return (<RichTreeViewItemsContext.Provider value={renderItem}>
      {items.map(renderItem)}
    </RichTreeViewItemsContext.Provider>);
}
