'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { useStore } from '@mui/x-internals/store';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import composeClasses from '@mui/utils/composeClasses';
import useSlotProps from '@mui/utils/useSlotProps';
import { warnOnce } from '@mui/x-internals/warning';
import { getRichTreeViewUtilityClass } from './richTreeViewClasses';
import { RichTreeViewProps } from './RichTreeView.types';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { TreeViewProvider } from '../internals/TreeViewProvider';
import { RichTreeViewItems } from '../internals/components/RichTreeViewItems';
import { lazyLoadingSelectors } from '../internals/plugins/lazyLoading';
import { TreeViewValidItem } from '../models';
import { useTreeViewRootProps } from '../internals/hooks/useTreeViewRootProps';
import { TreeViewItemDepthContext } from '../internals/TreeViewItemDepthContext';
import { useExtractRichTreeViewParameters } from './useExtractRichTreeViewParameters';
import { itemsSelectors } from '../internals/plugins/items';
import { useTreeViewStore } from '../internals/hooks/useTreeViewStore';
import { RichTreeViewStore } from '../internals/RichTreeViewStore';

const useThemeProps = createUseThemeProps('MuiRichTreeView');

const useUtilityClasses = <R extends {}, Multiple extends boolean | undefined>(
  ownerState: RichTreeViewProps<R, Multiple>,
) => {
  const { classes } = ownerState;

  return React.useMemo(() => {
    const slots = {
      root: ['root'],
      item: ['item'],
      itemContent: ['itemContent'],
      itemGroupTransition: ['itemGroupTransition'],
      itemIconContainer: ['itemIconContainer'],
      itemLabel: ['itemLabel'],
      itemLabelInput: ['itemLabelInput'],
      itemCheckbox: ['itemCheckbox'],
      // itemDragAndDropOverlay: ['itemDragAndDropOverlay'], => feature not available on this component
      // itemErrorIcon: ['itemErrorIcon'], => feature not available on this component
    };

    return composeClasses(slots, getRichTreeViewUtilityClass, classes);
  }, [classes]);
};

export const RichTreeViewRoot = styled('ul', {
  name: 'MuiRichTreeView',
  slot: 'Root',
})({
  padding: 0,
  margin: 0,
  listStyle: 'none',
  outline: 0,
  position: 'relative',
});

type RichTreeViewComponent = (<R extends {}, Multiple extends boolean | undefined = undefined>(
  props: RichTreeViewProps<R, Multiple> & React.RefAttributes<HTMLUListElement>,
) => React.JSX.Element) & { propTypes?: any };

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
const RichTreeView = React.forwardRef(function RichTreeView<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined = undefined,
>(inProps: RichTreeViewProps<R, Multiple>, forwardedRef: React.Ref<HTMLUListElement>) {
  const props = useThemeProps({ props: inProps, name: 'MuiRichTreeView' });
  if (process.env.NODE_ENV !== 'production') {
    if ((props as any).children != null) {
      warnOnce([
        'MUI X: The Rich Tree View component does not support JSX children.',
        'If you want to add items, you need to use the `items` prop.',
        'Check the documentation for more details: https://mui.com/x/react-tree-view/rich-tree-view/items/.',
      ]);
    }
  }

  const { slots, slotProps, apiRef, parameters, forwardedProps } =
    useExtractRichTreeViewParameters(props);
  const store = useTreeViewStore(RichTreeViewStore, parameters);

  const ref = React.useRef<HTMLUListElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, ref);
  const getRootProps = useTreeViewRootProps(store, forwardedProps, handleRef);
  const classes = useUtilityClasses(props);

  const isLoading = useStore(store, lazyLoadingSelectors.isItemLoading, null);
  const error = useStore(store, lazyLoadingSelectors.itemError, null);

  const Root = slots?.root ?? RichTreeViewRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    className: classes.root,
    getSlotProps: getRootProps,
    ownerState: props as RichTreeViewProps<any, any>,
  });

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <TreeViewProvider
      store={store}
      classes={classes}
      slots={slots}
      slotProps={slotProps}
      apiRef={apiRef}
      rootRef={ref}
    >
      <TreeViewItemDepthContext.Provider value={itemsSelectors.itemDepth}>
        <Root {...rootProps}>
          <RichTreeViewItems slots={slots} slotProps={slotProps} />
        </Root>
      </TreeViewItemDepthContext.Provider>
    </TreeViewProvider>
  );
}) as RichTreeViewComponent;

