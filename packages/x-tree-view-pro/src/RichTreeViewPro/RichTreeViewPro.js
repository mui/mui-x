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
exports.RichTreeViewPro = exports.RichTreeViewProRoot = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var x_license_1 = require("@mui/x-license");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var internals_1 = require("@mui/x-tree-view/internals");
var warning_1 = require("@mui/x-internals/warning");
var zero_styled_1 = require("../internals/zero-styled");
var richTreeViewProClasses_1 = require("./richTreeViewProClasses");
var RichTreeViewPro_plugins_1 = require("./RichTreeViewPro.plugins");
var useThemeProps = (0, zero_styled_1.createUseThemeProps)('MuiRichTreeViewPro');
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
            itemLabelInput: ['itemLabelInput'],
            itemCheckbox: ['itemCheckbox'],
            itemDragAndDropOverlay: ['itemDragAndDropOverlay'],
            itemErrorIcon: ['itemErrorIcon'],
        };
        return (0, composeClasses_1.default)(slots, richTreeViewProClasses_1.getRichTreeViewProUtilityClass, classes);
    }, [classes]);
};
exports.RichTreeViewProRoot = (0, zero_styled_1.styled)('ul', {
    name: 'MuiRichTreeViewPro',
    slot: 'Root',
})({
    padding: 0,
    margin: 0,
    listStyle: 'none',
    outline: 0,
    position: 'relative',
});
var releaseInfo = '__RELEASE_INFO__';
/**
 *
 * Demos:
 *
 * - [Tree View](https://mui.com/x/react-tree-view/)
 *
 * API:
 *
 * - [RichTreeView API](https://mui.com/x/api/tree-view/rich-tree-view/)
 */
