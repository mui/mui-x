"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTargetInDescendants = exports.getAllNavigableItems = exports.getNonDisabledItemsInRange = exports.findOrderInTremauxTree = exports.getFirstNavigableItem = exports.getLastNavigableItem = exports.getNextNavigableItem = exports.getPreviousNavigableItem = void 0;
var useTreeViewExpansion_selectors_1 = require("../plugins/useTreeViewExpansion/useTreeViewExpansion.selectors");
var useTreeViewItems_selectors_1 = require("../plugins/useTreeViewItems/useTreeViewItems.selectors");
var getLastNavigableItemInArray = function (state, items) {
    // Equivalent to Array.prototype.findLastIndex
    var itemIndex = items.length - 1;
    while (itemIndex >= 0 && !(0, useTreeViewItems_selectors_1.selectorCanItemBeFocused)(state, items[itemIndex])) {
        itemIndex -= 1;
    }
    if (itemIndex === -1) {
        return undefined;
    }
    return items[itemIndex];
};
var getPreviousNavigableItem = function (state, itemId) {
    var itemMeta = (0, useTreeViewItems_selectors_1.selectorItemMeta)(state, itemId);
    if (!itemMeta) {
        return null;
    }
    var siblings = (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(state, itemMeta.parentId);
    var itemIndex = (0, useTreeViewItems_selectors_1.selectorItemIndex)(state, itemId);
    // TODO: What should we do if the parent is not navigable?
    if (itemIndex === 0) {
        return itemMeta.parentId;
    }
    // Finds the previous navigable sibling.
    var previousNavigableSiblingIndex = itemIndex - 1;
    while (!(0, useTreeViewItems_selectors_1.selectorCanItemBeFocused)(state, siblings[previousNavigableSiblingIndex]) &&
        previousNavigableSiblingIndex >= 0) {
        previousNavigableSiblingIndex -= 1;
    }
    if (previousNavigableSiblingIndex === -1) {
        // If we are at depth 0, then it means all the items above the current item are not navigable.
        if (itemMeta.parentId == null) {
            return null;
        }
        // Otherwise, we can try to go up a level and find the previous navigable item.
        return (0, exports.getPreviousNavigableItem)(state, itemMeta.parentId);
    }
    // Finds the last navigable ancestor of the previous navigable sibling.
    var currentItemId = siblings[previousNavigableSiblingIndex];
    var lastNavigableChild = getLastNavigableItemInArray(state, (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(state, currentItemId));
    while ((0, useTreeViewExpansion_selectors_1.selectorIsItemExpanded)(state, currentItemId) && lastNavigableChild != null) {
        currentItemId = lastNavigableChild;
        lastNavigableChild = getLastNavigableItemInArray(state, (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(state, currentItemId));
    }
    return currentItemId;
};
exports.getPreviousNavigableItem = getPreviousNavigableItem;
var getNextNavigableItem = function (state, itemId) {
    // If the item is expanded and has some navigable children, return the first of them.
    if ((0, useTreeViewExpansion_selectors_1.selectorIsItemExpanded)(state, itemId)) {
        var firstNavigableChild = (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(state, itemId).find(function (childId) {
            return (0, useTreeViewItems_selectors_1.selectorCanItemBeFocused)(state, childId);
        });
        if (firstNavigableChild != null) {
            return firstNavigableChild;
        }
    }
    var itemMeta = (0, useTreeViewItems_selectors_1.selectorItemMeta)(state, itemId);
    while (itemMeta != null) {
        // Try to find the first navigable sibling after the current item.
        var siblings = (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(state, itemMeta.parentId);
        var currentItemIndex = (0, useTreeViewItems_selectors_1.selectorItemIndex)(state, itemMeta.id);
        if (currentItemIndex < siblings.length - 1) {
            var nextItemIndex = currentItemIndex + 1;
            while (!(0, useTreeViewItems_selectors_1.selectorCanItemBeFocused)(state, siblings[nextItemIndex]) &&
                nextItemIndex < siblings.length - 1) {
                nextItemIndex += 1;
            }
            if ((0, useTreeViewItems_selectors_1.selectorCanItemBeFocused)(state, siblings[nextItemIndex])) {
                return siblings[nextItemIndex];
            }
        }
        // If the sibling does not exist, go up a level to the parent and try again.
        itemMeta = (0, useTreeViewItems_selectors_1.selectorItemMeta)(state, itemMeta.parentId);
    }
    return null;
};
exports.getNextNavigableItem = getNextNavigableItem;
var getLastNavigableItem = function (state) {
    var itemId = null;
    while (itemId == null || (0, useTreeViewExpansion_selectors_1.selectorIsItemExpanded)(state, itemId)) {
        var children = (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(state, itemId);
        var lastNavigableChild = getLastNavigableItemInArray(state, children);
        // The item has no navigable children.
        if (lastNavigableChild == null) {
            return itemId;
        }
        itemId = lastNavigableChild;
    }
    return itemId;
};
exports.getLastNavigableItem = getLastNavigableItem;
var getFirstNavigableItem = function (state) {
    return (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(state, null).find(function (itemId) {
        return (0, useTreeViewItems_selectors_1.selectorCanItemBeFocused)(state, itemId);
    });
};
exports.getFirstNavigableItem = getFirstNavigableItem;
/**
 * This is used to determine the start and end of a selection range so
 * we can get the items between the two border items.
 *
 * It finds the items' common ancestor using
 * a naive implementation of a lowest common ancestor algorithm
 * (https://en.wikipedia.org/wiki/Lowest_common_ancestor).
 * Then compares the ancestor's 2 children that are ancestors of itemA and ItemB
 * so we can compare their indexes to work out which item comes first in a depth first search.
 * (https://en.wikipedia.org/wiki/Depth-first_search)
 *
 * Another way to put it is which item is shallower in a trémaux tree
 * https://en.wikipedia.org/wiki/Tr%C3%A9maux_tree
 */
var findOrderInTremauxTree = function (state, itemAId, itemBId) {
    if (itemAId === itemBId) {
        return [itemAId, itemBId];
    }
    var itemMetaA = (0, useTreeViewItems_selectors_1.selectorItemMeta)(state, itemAId);
    var itemMetaB = (0, useTreeViewItems_selectors_1.selectorItemMeta)(state, itemBId);
    if (!itemMetaA || !itemMetaB) {
        return [itemAId, itemBId];
    }
    if (itemMetaA.parentId === itemMetaB.id || itemMetaB.parentId === itemMetaA.id) {
        return itemMetaB.parentId === itemMetaA.id
            ? [itemMetaA.id, itemMetaB.id]
            : [itemMetaB.id, itemMetaA.id];
    }
    var aFamily = [itemMetaA.id];
    var bFamily = [itemMetaB.id];
    var aAncestor = itemMetaA.parentId;
    var bAncestor = itemMetaB.parentId;
    var aAncestorIsCommon = bFamily.indexOf(aAncestor) !== -1;
    var bAncestorIsCommon = aFamily.indexOf(bAncestor) !== -1;
    var continueA = true;
    var continueB = true;
    while (!bAncestorIsCommon && !aAncestorIsCommon) {
        if (continueA) {
            aFamily.push(aAncestor);
            aAncestorIsCommon = bFamily.indexOf(aAncestor) !== -1;
            continueA = aAncestor !== null;
            if (!aAncestorIsCommon && continueA) {
                aAncestor = (0, useTreeViewItems_selectors_1.selectorItemParentId)(state, aAncestor);
            }
        }
        if (continueB && !aAncestorIsCommon) {
            bFamily.push(bAncestor);
            bAncestorIsCommon = aFamily.indexOf(bAncestor) !== -1;
            continueB = bAncestor !== null;
            if (!bAncestorIsCommon && continueB) {
                bAncestor = (0, useTreeViewItems_selectors_1.selectorItemParentId)(state, bAncestor);
            }
        }
    }
    var commonAncestor = aAncestorIsCommon ? aAncestor : bAncestor;
    var ancestorFamily = (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(state, commonAncestor);
    var aSide = aFamily[aFamily.indexOf(commonAncestor) - 1];
    var bSide = bFamily[bFamily.indexOf(commonAncestor) - 1];
    return ancestorFamily.indexOf(aSide) < ancestorFamily.indexOf(bSide)
        ? [itemAId, itemBId]
        : [itemBId, itemAId];
};
exports.findOrderInTremauxTree = findOrderInTremauxTree;
var getNonDisabledItemsInRange = function (state, itemAId, itemBId) {
    var getNextItem = function (itemId) {
        // If the item is expanded and has some children, return the first of them.
        if ((0, useTreeViewExpansion_selectors_1.selectorIsItemExpandable)(state, itemId) && (0, useTreeViewExpansion_selectors_1.selectorIsItemExpanded)(state, itemId)) {
            return (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(state, itemId)[0];
        }
        var itemMeta = (0, useTreeViewItems_selectors_1.selectorItemMeta)(state, itemId);
        while (itemMeta != null) {
            // Try to find the first navigable sibling after the current item.
            var siblings = (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(state, itemMeta.parentId);
            var currentItemIndex = (0, useTreeViewItems_selectors_1.selectorItemIndex)(state, itemMeta.id);
            if (currentItemIndex < siblings.length - 1) {
                return siblings[currentItemIndex + 1];
            }
            // If the item is the last of its siblings, go up a level to the parent and try again.
            itemMeta = itemMeta.parentId ? (0, useTreeViewItems_selectors_1.selectorItemMeta)(state, itemMeta.parentId) : null;
        }
        throw new Error('Invalid range');
    };
    var _a = (0, exports.findOrderInTremauxTree)(state, itemAId, itemBId), first = _a[0], last = _a[1];
    var items = [first];
    var current = first;
    while (current !== last) {
        current = getNextItem(current);
        if (!(0, useTreeViewItems_selectors_1.selectorIsItemDisabled)(state, current)) {
            items.push(current);
        }
    }
    return items;
};
exports.getNonDisabledItemsInRange = getNonDisabledItemsInRange;
var getAllNavigableItems = function (state) {
    var item = (0, exports.getFirstNavigableItem)(state);
    var navigableItems = [];
    while (item != null) {
        navigableItems.push(item);
        item = (0, exports.getNextNavigableItem)(state, item);
    }
    return navigableItems;
};
exports.getAllNavigableItems = getAllNavigableItems;
/**
 * Checks if the target is in a descendant of this item.
 * This can prevent from firing some logic on the ancestors on the interacted item when the event handler is on the root.
 * @param {HTMLElement} target The target to check
 * @param {HTMLElement | null} itemRoot The root of the item to check if the event target is in its descendants
 * @returns {boolean} Whether the target is in a descendant of this item
 */
var isTargetInDescendants = function (target, itemRoot) {
    return itemRoot !== target.closest('*[role="treeitem"]');
};
exports.isTargetInDescendants = isTargetInDescendants;
