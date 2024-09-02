import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { useLicenseVerifier, Watermark } from '@mui/x-license';
import useSlotProps from '@mui/utils/useSlotProps';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { useTreeView, TreeViewProvider, warnOnce } from '@mui/x-tree-view/internals';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { getRichTreeViewProUtilityClass } from './richTreeViewProClasses';
import { RichTreeViewProProps } from './RichTreeViewPro.types';
import {
  RICH_TREE_VIEW_PRO_PLUGINS,
  RichTreeViewProPluginSignatures,
} from './RichTreeViewPro.plugins';
import { getReleaseInfo } from '../internals/utils/releaseInfo';

const useThemeProps = createUseThemeProps('MuiRichTreeViewPro');

const useUtilityClasses = <R extends {}, Multiple extends boolean | undefined>(
  ownerState: RichTreeViewProProps<R, Multiple>,
) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getRichTreeViewProUtilityClass, classes);
};

export const RichTreeViewProRoot = styled('ul', {
  name: 'MuiRichTreeViewPro',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: RichTreeViewProProps<any, any> }>({
  padding: 0,
  margin: 0,
  listStyle: 'none',
  outline: 0,
  position: 'relative',
});

type RichTreeViewProComponent = (<R extends {}, Multiple extends boolean | undefined = undefined>(
  props: RichTreeViewProProps<R, Multiple> & React.RefAttributes<HTMLUListElement>,
) => React.JSX.Element) & { propTypes?: any };

function WrappedTreeItem<R extends {}>({
  slots,
  slotProps,
  label,
  id,
  itemId,
  children,
}: Pick<RichTreeViewProProps<R, any>, 'slots' | 'slotProps'> &
  Pick<TreeItemProps, 'id' | 'itemId' | 'children'> & { label: string }) {
  const Item = slots?.item ?? TreeItem;
  const itemProps = useSlotProps({
    elementType: Item,
    externalSlotProps: slotProps?.item,
    additionalProps: { itemId, id, label },
    ownerState: { itemId, label },
  });

  return <Item {...itemProps}>{children}</Item>;
}

WrappedTreeItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * The id of the item.
   */
  itemId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
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
} as any;

const releaseInfo = getReleaseInfo();

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
const RichTreeViewPro = React.forwardRef(function RichTreeViewPro<
  R extends {},
  Multiple extends boolean | undefined = undefined,
>(inProps: RichTreeViewProProps<R, Multiple>, ref: React.Ref<HTMLUListElement>) {
  const props = useThemeProps({ props: inProps, name: 'MuiRichTreeViewPro' });

  useLicenseVerifier('x-tree-view-pro', releaseInfo);

  if (process.env.NODE_ENV !== 'production') {
    if ((props as any).children != null) {
      warnOnce([
        'MUI X: The `RichTreeViewPro` component does not support JSX children.',
        'If you want to add items, you need to use the `items` prop.',
        'Check the documentation for more details: https://mui.com/x/react-tree-view/rich-tree-view/items/.',
      ]);
    }
  }

  const { getRootProps, contextValue, instance } = useTreeView<
    RichTreeViewProPluginSignatures,
    typeof props
  >({
    plugins: RICH_TREE_VIEW_PRO_PLUGINS,
    rootRef: ref,
    props,
  });

  const { slots, slotProps } = props;
  const classes = useUtilityClasses(props);

  const Root = slots?.root ?? RichTreeViewProRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    className: classes.root,
    getSlotProps: getRootProps,
    ownerState: props as RichTreeViewProProps<any, any>,
  });

  const itemsToRender = instance.getItemsToRender();

  const renderItem = ({
    label,
    itemId,
    id,
    children,
  }: ReturnType<typeof instance.getItemsToRender>[number]) => {
    return (
      <WrappedTreeItem
        slots={slots}
        slotProps={slotProps}
        key={itemId}
        label={label}
        id={id}
        itemId={itemId}
      >
        {children?.map(renderItem)}
      </WrappedTreeItem>
    );
  };

  return (
    <TreeViewProvider value={contextValue}>
      <Root {...rootProps}>
        {itemsToRender.map(renderItem)}
        <Watermark packageName="x-tree-view-pro" releaseInfo={releaseInfo} />
      </Root>
    </TreeViewProvider>
  );
}) as RichTreeViewProComponent;

