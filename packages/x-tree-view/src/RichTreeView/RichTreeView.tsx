import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { useSlotProps } from '@mui/base/utils';
import { getRichTreeViewUtilityClass } from './richTreeViewClasses';
import { RichTreeViewProps, RichTreeViewSlotProps, RichTreeViewSlots } from './RichTreeView.types';
import { useTreeView } from '../internals/useTreeView';
import { TreeViewProvider } from '../internals/TreeViewProvider';
import { DEFAULT_TREE_VIEW_PLUGINS } from '../internals/plugins';
import { TreeItem, TreeItemProps } from '../TreeItem';
import { buildWarning } from '../internals/utils/warning';
import { extractPluginParamsFromProps } from '../internals/utils/extractPluginParamsFromProps';

const useUtilityClasses = <R extends {}, Multiple extends boolean | undefined>(
  ownerState: RichTreeViewProps<R, Multiple>,
) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getRichTreeViewUtilityClass, classes);
};

export const RichTreeViewRoot = styled('ul', {
  name: 'MuiRichTreeView',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: RichTreeViewProps<any, any> }>({
  padding: 0,
  margin: 0,
  listStyle: 'none',
  outline: 0,
});

type TreeViewComponent = (<R extends {}, Multiple extends boolean | undefined = undefined>(
  props: RichTreeViewProps<R, Multiple> & React.RefAttributes<HTMLUListElement>,
) => React.JSX.Element) & { propTypes?: any };

function WrappedTreeItem<R extends {}>({
  slots,
  slotProps,
  label,
  id,
  nodeId,
  children,
}: Pick<RichTreeViewProps<R, any>, 'slots' | 'slotProps'> &
  Pick<TreeItemProps, 'id' | 'nodeId' | 'children'> & { label: string }) {
  const Item = slots?.item ?? TreeItem;
  const itemProps = useSlotProps({
    elementType: Item,
    externalSlotProps: slotProps?.item,
    additionalProps: { nodeId, id, label },
    ownerState: { nodeId, label },
  });

  return <Item {...itemProps}>{children}</Item>;
}

const childrenWarning = buildWarning([
  'MUI X: The `RichTreeView` component does not support JSX children.',
  'If you want to add items, you need to use the `items` prop',
  'Check the documentation for more details: https://next.mui.com/x/react-tree-view/rich-tree-view/items/',
]);

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
  R extends {},
  Multiple extends boolean | undefined = undefined,
>(inProps: RichTreeViewProps<R, Multiple>, ref: React.Ref<HTMLUListElement>) {
  const props = useThemeProps({ props: inProps, name: 'MuiRichTreeView' });

  if (process.env.NODE_ENV !== 'production') {
    if ((props as any).children != null) {
      childrenWarning();
    }
  }

  const { pluginParams, slots, slotProps, otherProps } = extractPluginParamsFromProps<
    typeof DEFAULT_TREE_VIEW_PLUGINS,
    RichTreeViewSlots,
    RichTreeViewSlotProps<R, Multiple>,
    RichTreeViewProps<R, Multiple>
  >({
    props,
    plugins: DEFAULT_TREE_VIEW_PLUGINS,
    rootRef: ref,
  });

  const { getRootProps, contextValue, instance } = useTreeView(pluginParams);

  const classes = useUtilityClasses(props);

  const Root = slots?.root ?? RichTreeViewRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: otherProps,
    className: classes.root,
    getSlotProps: getRootProps,
    ownerState: props as RichTreeViewProps<any, any>,
  });

  const nodesToRender = instance.getNodesToRender();

  const renderNode = ({
    label,
    nodeId,
    id,
    children,
  }: ReturnType<typeof instance.getNodesToRender>[number]) => {
    return (
      <WrappedTreeItem
        slots={slots}
        slotProps={slotProps}
        key={nodeId}
        label={label}
        id={id}
        nodeId={nodeId}
      >
        {children?.map(renderNode)}
      </WrappedTreeItem>
    );
  };

  return (
    <TreeViewProvider value={contextValue}>
      <Root {...rootProps}>{nodesToRender.map(renderNode)}</Root>
    </TreeViewProvider>
  );
}) as TreeViewComponent;

RichTreeView.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * The default icon displayed next to a end node. This is applied to all
   * tree nodes and can be overridden by the TreeItem `icon` prop.
   */
  defaultEndIcon: PropTypes.node,
  /**
   * Expanded node ids.
   * Used when the item's expansion is not controlled.
   * @default []
   */
  defaultExpandedNodes: PropTypes.arrayOf(PropTypes.string),
  /**
   * The default icon displayed next to a parent node. This is applied to all
   * parent nodes and can be overridden by the TreeItem `icon` prop.
   */
  defaultParentIcon: PropTypes.node,
  /**
   * Selected node ids. (Uncontrolled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   * @default []
   */
  defaultSelectedNodes: PropTypes.any,
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
   * Expanded node ids.
   * Used when the item's expansion is controlled.
   */
  expandedNodes: PropTypes.arrayOf(PropTypes.string),
  /**
   * Used to determine the string label for a given item.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {string} The id of the item.
   * @default `(item) => item.id`
   */
  getItemId: PropTypes.func,
  /**
   * Used to determine the string label for a given item.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {string} The label of the item.
   * @default `(item) => item.label`
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
  items: PropTypes.array.isRequired,
  /**
   * If true `ctrl` and `shift` will trigger multiselect.
   * @default false
   */
  multiSelect: PropTypes.bool,
  /**
   * Callback fired when tree items are expanded/collapsed.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} nodeIds The ids of the expanded nodes.
   */
  onExpandedNodesChange: PropTypes.func,
  /**
   * Callback fired when a tree item is expanded or collapsed.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} nodeId The nodeId of the modified node.
   * @param {array} isExpanded `true` if the node has just been expanded, `false` if it has just been collapsed.
   */
  onNodeExpansionToggle: PropTypes.func,
  /**
   * Callback fired when tree items are focused.
   * @param {React.SyntheticEvent} event The event source of the callback **Warning**: This is a generic event not a focus event.
   * @param {string} nodeId The id of the node focused.
   * @param {string} value of the focused node.
   */
  onNodeFocus: PropTypes.func,
  /**
   * Callback fired when a tree item is selected or deselected.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} nodeId The nodeId of the modified node.
   * @param {array} isSelected `true` if the node has just been selected, `false` if it has just been deselected.
   */
  onNodeSelectionToggle: PropTypes.func,
  /**
   * Callback fired when tree items are selected/deselected.
   * @param {React.SyntheticEvent} event The event source of the callback
   * @param {string[] | string} nodeIds The ids of the selected nodes.
   * When `multiSelect` is `true`, this is an array of strings; when false (default) a string.
   */
  onSelectedNodesChange: PropTypes.func,
  /**
   * Selected node ids. (Controlled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   */
  selectedNodes: PropTypes.any,
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
