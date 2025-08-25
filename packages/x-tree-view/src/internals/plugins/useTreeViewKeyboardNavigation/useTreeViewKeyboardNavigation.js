"use strict";
'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTreeViewKeyboardNavigation = void 0;
var React = require("react");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var tree_1 = require("../../utils/tree");
var plugins_1 = require("../../utils/plugins");
var useTreeViewLabel_1 = require("../useTreeViewLabel");
var useSelector_1 = require("../../hooks/useSelector");
var useTreeViewItems_selectors_1 = require("../useTreeViewItems/useTreeViewItems.selectors");
var useTreeViewLabel_selectors_1 = require("../useTreeViewLabel/useTreeViewLabel.selectors");
var useTreeViewSelection_selectors_1 = require("../useTreeViewSelection/useTreeViewSelection.selectors");
var useTreeViewExpansion_selectors_1 = require("../useTreeViewExpansion/useTreeViewExpansion.selectors");
function isPrintableKey(string) {
    return !!string && string.length === 1 && !!string.match(/\S/);
}
var useTreeViewKeyboardNavigation = function (_a) {
    var instance = _a.instance, store = _a.store, params = _a.params;
    var isRtl = (0, RtlProvider_1.useRtl)();
    var firstCharMap = React.useRef({});
    var updateFirstCharMap = (0, useEventCallback_1.default)(function (callback) {
        firstCharMap.current = callback(firstCharMap.current);
    });
    var itemMetaLookup = (0, useSelector_1.useSelector)(store, useTreeViewItems_selectors_1.selectorItemMetaLookup);
    React.useEffect(function () {
        if (instance.areItemUpdatesPrevented()) {
            return;
        }
        var newFirstCharMap = {};
        var processItem = function (item) {
            newFirstCharMap[item.id] = item.label.substring(0, 1).toLowerCase();
        };
        Object.values(itemMetaLookup).forEach(processItem);
        firstCharMap.current = newFirstCharMap;
    }, [itemMetaLookup, params.getItemId, instance]);
    var getFirstMatchingItem = function (itemId, query) {
        var cleanQuery = query.toLowerCase();
        var getNextItem = function (itemIdToCheck) {
            var nextItemId = (0, tree_1.getNextNavigableItem)(store.value, itemIdToCheck);
            // We reached the end of the tree, check from the beginning
            if (nextItemId === null) {
                return (0, tree_1.getFirstNavigableItem)(store.value);
            }
            return nextItemId;
        };
        var matchingItemId = null;
        var currentItemId = getNextItem(itemId);
        var checkedItems = {};
        // The "!checkedItems[currentItemId]" condition avoids an infinite loop when there is no matching item.
        while (matchingItemId == null && !checkedItems[currentItemId]) {
            if (firstCharMap.current[currentItemId] === cleanQuery) {
                matchingItemId = currentItemId;
            }
            else {
                checkedItems[currentItemId] = true;
                currentItemId = getNextItem(currentItemId);
            }
        }
        return matchingItemId;
    };
    var canToggleItemSelection = function (itemId) {
        return (0, useTreeViewSelection_selectors_1.selectorIsSelectionEnabled)(store.value) && !(0, useTreeViewItems_selectors_1.selectorIsItemDisabled)(store.value, itemId);
    };
    var canToggleItemExpansion = function (itemId) {
        return (!(0, useTreeViewItems_selectors_1.selectorIsItemDisabled)(store.value, itemId) && (0, useTreeViewExpansion_selectors_1.selectorIsItemExpandable)(store.value, itemId));
    };
    // ARIA specification: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction
    var handleItemKeyDown = function (event, itemId) { return __awaiter(void 0, void 0, void 0, function () {
        var ctrlPressed, key, isMultiSelectEnabled, nextItem, previousItem, nextItemId, parent_1, matchingItem;
        return __generator(this, function (_a) {
            if (event.defaultMuiPrevented) {
                return [2 /*return*/];
            }
            if (event.altKey ||
                (0, tree_1.isTargetInDescendants)(event.target, event.currentTarget)) {
                return [2 /*return*/];
            }
            ctrlPressed = event.ctrlKey || event.metaKey;
            key = event.key;
            isMultiSelectEnabled = (0, useTreeViewSelection_selectors_1.selectorIsMultiSelectEnabled)(store.value);
            // eslint-disable-next-line default-case
            switch (true) {
                // Select the item when pressing "Space"
                case key === ' ' && canToggleItemSelection(itemId): {
                    event.preventDefault();
                    if (isMultiSelectEnabled && event.shiftKey) {
                        instance.expandSelectionRange(event, itemId);
                    }
                    else {
                        instance.setItemSelection({
                            event: event,
                            itemId: itemId,
                            keepExistingSelection: isMultiSelectEnabled,
                            shouldBeSelected: undefined,
                        });
                    }
                    break;
                }
                // If the focused item has children, we expand it.
                // If the focused item has no children, we select it.
                case key === 'Enter': {
                    if ((0, plugins_1.hasPlugin)(instance, useTreeViewLabel_1.useTreeViewLabel) &&
                        (0, useTreeViewLabel_selectors_1.selectorIsItemEditable)(store.value, itemId) &&
                        !(0, useTreeViewLabel_selectors_1.selectorIsItemBeingEdited)(store.value, itemId)) {
                        instance.setEditedItem(itemId);
                    }
                    else if (canToggleItemExpansion(itemId)) {
                        instance.setItemExpansion({ event: event, itemId: itemId });
                        event.preventDefault();
                    }
                    else if (canToggleItemSelection(itemId)) {
                        if (isMultiSelectEnabled) {
                            event.preventDefault();
                            instance.setItemSelection({ event: event, itemId: itemId, keepExistingSelection: true });
                        }
                        else if (!(0, useTreeViewSelection_selectors_1.selectorIsItemSelected)(store.value, itemId)) {
                            instance.setItemSelection({ event: event, itemId: itemId });
                            event.preventDefault();
                        }
                    }
                    break;
                }
                // Focus the next focusable item
                case key === 'ArrowDown': {
                    nextItem = (0, tree_1.getNextNavigableItem)(store.value, itemId);
                    if (nextItem) {
                        event.preventDefault();
                        instance.focusItem(event, nextItem);
                        // Multi select behavior when pressing Shift + ArrowDown
                        // Toggles the selection state of the next item
                        if (isMultiSelectEnabled && event.shiftKey && canToggleItemSelection(nextItem)) {
                            instance.selectItemFromArrowNavigation(event, itemId, nextItem);
                        }
                    }
                    break;
                }
                // Focuses the previous focusable item
                case key === 'ArrowUp': {
                    previousItem = (0, tree_1.getPreviousNavigableItem)(store.value, itemId);
                    if (previousItem) {
                        event.preventDefault();
                        instance.focusItem(event, previousItem);
                        // Multi select behavior when pressing Shift + ArrowUp
                        // Toggles the selection state of the previous item
                        if (isMultiSelectEnabled && event.shiftKey && canToggleItemSelection(previousItem)) {
                            instance.selectItemFromArrowNavigation(event, itemId, previousItem);
                        }
                    }
                    break;
                }
                // If the focused item is expanded, we move the focus to its first child
                // If the focused item is collapsed and has children, we expand it
                case (key === 'ArrowRight' && !isRtl) || (key === 'ArrowLeft' && isRtl): {
                    if (ctrlPressed) {
                        return [2 /*return*/];
                    }
                    if ((0, useTreeViewExpansion_selectors_1.selectorIsItemExpanded)(store.value, itemId)) {
                        nextItemId = (0, tree_1.getNextNavigableItem)(store.value, itemId);
                        if (nextItemId) {
                            instance.focusItem(event, nextItemId);
                            event.preventDefault();
                        }
                    }
                    else if (canToggleItemExpansion(itemId)) {
                        instance.setItemExpansion({ event: event, itemId: itemId });
                        event.preventDefault();
                    }
                    break;
                }
                // If the focused item is expanded, we collapse it
                // If the focused item is collapsed and has a parent, we move the focus to this parent
                case (key === 'ArrowLeft' && !isRtl) || (key === 'ArrowRight' && isRtl): {
                    if (ctrlPressed) {
                        return [2 /*return*/];
                    }
                    if (canToggleItemExpansion(itemId) && (0, useTreeViewExpansion_selectors_1.selectorIsItemExpanded)(store.value, itemId)) {
                        instance.setItemExpansion({ event: event, itemId: itemId });
                        event.preventDefault();
                    }
                    else {
                        parent_1 = (0, useTreeViewItems_selectors_1.selectorItemParentId)(store.value, itemId);
                        if (parent_1) {
                            instance.focusItem(event, parent_1);
                            event.preventDefault();
                        }
                    }
                    break;
                }
                // Focuses the first item in the tree
                case key === 'Home': {
                    // Multi select behavior when pressing Ctrl + Shift + Home
                    // Selects the focused item and all items up to the first item.
                    if (canToggleItemSelection(itemId) &&
                        isMultiSelectEnabled &&
                        ctrlPressed &&
                        event.shiftKey) {
                        instance.selectRangeFromStartToItem(event, itemId);
                    }
                    else {
                        instance.focusItem(event, (0, tree_1.getFirstNavigableItem)(store.value));
                    }
                    event.preventDefault();
                    break;
                }
                // Focuses the last item in the tree
                case key === 'End': {
                    // Multi select behavior when pressing Ctrl + Shirt + End
                    // Selects the focused item and all the items down to the last item.
                    if (canToggleItemSelection(itemId) &&
                        isMultiSelectEnabled &&
                        ctrlPressed &&
                        event.shiftKey) {
                        instance.selectRangeFromItemToEnd(event, itemId);
                    }
                    else {
                        instance.focusItem(event, (0, tree_1.getLastNavigableItem)(store.value));
                    }
                    event.preventDefault();
                    break;
                }
                // Expand all siblings that are at the same level as the focused item
                case key === '*': {
                    instance.expandAllSiblings(event, itemId);
                    event.preventDefault();
                    break;
                }
                // Multi select behavior when pressing Ctrl + a
                // Selects all the items
                case String.fromCharCode(event.keyCode) === 'A' &&
                    ctrlPressed &&
                    isMultiSelectEnabled &&
                    (0, useTreeViewSelection_selectors_1.selectorIsSelectionEnabled)(store.value):
                    {
                        instance.selectAllNavigableItems(event);
                        event.preventDefault();
                        break;
                    }
                // Type-ahead
                // TODO: Support typing multiple characters
                case !ctrlPressed && !event.shiftKey && isPrintableKey(key): {
                    matchingItem = getFirstMatchingItem(itemId, key);
                    if (matchingItem != null) {
                        instance.focusItem(event, matchingItem);
                        event.preventDefault();
                    }
                    break;
                }
            }
            return [2 /*return*/];
        });
    }); };
    return {
        instance: {
            updateFirstCharMap: updateFirstCharMap,
            handleItemKeyDown: handleItemKeyDown,
        },
    };
};
exports.useTreeViewKeyboardNavigation = useTreeViewKeyboardNavigation;
exports.useTreeViewKeyboardNavigation.params = {};
