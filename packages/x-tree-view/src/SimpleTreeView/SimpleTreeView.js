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
exports.SimpleTreeView = exports.SimpleTreeViewRoot = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var warning_1 = require("@mui/x-internals/warning");
var zero_styled_1 = require("../internals/zero-styled");
var simpleTreeViewClasses_1 = require("./simpleTreeViewClasses");
var useTreeView_1 = require("../internals/useTreeView");
var TreeViewProvider_1 = require("../internals/TreeViewProvider");
var SimpleTreeView_plugins_1 = require("./SimpleTreeView.plugins");
var useThemeProps = (0, zero_styled_1.createUseThemeProps)('MuiSimpleTreeView');
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    return React.useMemo(function () {
        var slots = {
            root: ['root'],
            item: ['item'],
            itemContent: ['itemContent'],
            itemGroupTransition: ['itemGroupTransition'],
            itemIconContainer: ['itemIconContainer'],
            itemLabel: ['itemLabel'],
            // itemLabelInput: ['itemLabelInput'], => feature not available on this component
            itemCheckbox: ['itemCheckbox'],
            // itemDragAndDropOverlay: ['itemDragAndDropOverlay'], => feature not available on this component
            // itemErrorIcon: ['itemErrorIcon'], => feature not available on this component
        };
        return (0, composeClasses_1.default)(slots, simpleTreeViewClasses_1.getSimpleTreeViewUtilityClass, classes);
    }, [classes]);
};
exports.SimpleTreeViewRoot = (0, zero_styled_1.styled)('ul', {
    name: 'MuiSimpleTreeView',
    slot: 'Root',
})({
    padding: 0,
    margin: 0,
    listStyle: 'none',
    outline: 0,
    position: 'relative',
});
var EMPTY_ITEMS = [];
/**
 *
 * Demos:
 *
 * - [Tree View](https://mui.com/x/react-tree-view/)
 *
 * API:
 *
 * - [SimpleTreeView API](https://mui.com/x/api/tree-view/simple-tree-view/)
 */
