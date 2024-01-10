import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { getTreeViewUtilityClass } from './treeViewClasses';
import { TreeViewProps } from './TreeView.types';
import { SimpleTreeView, SimpleTreeViewRoot } from '../SimpleTreeView';

const useUtilityClasses = <Multiple extends boolean | undefined>(
  ownerState: TreeViewProps<Multiple>,
) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getTreeViewUtilityClass, classes);
};

type TreeViewComponent = (<Multiple extends boolean | undefined = undefined>(
  props: TreeViewProps<Multiple> & React.RefAttributes<HTMLUListElement>,
) => React.JSX.Element) & { propTypes?: any };

const TreeViewRoot = styled(SimpleTreeViewRoot, {
  name: 'MuiTreeView',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({});

let warnedOnce = false;

const warn = () => {
  if (!warnedOnce) {
    console.warn(
      [
        'MUI X: The TreeView component was renamed SimpleTreeView.',
        'The component with the old naming will be removed in the version v8.0.0.',
        '',
        "You should use `import { SimpleTreeView } from '@mui/x-tree-view'`",
        "or `import { SimpleTreeView } from '@mui/x-tree-view/TreeView'`",
      ].join('\n'),
    );

    warnedOnce = true;
  }
};

/**
 * This component has been deprecated in favor of the new `SimpleTreeView` component.
 * You can have a look at how to migrate to the new component in the v7 [migration guide](https://next.mui.com/x/migration/migration-tree-view-v6/#use-simpletreeview-instead-of-treeview)
 *
 * Demos:
 *
 * - [Tree View](https://mui.com/x/react-tree-view/)
 *
 * API:
 *
 * - [TreeView API](https://mui.com/x/api/tree-view/tree-view/)
 *
 * @deprecated
 */
const TreeView = React.forwardRef(function TreeView<
  Multiple extends boolean | undefined = undefined,
>(inProps: TreeViewProps<Multiple>, ref: React.Ref<HTMLUListElement>) {
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    warn();
  }

  const props = useThemeProps({ props: inProps, name: 'MuiTreeView' });

  const classes = useUtilityClasses(props);

  return (
    <SimpleTreeView
      {...props}
      ref={ref}
      classes={classes}
      slots={{ root: TreeViewRoot, ...props.slots }}
    />
  );
}) as TreeViewComponent;

TreeView.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
   */
  children: PropTypes.node,
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
  defaultExpandedNodes: PropTypes.arrayOf(PropTypes.string),
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
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
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

export { TreeView };
