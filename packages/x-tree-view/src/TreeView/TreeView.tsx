import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import useId from '@mui/utils/useId';
import { TreeViewContext } from './TreeViewContext';
import { DescendantProvider } from './descendants';
import { getTreeViewUtilityClass } from './treeViewClasses';
import { TreeViewDefaultizedProps, TreeViewProps } from './TreeView.types';
import { useTreeView } from '../useTreeView';

const useUtilityClasses = (ownerState: TreeViewDefaultizedProps) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getTreeViewUtilityClass, classes);
};

const TreeViewRoot = styled('ul', {
  name: 'MuiTreeView',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: TreeViewDefaultizedProps }>({
  padding: 0,
  margin: 0,
  listStyle: 'none',
  outline: 0,
});

function noopSelection() {
  return false;
}

const defaultDefaultExpanded: string[] = [];
const defaultDefaultSelected: string[] = [];

/**
 *
 * Demos:
 *
 * - [Tree View](https://mui.com/material-ui/react-tree-view/)
 *
 * API:
 *
 * - [TreeView API](https://mui.com/material-ui/api/tree-view/)
 */
const TreeView = React.forwardRef(function TreeView(
  inProps: TreeViewProps,
  ref: React.Ref<HTMLUListElement>,
) {
  const themeProps = useThemeProps({ props: inProps, name: 'MuiTreeView' });
  const props: TreeViewDefaultizedProps = {
    ...themeProps,
    disabledItemsFocusable: themeProps.disabledItemsFocusable ?? false,
    disableSelection: themeProps.disableSelection ?? false,
    multiSelect: themeProps.multiSelect ?? false,
    defaultExpanded: themeProps.defaultExpanded ?? defaultDefaultExpanded,
    defaultSelected: themeProps.defaultSelected ?? defaultDefaultSelected,
  };

  const { instance, state, rootProps } = useTreeView(props, ref);

  const {
    children,
    className,
    defaultCollapseIcon,
    defaultEndIcon,
    defaultExpanded,
    defaultExpandIcon,
    defaultParentIcon,
    defaultSelected,
    disabledItemsFocusable,
    disableSelection,
    expanded: expandedProp,
    id: idProp,
    multiSelect,
    onBlur,
    onFocus,
    onKeyDown,
    onNodeFocus,
    onNodeSelect,
    onNodeToggle,
    selected: selectedProp,
    ...other
  } = props;

  const classes = useUtilityClasses(props);
  const treeId = useId(idProp);

  const activeDescendant = instance.nodeMap[state.focusedNodeId!]
    ? instance.nodeMap[state.focusedNodeId!].idAttribute
    : null;

  return (
    <TreeViewContext.Provider
      // TODO: fix this lint error
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        icons: { defaultCollapseIcon, defaultExpandIcon, defaultParentIcon, defaultEndIcon },
        focus: instance.focusNode,
        toggleExpansion: instance.toggleNodeExpansion,
        isExpanded: instance.isNodeExpanded,
        isExpandable: instance.isNodeExpandable,
        isFocused: instance.isNodeFocused,
        isSelected: instance.isNodeSelected,
        isDisabled: instance.isNodeDisabled,
        selectNode: disableSelection ? noopSelection : instance.selectNode,
        selectRange: disableSelection ? noopSelection : instance.selectRange,
        multiSelect,
        disabledItemsFocusable,
        mapFirstChar: instance.mapFirstChar,
        unMapFirstChar: instance.unMapFirstChar,
        registerNode: instance.registerNode,
        unregisterNode: instance.unregisterNode,
        treeId,
      }}
    >
      <DescendantProvider>
        <TreeViewRoot
          role="tree"
          id={treeId}
          aria-activedescendant={activeDescendant ?? undefined}
          aria-multiselectable={multiSelect}
          className={clsx(classes.root, className)}
          tabIndex={0}
          ownerState={props}
          {...other}
          {...rootProps}
        >
          {children}
        </TreeViewRoot>
      </DescendantProvider>
    </TreeViewContext.Provider>
  );
});

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
   * Used when the item's expansion are not controlled.
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
  defaultSelected: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
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
   * Used when the item's expansion are controlled.
   */
  expanded: PropTypes.arrayOf(PropTypes.string),
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
  selected: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
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