RichTreeView.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The ref object that allows Tree View manipulation. Can be instantiated with `useRichTreeViewApiRef()`.
   */
  apiRef: PropTypes.shape({
    current: PropTypes.shape({
      focusItem: PropTypes.func,
      getItem: PropTypes.func,
      getItemDOMElement: PropTypes.func,
      getItemOrderedChildrenIds: PropTypes.func,
      getItemTree: PropTypes.func,
      getParentId: PropTypes.func,
      isItemExpanded: PropTypes.func,
      setEditedItem: PropTypes.func,
      setIsItemDisabled: PropTypes.func,
      setItemExpansion: PropTypes.func,
      setItemSelection: PropTypes.func,
      updateItemLabel: PropTypes.func,
    }),
  }),
  /**
   * Whether the Tree View renders a checkbox at the left of its label that allows selecting it.
   * @default false
   */
  checkboxSelection: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Expanded item ids.
   * Used when the item's expansion is not controlled.
   * @default []
   */
  defaultExpandedItems: PropTypes.arrayOf(PropTypes.string),
  /**
   * Selected item ids. (Uncontrolled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   * @default []
   */
  defaultSelectedItems: PropTypes.any,
  /**
   * Whether the items should be focusable when disabled.
   * @default false
   */
  disabledItemsFocusable: PropTypes.bool,
  /**
   * Whether selection is disabled.
   * @default false
   */
  disableSelection: PropTypes.bool,
  /**
   * Expanded item ids.
   * Used when the item's expansion is controlled.
   */
  expandedItems: PropTypes.arrayOf(PropTypes.string),
  /**
   * The slot that triggers the item's expansion when clicked.
   * @default 'content'
   */
  expansionTrigger: PropTypes.oneOf(['content', 'iconContainer']),
  /**
   * Used to determine the children of a given item.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {R[]} The children of the item.
   * @default (item) => item.children
   */
  getItemChildren: PropTypes.func,
  /**
   * Used to determine the id of a given item.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {TreeViewItemId} The id of the item.
   * @default (item) => item.id
   */
  getItemId: PropTypes.func,
  /**
   * Used to determine the string label for a given item.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {string} The label of the item.
   * @default (item) => item.label
   */
  getItemLabel: PropTypes.func,
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: PropTypes.string,
  /**
   * Used to determine if a given item should be disabled.
   * @template R
   * @param {R} item The item to check.
   * @returns {boolean} `true` if the item should be disabled.
   */
  isItemDisabled: PropTypes.func,
  /**
   * Determine if a given item can be edited.
   * @template R
   * @param {R} item The item to check.
   * @returns {boolean} `true` if the item can be edited.
   * @default () => false
   */
  isItemEditable: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  /**
   * Used to determine if a given item should have selection disabled.
   * @template R
   * @param {R} item The item to check.
   * @returns {boolean} `true` if the item should have selection disabled.
   */
  isItemSelectionDisabled: PropTypes.func,
  /**
   * Horizontal indentation between an item and its children.
   * Examples: 24, "24px", "2rem", "2em".
   * @default 12px
   */
  itemChildrenIndentation: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  items: PropTypes.array.isRequired,
  /**
   * Whether multiple items can be selected.
   * @default false
   */
  multiSelect: PropTypes.bool,
  /**
   * Callback fired when Tree Items are expanded/collapsed.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change. Can be null when the change is caused by the `publicAPI.setItemExpansion()` method.
   * @param {TreeViewItemId[]} itemIds The ids of the expanded items.
   */
  onExpandedItemsChange: PropTypes.func,
  /**
   * Callback fired when the `content` slot of a given Tree Item is clicked.
   * @param {React.MouseEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the focused item.
   */
  onItemClick: PropTypes.func,
  /**
   * Callback fired when a Tree Item is expanded or collapsed.
   * @param {React.SyntheticEvent | null} event The DOM event that triggered the change. Can be null when the change is caused by the `publicAPI.setItemExpansion()` method.
   * @param {TreeViewItemId} itemId The itemId of the modified item.
   * @param {boolean} isExpanded `true` if the item has just been expanded, `false` if it has just been collapsed.
   */
  onItemExpansionToggle: PropTypes.func,
  /**
   * Callback fired when a given Tree Item is focused.
   * @param {React.SyntheticEvent | null} event The DOM event that triggered the change. **Warning**: This is a generic event not a focus event.
   * @param {TreeViewItemId} itemId The id of the focused item.
   */
  onItemFocus: PropTypes.func,
  /**
   * Callback fired when the label of an item changes.
   * @param {TreeViewItemId} itemId The id of the item that was edited.
   * @param {string} newLabel The new label of the items.
   */
  onItemLabelChange: PropTypes.func,
  /**
   * Callback fired when a Tree Item is selected or deselected.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change. Can be null when the change is caused by the `publicAPI.setItemSelection()` method.
   * @param {TreeViewItemId} itemId The itemId of the modified item.
   * @param {boolean} isSelected `true` if the item has just been selected, `false` if it has just been deselected.
   */
  onItemSelectionToggle: PropTypes.func,
  /**
   * Callback fired when Tree Items are selected/deselected.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change. Can be null when the change is caused by the `publicAPI.setItemSelection()` method.
   * @param {TreeViewItemId[] | TreeViewItemId} itemIds The ids of the selected items.
   * When `multiSelect` is `true`, this is an array of strings; when false (default) a string.
   */
  onSelectedItemsChange: PropTypes.func,
  /**
   * Selected item ids. (Controlled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   */
  selectedItems: PropTypes.any,
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
  selectionPropagation: PropTypes.shape({
    descendants: PropTypes.bool,
    parents: PropTypes.bool,
  }),
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { RichTreeView };
