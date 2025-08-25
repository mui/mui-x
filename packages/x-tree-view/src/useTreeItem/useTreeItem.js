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
exports.useTreeItem = void 0;
var React = require("react");
var extractEventHandlers_1 = require("@mui/utils/extractEventHandlers");
var useForkRef_1 = require("@mui/utils/useForkRef");
var TreeViewProvider_1 = require("../internals/TreeViewProvider");
var useTreeItemUtils_1 = require("../hooks/useTreeItemUtils");
var TreeViewItemDepthContext_1 = require("../internals/TreeViewItemDepthContext");
var tree_1 = require("../internals/utils/tree");
var useSelector_1 = require("../internals/hooks/useSelector");
var useTreeViewFocus_selectors_1 = require("../internals/plugins/useTreeViewFocus/useTreeViewFocus.selectors");
var useTreeViewId_utils_1 = require("../internals/corePlugins/useTreeViewId/useTreeViewId.utils");
var useTreeViewItems_selectors_1 = require("../internals/plugins/useTreeViewItems/useTreeViewItems.selectors");
var useTreeViewId_selectors_1 = require("../internals/corePlugins/useTreeViewId/useTreeViewId.selectors");
var useTreeViewExpansion_selectors_1 = require("../internals/plugins/useTreeViewExpansion/useTreeViewExpansion.selectors");
var useTreeViewSelection_selectors_1 = require("../internals/plugins/useTreeViewSelection/useTreeViewSelection.selectors");
var useTreeItem = function (parameters) {
    var _a = (0, TreeViewProvider_1.useTreeViewContext)(), runItemPlugins = _a.runItemPlugins, instance = _a.instance, publicAPI = _a.publicAPI, store = _a.store;
    var depthContext = React.useContext(TreeViewItemDepthContext_1.TreeViewItemDepthContext);
    var depth = (0, useSelector_1.useSelector)(store, function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        if (typeof depthContext === 'function') {
            return depthContext.apply(void 0, params);
        }
        return depthContext;
    }, parameters.itemId);
    var id = parameters.id, itemId = parameters.itemId, label = parameters.label, children = parameters.children, rootRef = parameters.rootRef;
    var _b = runItemPlugins(parameters), pluginRootRef = _b.rootRef, contentRef = _b.contentRef, propsEnhancers = _b.propsEnhancers;
    var _c = (0, useTreeItemUtils_1.useTreeItemUtils)({ itemId: itemId, children: children }), interactions = _c.interactions, status = _c.status;
    var rootRefObject = React.useRef(null);
    var contentRefObject = React.useRef(null);
    var handleRootRef = (0, useForkRef_1.default)(rootRef, pluginRootRef, rootRefObject);
    var handleContentRef = (0, useForkRef_1.default)(contentRef, contentRefObject);
    var checkboxRef = React.useRef(null);
    var treeId = (0, useSelector_1.useSelector)(store, useTreeViewId_selectors_1.selectorTreeViewId);
    var isSelectionEnabledForItem = (0, useSelector_1.useSelector)(store, useTreeViewSelection_selectors_1.selectorIsItemSelectionEnabled, itemId);
    var isCheckboxSelectionEnabled = (0, useSelector_1.useSelector)(store, useTreeViewSelection_selectors_1.selectorIsCheckboxSelectionEnabled);
    var idAttribute = (0, useTreeViewId_utils_1.generateTreeItemIdAttribute)({ itemId: itemId, treeId: treeId, id: id });
    var shouldBeAccessibleWithTab = (0, useSelector_1.useSelector)(store, useTreeViewFocus_selectors_1.selectorIsItemTheDefaultFocusableItem, itemId);
    var sharedPropsEnhancerParams = { rootRefObject: rootRefObject, contentRefObject: contentRefObject, interactions: interactions };
    var createRootHandleFocus = function (otherHandlers) {
        return function (event) {
            var _a;
            (_a = otherHandlers.onFocus) === null || _a === void 0 ? void 0 : _a.call(otherHandlers, event);
            if (event.defaultMuiPrevented) {
                return;
            }
            if (!status.focused &&
                (0, useTreeViewItems_selectors_1.selectorCanItemBeFocused)(store.value, itemId) &&
                event.currentTarget === event.target) {
                instance.focusItem(event, itemId);
            }
        };
    };
    var createRootHandleBlur = function (otherHandlers) {
        return function (event) {
            var _a, _b, _c, _d, _e;
            (_a = otherHandlers.onBlur) === null || _a === void 0 ? void 0 : _a.call(otherHandlers, event);
            if (event.defaultMuiPrevented) {
                return;
            }
            var rootElement = instance.getItemDOMElement(itemId);
            // Don't blur the root when switching to editing mode
            // the input that triggers the root blur can be either the relatedTarget (when entering editing state) or the target (when exiting editing state)
            // when we enter the editing state, we focus the input -> we don't want to remove the focused item from the state
            if (status.editing ||
                // we can exit the editing state by clicking outside the input (within the Tree Item) or by pressing Enter or Escape -> we don't want to remove the focused item from the state in these cases
                // we can also exit the editing state by clicking on the root itself -> want to remove the focused item from the state in this case
                (event.relatedTarget &&
                    (0, tree_1.isTargetInDescendants)(event.relatedTarget, rootElement) &&
                    ((event.target &&
                        ((_c = (_b = event.target) === null || _b === void 0 ? void 0 : _b.dataset) === null || _c === void 0 ? void 0 : _c.element) === 'labelInput' &&
                        (0, tree_1.isTargetInDescendants)(event.target, rootElement)) ||
                        ((_e = (_d = event.relatedTarget) === null || _d === void 0 ? void 0 : _d.dataset) === null || _e === void 0 ? void 0 : _e.element) === 'labelInput'))) {
                return;
            }
            instance.removeFocusedItem();
        };
    };
    var createRootHandleKeyDown = function (otherHandlers) {
        return function (event) {
            var _a, _b, _c;
            (_a = otherHandlers.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(otherHandlers, event);
            if (event.defaultMuiPrevented ||
                ((_c = (_b = event.target) === null || _b === void 0 ? void 0 : _b.dataset) === null || _c === void 0 ? void 0 : _c.element) === 'labelInput') {
                return;
            }
            instance.handleItemKeyDown(event, itemId);
        };
    };
    var createLabelHandleDoubleClick = function (otherHandlers) { return function (event) {
        var _a;
        (_a = otherHandlers.onDoubleClick) === null || _a === void 0 ? void 0 : _a.call(otherHandlers, event);
        if (event.defaultMuiPrevented) {
            return;
        }
        interactions.toggleItemEditing();
    }; };
    var createContentHandleClick = function (otherHandlers) { return function (event) {
        var _a, _b;
        (_a = otherHandlers.onClick) === null || _a === void 0 ? void 0 : _a.call(otherHandlers, event);
        instance.handleItemClick(event, itemId);
        if (event.defaultMuiPrevented || ((_b = checkboxRef.current) === null || _b === void 0 ? void 0 : _b.contains(event.target))) {
            return;
        }
        if ((0, useTreeViewExpansion_selectors_1.selectorItemExpansionTrigger)(store.value) === 'content') {
            interactions.handleExpansion(event);
        }
        if (!isCheckboxSelectionEnabled) {
            interactions.handleSelection(event);
        }
    }; };
    var createContentHandleMouseDown = function (otherHandlers) { return function (event) {
        var _a;
        (_a = otherHandlers.onMouseDown) === null || _a === void 0 ? void 0 : _a.call(otherHandlers, event);
        if (event.defaultMuiPrevented) {
            return;
        }
        // Prevent text selection
        if (event.shiftKey || event.ctrlKey || event.metaKey || status.disabled) {
            event.preventDefault();
        }
    }; };
    var createIconContainerHandleClick = function (otherHandlers) { return function (event) {
        var _a;
        (_a = otherHandlers.onClick) === null || _a === void 0 ? void 0 : _a.call(otherHandlers, event);
        if (event.defaultMuiPrevented) {
            return;
        }
        if ((0, useTreeViewExpansion_selectors_1.selectorItemExpansionTrigger)(store.value) === 'iconContainer') {
            interactions.handleExpansion(event);
        }
    }; };
    var getContextProviderProps = function () { return ({ itemId: itemId, id: id }); };
    var getRootProps = function (externalProps) {
        var _a, _b, _c;
        if (externalProps === void 0) { externalProps = {}; }
        var externalEventHandlers = __assign(__assign({}, (0, extractEventHandlers_1.default)(parameters)), (0, extractEventHandlers_1.default)(externalProps));
        // https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
        var ariaSelected;
        if (status.selected) {
            // - each selected node has aria-selected set to true.
            ariaSelected = true;
        }
        else if (!isSelectionEnabledForItem) {
            // - if the tree contains nodes that are not selectable, aria-selected is not present on those nodes.
            ariaSelected = undefined;
        }
        else {
            // - all nodes that are selectable but not selected have aria-selected set to false.
            ariaSelected = false;
        }
        var props = __assign(__assign(__assign(__assign({}, externalEventHandlers), { ref: handleRootRef, role: 'treeitem', tabIndex: shouldBeAccessibleWithTab ? 0 : -1, id: idAttribute, 'aria-expanded': status.expandable ? status.expanded : undefined, 'aria-selected': ariaSelected, 'aria-disabled': status.disabled || undefined }), externalProps), { style: __assign(__assign({}, ((_a = externalProps.style) !== null && _a !== void 0 ? _a : {})), { '--TreeView-itemDepth': depth }), onFocus: createRootHandleFocus(externalEventHandlers), onBlur: createRootHandleBlur(externalEventHandlers), onKeyDown: createRootHandleKeyDown(externalEventHandlers) });
        var enhancedRootProps = (_c = (_b = propsEnhancers.root) === null || _b === void 0 ? void 0 : _b.call(propsEnhancers, __assign(__assign({}, sharedPropsEnhancerParams), { externalEventHandlers: externalEventHandlers }))) !== null && _c !== void 0 ? _c : {};
        return __assign(__assign({}, props), enhancedRootProps);
    };
    var getContentProps = function (externalProps) {
        var _a, _b;
        if (externalProps === void 0) { externalProps = {}; }
        var externalEventHandlers = (0, extractEventHandlers_1.default)(externalProps);
        var props = __assign(__assign(__assign({}, externalEventHandlers), externalProps), { ref: handleContentRef, onClick: createContentHandleClick(externalEventHandlers), onMouseDown: createContentHandleMouseDown(externalEventHandlers), status: status });
        ['expanded', 'selected', 'focused', 'disabled', 'editing', 'editable'].forEach(function (key) {
            if (status[key]) {
                props["data-".concat(key)] = '';
            }
        });
        var enhancedContentProps = (_b = (_a = propsEnhancers.content) === null || _a === void 0 ? void 0 : _a.call(propsEnhancers, __assign(__assign({}, sharedPropsEnhancerParams), { externalEventHandlers: externalEventHandlers }))) !== null && _b !== void 0 ? _b : {};
        return __assign(__assign({}, props), enhancedContentProps);
    };
    var getCheckboxProps = function (externalProps) {
        var _a, _b;
        if (externalProps === void 0) { externalProps = {}; }
        var externalEventHandlers = (0, extractEventHandlers_1.default)(externalProps);
        var props = __assign(__assign(__assign({}, externalEventHandlers), { ref: checkboxRef, 'aria-hidden': true }), externalProps);
        var enhancedCheckboxProps = (_b = (_a = propsEnhancers.checkbox) === null || _a === void 0 ? void 0 : _a.call(propsEnhancers, __assign(__assign({}, sharedPropsEnhancerParams), { externalEventHandlers: externalEventHandlers }))) !== null && _b !== void 0 ? _b : {};
        return __assign(__assign({}, props), enhancedCheckboxProps);
    };
    var getLabelProps = function (externalProps) {
        var _a, _b;
        if (externalProps === void 0) { externalProps = {}; }
        var externalEventHandlers = __assign({}, (0, extractEventHandlers_1.default)(externalProps));
        var props = __assign(__assign(__assign(__assign({}, externalEventHandlers), { children: label }), externalProps), { onDoubleClick: createLabelHandleDoubleClick(externalEventHandlers) });
        var enhancedLabelProps = (_b = (_a = propsEnhancers.label) === null || _a === void 0 ? void 0 : _a.call(propsEnhancers, __assign(__assign({}, sharedPropsEnhancerParams), { externalEventHandlers: externalEventHandlers }))) !== null && _b !== void 0 ? _b : {};
        return __assign(__assign({}, enhancedLabelProps), props);
    };
    var getLabelInputProps = function (externalProps) {
        var _a, _b;
        if (externalProps === void 0) { externalProps = {}; }
        var externalEventHandlers = (0, extractEventHandlers_1.default)(externalProps);
        var enhancedLabelInputProps = (_b = (_a = propsEnhancers.labelInput) === null || _a === void 0 ? void 0 : _a.call(propsEnhancers, __assign(__assign({}, sharedPropsEnhancerParams), { externalEventHandlers: externalEventHandlers }))) !== null && _b !== void 0 ? _b : {};
        return __assign(__assign({}, externalProps), enhancedLabelInputProps);
    };
    var getIconContainerProps = function (externalProps) {
        if (externalProps === void 0) { externalProps = {}; }
        var externalEventHandlers = (0, extractEventHandlers_1.default)(externalProps);
        return __assign(__assign(__assign({}, externalEventHandlers), externalProps), { onClick: createIconContainerHandleClick(externalEventHandlers) });
    };
    var getErrorContainerProps = function (externalProps) {
        if (externalProps === void 0) { externalProps = {}; }
        var externalEventHandlers = (0, extractEventHandlers_1.default)(externalProps);
        return __assign(__assign({}, externalEventHandlers), externalProps);
    };
    var getLoadingContainerProps = function (externalProps) {
        if (externalProps === void 0) { externalProps = {}; }
        var externalEventHandlers = (0, extractEventHandlers_1.default)(externalProps);
        return __assign(__assign({ size: '12px', thickness: 6 }, externalEventHandlers), externalProps);
    };
    var getGroupTransitionProps = function (externalProps) {
        if (externalProps === void 0) { externalProps = {}; }
        var externalEventHandlers = (0, extractEventHandlers_1.default)(externalProps);
        var response = __assign(__assign(__assign({}, externalEventHandlers), { unmountOnExit: true, component: 'ul', role: 'group', in: status.expanded, children: children }), externalProps);
        return response;
    };
    var getDragAndDropOverlayProps = function (externalProps) {
        var _a, _b;
        if (externalProps === void 0) { externalProps = {}; }
        var externalEventHandlers = (0, extractEventHandlers_1.default)(externalProps);
        var enhancedDragAndDropOverlayProps = (_b = (_a = propsEnhancers.dragAndDropOverlay) === null || _a === void 0 ? void 0 : _a.call(propsEnhancers, __assign(__assign({}, sharedPropsEnhancerParams), { externalEventHandlers: externalEventHandlers }))) !== null && _b !== void 0 ? _b : {};
        return __assign(__assign({}, externalProps), enhancedDragAndDropOverlayProps);
    };
    return {
        getContextProviderProps: getContextProviderProps,
        getRootProps: getRootProps,
        getContentProps: getContentProps,
        getGroupTransitionProps: getGroupTransitionProps,
        getIconContainerProps: getIconContainerProps,
        getCheckboxProps: getCheckboxProps,
        getLabelProps: getLabelProps,
        getLabelInputProps: getLabelInputProps,
        getDragAndDropOverlayProps: getDragAndDropOverlayProps,
        getErrorContainerProps: getErrorContainerProps,
        getLoadingContainerProps: getLoadingContainerProps,
        rootRef: handleRootRef,
        status: status,
        publicAPI: publicAPI,
    };
};
exports.useTreeItem = useTreeItem;
