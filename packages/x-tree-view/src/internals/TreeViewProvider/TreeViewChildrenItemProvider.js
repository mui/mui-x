"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeViewChildrenItemContext = void 0;
exports.TreeViewChildrenItemProvider = TreeViewChildrenItemProvider;
var React = require("react");
var prop_types_1 = require("prop-types");
var TreeViewContext_1 = require("./TreeViewContext");
var utils_1 = require("../utils/utils");
var useTreeViewItems_selectors_1 = require("../plugins/useTreeViewItems/useTreeViewItems.selectors");
exports.TreeViewChildrenItemContext = React.createContext(null);
function TreeViewChildrenItemProvider(props) {
    var children = props.children, _a = props.itemId, itemId = _a === void 0 ? null : _a, idAttribute = props.idAttribute;
    var _b = (0, TreeViewContext_1.useTreeViewContext)(), instance = _b.instance, store = _b.store, rootRef = _b.rootRef;
    var childrenIdAttrToIdRef = React.useRef(new Map());
    React.useEffect(function () {
        var _a;
        if (!rootRef.current) {
            return;
        }
        var previousChildrenIds = (_a = (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(store.value, itemId !== null && itemId !== void 0 ? itemId : null)) !== null && _a !== void 0 ? _a : [];
        var escapedIdAttr = (0, utils_1.escapeOperandAttributeSelector)(idAttribute !== null && idAttribute !== void 0 ? idAttribute : rootRef.current.id);
        // If collapsed, skip childrenIds update prevents clearing the parent's indeterminate state after opening a sibling.
        if (itemId != null) {
            var itemRoot = rootRef.current.querySelector("*[id=\"".concat(escapedIdAttr, "\"][role=\"treeitem\"]"));
            if (itemRoot && itemRoot.getAttribute('aria-expanded') === 'false') {
                return;
            }
        }
        var childrenElements = rootRef.current.querySelectorAll("".concat(itemId == null ? '' : "*[id=\"".concat(escapedIdAttr, "\"] "), "[role=\"treeitem\"]:not(*[id=\"").concat(escapedIdAttr, "\"] [role=\"treeitem\"] [role=\"treeitem\"])"));
        var childrenIds = Array.from(childrenElements).map(function (child) { return childrenIdAttrToIdRef.current.get(child.id); });
        var hasChanged = childrenIds.length !== previousChildrenIds.length ||
            childrenIds.some(function (childId, index) { return childId !== previousChildrenIds[index]; });
        if (hasChanged) {
            instance.setJSXItemsOrderedChildrenIds(itemId !== null && itemId !== void 0 ? itemId : null, childrenIds);
        }
    });
    var value = React.useMemo(function () { return ({
        registerChild: function (childIdAttribute, childItemId) {
            return childrenIdAttrToIdRef.current.set(childIdAttribute, childItemId);
        },
        unregisterChild: function (childIdAttribute) { return childrenIdAttrToIdRef.current.delete(childIdAttribute); },
        parentId: itemId,
    }); }, [itemId]);
    return (<exports.TreeViewChildrenItemContext.Provider value={value}>
      {children}
    </exports.TreeViewChildrenItemContext.Provider>);
}
TreeViewChildrenItemProvider.propTypes = {
    children: prop_types_1.default.node,
    id: prop_types_1.default.string,
};
