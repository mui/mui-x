import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { useSlotProps } from '@mui/base/utils';
import { getRichTreeViewUtilityClass } from './richTreeViewClasses';
import { RichTreeViewProps } from './RichTreeView.types';
import { useTreeView } from '../internals/useTreeView';
import { TreeViewProvider } from '../internals/TreeViewProvider';
import { DEFAULT_TREE_VIEW_PLUGINS } from '../internals/plugins';
import { TreeItem } from '../TreeItem';
import { TreeViewBaseItem } from '../models';

const useUtilityClasses = <R extends {}, Multiple extends boolean | undefined>(
  ownerState: RichTreeViewProps<R, Multiple>,
) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getRichTreeViewUtilityClass, classes);
};

const RichTreeViewRoot = styled('ul', {
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
  item,
  children,
}: Pick<RichTreeViewProps<R, any>, 'slots' | 'slotProps'> & {
  item: TreeViewBaseItem<R>;
  children: React.ReactNode;
}) {
  const Item = slots?.item ?? TreeItem;
  const itemProps = useSlotProps({
    elementType: Item,
    externalSlotProps: slotProps?.item,
    additionalProps: {
      nodeId: item.nodeId,
      id: item.id,
      label: item.label,
    },
    ownerState: { item },
  });

  return <Item {...itemProps}>{children}</Item>;
}

/**
 *
 * Demos:
 *
 * - [Tree View](https://mui.com/x/react-tree-view/)
 *
 * API:
 *
 * - [TreeView API](https://mui.com/x/api/tree-view/tree-view/)
 */
const RichTreeView = React.forwardRef(function RichTreeView<
  R extends {},
  Multiple extends boolean | undefined = undefined,
>(inProps: RichTreeViewProps<R, Multiple>, ref: React.Ref<HTMLUListElement>) {
  const themeProps = useThemeProps({ props: inProps, name: 'MuiRichTreeView' });

  const {
    // Headless implementation
    disabledItemsFocusable,
    expanded,
    defaultExpanded,
    onNodeToggle,
    onNodeFocus,
    disableSelection,
    defaultSelected,
    selected,
    multiSelect,
    onNodeSelect,
    id,
    defaultCollapseIcon,
    defaultEndIcon,
    defaultExpandIcon,
    defaultParentIcon,
    items,
    isItemDisabled,
    // Component implementation
    slots,
    slotProps,
    ...other
  } = themeProps as RichTreeViewProps<any, any>;

  const { getRootProps, contextValue } = useTreeView({
    disabledItemsFocusable,
    expanded,
    defaultExpanded,
    onNodeToggle,
    onNodeFocus,
    disableSelection,
    defaultSelected,
    selected,
    multiSelect,
    onNodeSelect,
    id,
    defaultCollapseIcon,
    defaultEndIcon,
    defaultExpandIcon,
    defaultParentIcon,
    items,
    isItemDisabled,
    plugins: DEFAULT_TREE_VIEW_PLUGINS,
    rootRef: ref,
  });

  const classes = useUtilityClasses(themeProps);

  const Root = slots?.root ?? RichTreeViewRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    className: classes.root,
    getSlotProps: getRootProps,
    ownerState: themeProps as RichTreeViewProps<any, any>,
  });

  const renderItem = (item: TreeViewBaseItem<R>) => {
    return (
      <WrappedTreeItem item={item} slots={slots} slotProps={slotProps} key={item.nodeId}>
        {item.children?.map(renderItem)}
      </WrappedTreeItem>
    );
  };

  return (
    <TreeViewProvider value={contextValue}>
      <Root {...rootProps}>{items.map(renderItem)}</Root>
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
  /**
   * className applied to the root element.
   */
  className: PropTypes.string,
  /**
   * The default icon used to collapse the node.
   */
  defaultCollapseIcon: PropTypes.node,
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
  defaultExpanded: PropTypes.arrayOf(PropTypes.string),
  /**
   * The default icon used to expand the node.
   */
  defaultExpandIcon: PropTypes.node,
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
  defaultSelected: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
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
  expanded: PropTypes.arrayOf(PropTypes.string),
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: PropTypes.string,
  isItemDisabled: PropTypes.func,
  items: PropTypes.array.isRequired,
  /**
   * If true `ctrl` and `shift` will trigger multiselect.
   * @default false
   */
  multiSelect: PropTypes.bool,
  /**
   * Callback fired when tree items are focused.
   * @param {React.SyntheticEvent} event The event source of the callback **Warning**: This is a generic event not a focus event.
   * @param {string} nodeId The id of the node focused.
   * @param {string} value of the focused node.
   */
  onNodeFocus: PropTypes.func,
  /**
   * Callback fired when tree items are selected/unselected.
   * @param {React.SyntheticEvent} event The event source of the callback
   * @param {string[] | string} nodeIds Ids of the selected nodes. When `multiSelect` is true
   * this is an array of strings; when false (default) a string.
   */
  onNodeSelect: PropTypes.func,
  /**
   * Callback fired when tree items are expanded/collapsed.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} nodeIds The ids of the expanded nodes.
   */
  onNodeToggle: PropTypes.func,
  /**
   * Selected node ids. (Controlled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   */
  selected: PropTypes.any,
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