var SimpleTreeView = React.forwardRef(function SimpleTreeView(inProps, ref) {
    var _a;
    var props = useThemeProps({ props: inProps, name: 'MuiSimpleTreeView' });
    var slots = props.slots, slotProps = props.slotProps, other = __rest(props, ["slots", "slotProps"]);
    if (process.env.NODE_ENV !== 'production') {
        if (props.items != null) {
            (0, warning_1.warnOnce)([
                'MUI X: The Simple Tree View component does not support the `items` prop.',
                'If you want to add items, you need to pass them as JSX children.',
                'Check the documentation for more details: https://mui.com/x/react-tree-view/simple-tree-view/items/.',
            ]);
        }
    }
    var _b = (0, useTreeView_1.useTreeView)({
        plugins: SimpleTreeView_plugins_1.SIMPLE_TREE_VIEW_PLUGINS,
        rootRef: ref,
        props: __assign(__assign({}, other), { items: EMPTY_ITEMS }),
    }), getRootProps = _b.getRootProps, contextValue = _b.contextValue;
    var classes = useUtilityClasses(props);
    var Root = (_a = slots === null || slots === void 0 ? void 0 : slots.root) !== null && _a !== void 0 ? _a : exports.SimpleTreeViewRoot;
    var rootProps = (0, useSlotProps_1.default)({
        elementType: Root,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.root,
        className: classes.root,
        getSlotProps: getRootProps,
        ownerState: props,
    });
    return (<TreeViewProvider_1.TreeViewProvider contextValue={contextValue} classes={classes} slots={slots} slotProps={slotProps}>
      <Root {...rootProps}/>
    </TreeViewProvider_1.TreeViewProvider>);
});
exports.SimpleTreeView = SimpleTreeView;
SimpleTreeView.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The ref object that allows Tree View manipulation. Can be instantiated with `useTreeViewApiRef()`.
     */
    apiRef: prop_types_1.default.shape({
        current: prop_types_1.default.shape({
            focusItem: prop_types_1.default.func.isRequired,
            getItem: prop_types_1.default.func.isRequired,
            getItemDOMElement: prop_types_1.default.func.isRequired,
            getItemOrderedChildrenIds: prop_types_1.default.func.isRequired,
            getItemTree: prop_types_1.default.func.isRequired,
            getParentId: prop_types_1.default.func.isRequired,
            setIsItemDisabled: prop_types_1.default.func.isRequired,
            setItemExpansion: prop_types_1.default.func.isRequired,
            setItemSelection: prop_types_1.default.func.isRequired,
        }),
    }),
    /**
     * If `true`, the Tree View renders a checkbox at the left of its label that allows selecting it.
     * @default false
     */
    checkboxSelection: prop_types_1.default.bool,
    /**
     * The content of the component.
     */
    children: prop_types_1.default.node,
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    /**
     * Expanded item ids.
     * Used when the item's expansion is not controlled.
     * @default []
     */
    defaultExpandedItems: prop_types_1.default.arrayOf(prop_types_1.default.string),
    /**
     * Selected item ids. (Uncontrolled)
     * When `multiSelect` is true this takes an array of strings; when false (default) a string.
     * @default []
     */
    defaultSelectedItems: prop_types_1.default.any,
    /**
     * If `true`, will allow focus on disabled items.
     * @default false
     */
    disabledItemsFocusable: prop_types_1.default.bool,
    /**
     * If `true` selection is disabled.
     * @default false
     */
    disableSelection: prop_types_1.default.bool,
    /**
     * Expanded item ids.
     * Used when the item's expansion is controlled.
     */
    expandedItems: prop_types_1.default.arrayOf(prop_types_1.default.string),
    /**
     * The slot that triggers the item's expansion when clicked.
     * @default 'content'
     */
    expansionTrigger: prop_types_1.default.oneOf(['content', 'iconContainer']),
    /**
     * This prop is used to help implement the accessibility logic.
     * If you don't provide this prop. It falls back to a randomly generated id.
     */
    id: prop_types_1.default.string,
    /**
     * Horizontal indentation between an item and its children.
     * Examples: 24, "24px", "2rem", "2em".
     * @default 12px
     */
    itemChildrenIndentation: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
    /**
     * If `true`, `ctrl` and `shift` will trigger multiselect.
     * @default false
     */
    multiSelect: prop_types_1.default.bool,
    /**
     * Callback fired when Tree Items are expanded/collapsed.
     * @param {React.SyntheticEvent} event The DOM event that triggered the change. Can be null when the change is caused by the `publicAPI.setItemExpansion()` method.
     * @param {array} itemIds The ids of the expanded items.
     */
    onExpandedItemsChange: prop_types_1.default.func,
    /**
     * Callback fired when the `content` slot of a given Tree Item is clicked.
     * @param {React.MouseEvent} event The DOM event that triggered the change.
     * @param {string} itemId The id of the focused item.
     */
    onItemClick: prop_types_1.default.func,
    /**
     * Callback fired when a Tree Item is expanded or collapsed.
     * @param {React.SyntheticEvent | null} event The DOM event that triggered the change. Can be null when the change is caused by the `publicAPI.setItemExpansion()` method.
     * @param {array} itemId The itemId of the modified item.
     * @param {array} isExpanded `true` if the item has just been expanded, `false` if it has just been collapsed.
     */
    onItemExpansionToggle: prop_types_1.default.func,
    /**
     * Callback fired when a given Tree Item is focused.
     * @param {React.SyntheticEvent | null} event The DOM event that triggered the change. **Warning**: This is a generic event not a focus event.
     * @param {string} itemId The id of the focused item.
     */
    onItemFocus: prop_types_1.default.func,
    /**
     * Callback fired when a Tree Item is selected or deselected.
     * @param {React.SyntheticEvent} event The DOM event that triggered the change. Can be null when the change is caused by the `publicAPI.setItemSelection()` method.
     * @param {array} itemId The itemId of the modified item.
     * @param {array} isSelected `true` if the item has just been selected, `false` if it has just been deselected.
     */
    onItemSelectionToggle: prop_types_1.default.func,
    /**
     * Callback fired when Tree Items are selected/deselected.
     * @param {React.SyntheticEvent} event The DOM event that triggered the change. Can be null when the change is caused by the `publicAPI.setItemSelection()` method.
     * @param {string[] | string} itemIds The ids of the selected items.
     * When `multiSelect` is `true`, this is an array of strings; when false (default) a string.
     */
    onSelectedItemsChange: prop_types_1.default.func,
    /**
     * Selected item ids. (Controlled)
     * When `multiSelect` is true this takes an array of strings; when false (default) a string.
     */
    selectedItems: prop_types_1.default.any,
    /**
     * When `selectionPropagation.descendants` is set to `true`.
     *
     * - Selecting a parent selects all its descendants automatically.
     * - Deselecting a parent deselects all its descendants automatically.
     *
     * When `selectionPropagation.parents` is set to `true`.
     *
     * - Selecting all the descendants of a parent selects the parent automatically.
     * - Deselecting a descendant of a selected parent deselects the parent automatically.
     *
     * Only works when `multiSelect` is `true`.
     * On the <SimpleTreeView />, only the expanded items are considered (since the collapsed item are not passed to the Tree View component at all)
     *
     * @default { parents: false, descendants: false }
     */
    selectionPropagation: prop_types_1.default.shape({
        descendants: prop_types_1.default.bool,
        parents: prop_types_1.default.bool,
    }),
    /**
     * The props used for each component slot.
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable component slots.
     */
    slots: prop_types_1.default.object,
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