RichTreeViewPro.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The ref object that allows Tree View manipulation. Can be instantiated with `useTreeViewApiRef()`.
   */
  apiRef: PropTypes.shape({
    current: PropTypes.shape({
      focusItem: PropTypes.func.isRequired,
      getItem: PropTypes.func.isRequired,
      getItemDOMElement: PropTypes.func.isRequired,
      getItemOrderedChildrenIds: PropTypes.func.isRequired,
      getItemTree: PropTypes.func.isRequired,
      selectItem: PropTypes.func.isRequired,
      setItemExpansion: PropTypes.func.isRequired,
      updateItemLabel: PropTypes.func.isRequired,
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
  canMoveItemToNewPosition: PropTypes.func,
  /**
   * If `true`, the tree view renders a checkbox at the left of its label that allows selecting it.
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
   * If `true`, will allow focus on disabled items.
   * @default false
   */
  disabledItemsFocusable: PropTypes.bool,
  /**
   * If `true` selection is disabled.
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
   * Unstable features, breaking changes might be introduced.
   * For each feature, if the flag is not explicitly set to `true`,
   * the feature will be fully disabled and any property / method call will not have any effect.
   */
  experimentalFeatures: PropTypes.shape({
    indentationAtItemLevel: PropTypes.bool,
    itemsReordering: PropTypes.bool,
    labelEditing: PropTypes.bool,
  }),
  /**
   * Used to determine the id of a given item.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {string} The id of the item.
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
   * Determines if a given item is editable or not.
   * Make sure to also enable the `labelEditing` experimental feature:
   * `<RichTreeViewPro experimentalFeatures={{ labelEditing: true }}  />`.
   * By default, the items are not editable.
   * @template R
   * @param {R} item The item to check.
   * @returns {boolean} `true` if the item is editable.
   */
  isItemEditable: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  /**
   * Used to determine if a given item can be reordered.
   * @param {string} itemId The id of the item to check.
   * @returns {boolean} `true` if the item can be reordered.
   * @default () => true
   */
  isItemReorderable: PropTypes.func,
  /**
   * Horizontal indentation between an item and its children.
   * Examples: 24, "24px", "2rem", "2em".
   * @default 12px
   */
  itemChildrenIndentation: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  items: PropTypes.array.isRequired,
  /**
   * If `true`, the reordering of items is enabled.
   * Make sure to also enable the `itemsReordering` experimental feature:
   * `<RichTreeViewPro experimentalFeatures={{ itemsReordering: true }} itemsReordering />`.
   * @default false
   */
  itemsReordering: PropTypes.bool,
  /**
   * If `true`, `ctrl` and `shift` will trigger multiselect.
   * @default false
   */
  multiSelect: PropTypes.bool,
  /**
   * Callback fired when tree items are expanded/collapsed.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {array} itemIds The ids of the expanded items.
   */
  onExpandedItemsChange: PropTypes.func,
  /**
   * Callback fired when the `content` slot of a given tree item is clicked.
   * @param {React.MouseEvent} event The DOM event that triggered the change.
   * @param {string} itemId The id of the focused item.
   */
  onItemClick: PropTypes.func,
  /**
   * Callback fired when a tree item is expanded or collapsed.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {array} itemId The itemId of the modified item.
   * @param {array} isExpanded `true` if the item has just been expanded, `false` if it has just been collapsed.
   */
  onItemExpansionToggle: PropTypes.func,
  /**
   * Callback fired when a given tree item is focused.
   * @param {React.SyntheticEvent | null} event The DOM event that triggered the change. **Warning**: This is a generic event not a focus event.
   * @param {string} itemId The id of the focused item.
   */
  onItemFocus: PropTypes.func,
  /**
   * Callback fired when the label of an item changes.
   * @param {TreeViewItemId} itemId The id of the item that was edited.
   * @param {string} newLabel The new label of the items.
   */
  onItemLabelChange: PropTypes.func,
  /**
   * Callback fired when a tree item is moved in the tree.
   * @param {object} params The params describing the item re-ordering.
   * @param {string} params.itemId The id of the item moved.
   * @param {TreeViewItemReorderPosition} params.oldPosition The old position of the item.
   * @param {TreeViewItemReorderPosition} params.newPosition The new position of the item.
   */
  onItemPositionChange: PropTypes.func,
  /**
   * Callback fired when a tree item is selected or deselected.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {array} itemId The itemId of the modified item.
   * @param {array} isSelected `true` if the item has just been selected, `false` if it has just been deselected.
   */
  onItemSelectionToggle: PropTypes.func,
  /**
   * Callback fired when tree items are selected/deselected.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {string[] | string} itemIds The ids of the selected items.
   * When `multiSelect` is `true`, this is an array of strings; when false (default) a string.
   */
  onSelectedItemsChange: PropTypes.func,
  /**
   * Selected item ids. (Controlled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   */
  selectedItems: PropTypes.any,
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

export { RichTreeViewPro };