var RichTreeViewPro = React.forwardRef(function RichTreeViewPro(inProps, ref) {
    var _a;
    var props = useThemeProps({ props: inProps, name: 'MuiRichTreeViewPro' });
    var slots = props.slots, slotProps = props.slotProps, other = __rest(props, ["slots", "slotProps"]);
    (0, x_license_1.useLicenseVerifier)('x-tree-view-pro', releaseInfo);
    if (process.env.NODE_ENV !== 'production') {
        if (props.children != null) {
            (0, warning_1.warnOnce)([
                'MUI X: The `<RichTreeViewPro />` component does not support JSX children.',
                'If you want to add items, you need to use the `items` prop.',
                'Check the documentation for more details: https://mui.com/x/react-tree-view/rich-tree-view/items/.',
            ]);
        }
    }
    var _b = (0, internals_1.useTreeView)({
        plugins: RichTreeViewPro_plugins_1.RICH_TREE_VIEW_PRO_PLUGINS,
        rootRef: ref,
        props: other,
    }), getRootProps = _b.getRootProps, contextValue = _b.contextValue;
    var classes = useUtilityClasses(props);
    var Root = (_a = slots === null || slots === void 0 ? void 0 : slots.root) !== null && _a !== void 0 ? _a : exports.RichTreeViewProRoot;
    var rootProps = (0, useSlotProps_1.default)({
        elementType: Root,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.root,
        className: classes.root,
        getSlotProps: getRootProps,
        ownerState: props,
    });
    return (<internals_1.TreeViewProvider contextValue={contextValue} classes={classes} slots={slots} slotProps={slotProps}>
      <Root {...rootProps}>
        <internals_1.RichTreeViewItems slots={slots} slotProps={slotProps}/>
        <x_license_1.Watermark packageName="x-tree-view-pro" releaseInfo={releaseInfo}/>
      </Root>
    </internals_1.TreeViewProvider>);
});
exports.RichTreeViewPro = RichTreeViewPro;
RichTreeViewPro.propTypes = {
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
            setEditedItem: prop_types_1.default.func.isRequired,
            setIsItemDisabled: prop_types_1.default.func.isRequired,
            setItemExpansion: prop_types_1.default.func.isRequired,
            setItemSelection: prop_types_1.default.func.isRequired,
            updateItemLabel: prop_types_1.default.func.isRequired,
        }),
    }),
    /**
     * Used to determine if a given item can move to some new position.
     * @param {object} params The params describing the item re-ordering.
     * @param {string} params.itemId The id of the item that is being moved to a new position.
     * @param {TreeViewItemReorderPosition} params.oldPosition The old position of the item.
     * @param {TreeViewItemReorderPosition} params.newPosition The new position of the item.
     * @returns {boolean} `true` if the item can move to the new position.
     */
    canMoveItemToNewPosition: prop_types_1.default.func,
    /**
     * If `true`, the Tree View renders a checkbox at the left of its label that allows selecting it.
     * @default false
     */
    checkboxSelection: prop_types_1.default.bool,
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    /**
     * The data source object.
     */
    dataSource: prop_types_1.default.shape({
        getChildrenCount: prop_types_1.default.func.isRequired,
        getTreeItems: prop_types_1.default.func.isRequired,
    }),
    /**
     * The data source cache object.
     */
    dataSourceCache: prop_types_1.default.shape({
        clear: prop_types_1.default.func.isRequired,
        get: prop_types_1.default.func.isRequired,
        set: prop_types_1.default.func.isRequired,
    }),
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
     * Used to determine the children of a given item.
     *
     * @template R
     * @param {R} item The item to check.
     * @returns {R[]} The children of the item.
     * @default (item) => item.children
     */
    getItemChildren: prop_types_1.default.func,
    /**
     * Used to determine the id of a given item.
     *
     * @template R
     * @param {R} item The item to check.
     * @returns {string} The id of the item.
     * @default (item) => item.id
     */
    getItemId: prop_types_1.default.func,
    /**
     * Used to determine the string label for a given item.
     *
     * @template R
     * @param {R} item The item to check.
     * @returns {string} The label of the item.
     * @default (item) => item.label
     */
    getItemLabel: prop_types_1.default.func,
    /**
     * This prop is used to help implement the accessibility logic.
     * If you don't provide this prop. It falls back to a randomly generated id.
     */
    id: prop_types_1.default.string,
    /**
     * Used to determine if a given item should be disabled.
     * @template R
     * @param {R} item The item to check.
     * @returns {boolean} `true` if the item should be disabled.
     */
    isItemDisabled: prop_types_1.default.func,
    /**
     * Determine if a given item can be edited.
     * @template R
     * @param {R} item The item to check.
     * @returns {boolean} `true` if the item can be edited.
     * @default () => false
     */
    isItemEditable: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.bool]),
    /**
     * Determine if a given item can be reordered.
     * @param {string} itemId The id of the item to check.
     * @returns {boolean} `true` if the item can be reordered.
     * @default () => true
     */
    isItemReorderable: prop_types_1.default.func,
    /**
     * Horizontal indentation between an item and its children.
     * Examples: 24, "24px", "2rem", "2em".
     * @default 12px
     */
    itemChildrenIndentation: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
    items: prop_types_1.default.array.isRequired,
    /**
     * If `true`, the reordering of items is enabled.
     * @default false
     */
    itemsReordering: prop_types_1.default.bool,
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
     * Callback fired when the label of an item changes.
     * @param {TreeViewItemId} itemId The id of the item that was edited.
     * @param {string} newLabel The new label of the items.
     */
    onItemLabelChange: prop_types_1.default.func,
    /**
     * Callback fired when a Tree Item is moved in the tree.
     * @param {object} params The params describing the item re-ordering.
     * @param {string} params.itemId The id of the item moved.
     * @param {TreeViewItemReorderPosition} params.oldPosition The old position of the item.
     * @param {TreeViewItemReorderPosition} params.newPosition The new position of the item.
     */
    onItemPositionChange: prop_types_1.default.func,
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
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable component slots.
     * @default {}
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
