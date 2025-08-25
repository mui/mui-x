"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTreeViewItemsReorderingItemPlugin = exports.isAndroid = void 0;
var React = require("react");
var internals_1 = require("@mui/x-tree-view/internals");
var useTreeViewItemsReordering_selectors_1 = require("./useTreeViewItemsReordering.selectors");
var isAndroid = function () { return navigator.userAgent.toLowerCase().includes('android'); };
exports.isAndroid = isAndroid;
var useTreeViewItemsReorderingItemPlugin = function (_a) {
    var props = _a.props;
    var _b = (0, internals_1.useTreeViewContext)(), instance = _b.instance, store = _b.store;
    var itemId = props.itemId;
    var validActionsRef = React.useRef(null);
    var draggedItemProperties = (0, internals_1.useSelector)(store, useTreeViewItemsReordering_selectors_1.selectorDraggedItemProperties, itemId);
    var canItemBeReordered = (0, internals_1.useSelector)(store, useTreeViewItemsReordering_selectors_1.selectorCanItemBeReordered, itemId);
    var isValidTarget = (0, internals_1.useSelector)(store, useTreeViewItemsReordering_selectors_1.selectorIsItemValidReorderingTarget, itemId);
    return {
        propsEnhancers: {
            root: function (_a) {
                var rootRefObject = _a.rootRefObject, contentRefObject = _a.contentRefObject, externalEventHandlers = _a.externalEventHandlers;
                if (!canItemBeReordered) {
                    return {};
                }
                var handleDragStart = function (event) {
                    var _a;
                    (_a = externalEventHandlers.onDragStart) === null || _a === void 0 ? void 0 : _a.call(externalEventHandlers, event);
                    if (event.defaultMuiPrevented || event.defaultPrevented) {
                        return;
                    }
                    // We don't use `event.currentTarget` here.
                    // This is to allow people to pass `onDragStart` to another element than the root.
                    if ((0, internals_1.isTargetInDescendants)(event.target, rootRefObject.current)) {
                        return;
                    }
                    // Comment to show the children in the drag preview
                    // TODO: Improve the customization of the drag preview
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setDragImage(contentRefObject.current, 0, 0);
                    var types = event.dataTransfer.types;
                    if ((0, exports.isAndroid)() && !types.includes('text/plain') && !types.includes('text/uri-list')) {
                        event.dataTransfer.setData('text/plain', 'android-fallback');
                    }
                    // iOS requires a media type to be defined
                    event.dataTransfer.setData('application/mui-x', '');
                    instance.startDraggingItem(itemId);
                };
                var handleRootDragOver = function (event) {
                    var _a;
                    (_a = externalEventHandlers.onDragOver) === null || _a === void 0 ? void 0 : _a.call(externalEventHandlers, event);
                    if (event.defaultMuiPrevented) {
                        return;
                    }
                    event.preventDefault();
                };
                var handleRootDragEnd = function (event) {
                    var _a;
                    (_a = externalEventHandlers.onDragEnd) === null || _a === void 0 ? void 0 : _a.call(externalEventHandlers, event);
                    if (event.defaultMuiPrevented) {
                        return;
                    }
                    // Check if the drag-and-drop was cancelled, possibly by pressing Escape
                    if (event.dataTransfer.dropEffect === 'none') {
                        instance.cancelDraggingItem();
                        return;
                    }
                    instance.completeDraggingItem(itemId);
                };
                return {
                    draggable: true,
                    onDragStart: handleDragStart,
                    onDragOver: handleRootDragOver,
                    onDragEnd: handleRootDragEnd,
                };
            },
            content: function (_a) {
                var externalEventHandlers = _a.externalEventHandlers, contentRefObject = _a.contentRefObject;
                if (!isValidTarget) {
                    return {};
                }
                var handleDragOver = function (event) {
                    var _a;
                    (_a = externalEventHandlers.onDragOver) === null || _a === void 0 ? void 0 : _a.call(externalEventHandlers, event);
                    if (event.defaultMuiPrevented || validActionsRef.current == null) {
                        return;
                    }
                    var rect = event.target.getBoundingClientRect();
                    var y = event.clientY - rect.top;
                    var x = event.clientX - rect.left;
                    instance.setDragTargetItem({
                        itemId: itemId,
                        validActions: validActionsRef.current,
                        targetHeight: rect.height,
                        cursorY: y,
                        cursorX: x,
                        contentElement: contentRefObject.current,
                    });
                };
                var handleDragEnter = function (event) {
                    var _a;
                    (_a = externalEventHandlers.onDragEnter) === null || _a === void 0 ? void 0 : _a.call(externalEventHandlers, event);
                    if (event.defaultMuiPrevented) {
                        return;
                    }
                    validActionsRef.current = instance.getDroppingTargetValidActions(itemId);
                };
                return {
                    onDragEnter: handleDragEnter,
                    onDragOver: handleDragOver,
                };
            },
            dragAndDropOverlay: function () {
                if (!draggedItemProperties) {
                    return {};
                }
                return {
                    action: draggedItemProperties.action,
                    style: {
                        '--TreeView-targetDepth': draggedItemProperties.targetDepth,
                    },
                };
            },
        },
    };
};
exports.useTreeViewItemsReorderingItemPlugin = useTreeViewItemsReorderingItemPlugin;
