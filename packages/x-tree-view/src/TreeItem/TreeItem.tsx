import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Collapse from '@mui/material/Collapse';
import { alpha, styled, useThemeProps } from '@mui/material/styles';
import unsupportedProp from '@mui/utils/unsupportedProp';
import elementTypeAcceptingRef from '@mui/utils/elementTypeAcceptingRef';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import { TreeItemContent } from './TreeItemContent';
import { treeItemClasses, getTreeItemUtilityClass } from './treeItemClasses';
import { TreeItemOwnerState, TreeItemProps } from './TreeItem.types';
import { useTreeViewContext } from '../internals/TreeViewProvider/useTreeViewContext';
import { DefaultTreeViewPlugins } from '../internals/plugins';

const useUtilityClasses = (ownerState: TreeItemOwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
    content: ['content'],
    expanded: ['expanded'],
    selected: ['selected'],
    focused: ['focused'],
    disabled: ['disabled'],
    iconContainer: ['iconContainer'],
    label: ['label'],
    group: ['group'],
  };

  return composeClasses(slots, getTreeItemUtilityClass, classes);
};

const TreeItemRoot = styled('li', {
  name: 'MuiTreeItem',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: TreeItemOwnerState }>({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  outline: 0,
});

const StyledTreeItemContent = styled(TreeItemContent, {
  name: 'MuiTreeItem',
  slot: 'Content',
  overridesResolver: (props, styles) => {
    return [
      styles.content,
      styles.iconContainer && {
        [`& .${treeItemClasses.iconContainer}`]: styles.iconContainer,
      },
      styles.label && {
        [`& .${treeItemClasses.label}`]: styles.label,
      },
    ];
  },
})<{ ownerState: TreeItemOwnerState }>(({ theme }) => ({
  padding: '0 8px',
  width: '100%',
  boxSizing: 'border-box', // prevent width + padding to overflow
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      backgroundColor: 'transparent',
    },
  },
  [`&.${treeItemClasses.disabled}`]: {
    opacity: (theme.vars || theme).palette.action.disabledOpacity,
    backgroundColor: 'transparent',
  },
  [`&.${treeItemClasses.focused}`]: {
    backgroundColor: (theme.vars || theme).palette.action.focus,
  },
  [`&.${treeItemClasses.selected}`]: {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.selectedOpacity})`
      : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    '&:hover': {
      backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.primary.mainChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.hoverOpacity}))`
        : alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity,
          ),
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.selectedOpacity})`
          : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
    [`&.${treeItemClasses.focused}`]: {
      backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.primary.mainChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.focusOpacity}))`
        : alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity + theme.palette.action.focusOpacity,
          ),
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    marginRight: 4,
    width: 15,
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
    '& svg': {
      fontSize: 18,
    },
  },
  [`& .${treeItemClasses.label}`]: {
    paddingLeft: 4,
    width: '100%',
    boxSizing: 'border-box', // prevent width + padding to overflow
    // fixes overflow - see https://github.com/mui/material-ui/issues/27372
    minWidth: 0,
    position: 'relative',
    ...theme.typography.body1,
  },
}));

const TreeItemGroup = styled(Collapse, {
  name: 'MuiTreeItem',
  slot: 'Group',
  overridesResolver: (props, styles) => styles.group,
})({
  margin: 0,
  padding: 0,
  marginLeft: 17,
});

/**
 *
 * Demos:
 *
 * - [Tree View](https://mui.com/x/react-tree-view/)
 *
 * API:
 *
 * - [TreeItem API](https://mui.com/x/api/tree-view/tree-item/)
 */
export const TreeItem = React.forwardRef(function TreeItem(
  inProps: TreeItemProps,
  inRef: React.Ref<HTMLLIElement>,
) {
  const {
    icons: contextIcons,
    runItemPlugins,
    selection: { multiSelect },
    disabledItemsFocusable,
    instance,
  } = useTreeViewContext<DefaultTreeViewPlugins>();

  const inPropsWithTheme = useThemeProps({ props: inProps, name: 'MuiTreeItem' });

  const { props, ref, wrapItem } = runItemPlugins({ props: inPropsWithTheme, ref: inRef });

  const {
    children,
    className,
    collapseIcon,
    ContentComponent = TreeItemContent,
    ContentProps,
    endIcon,
    expandIcon,
    icon,
    nodeId,
    id,
    label,
    onClick,
    onMouseDown,
    TransitionComponent = Collapse,
    TransitionProps,
    ...other
  } = props;

  const expandable = Boolean(Array.isArray(children) ? children.length : children);
  const expanded = instance.isNodeExpanded(nodeId);
  const focused = instance.isNodeFocused(nodeId);
  const selected = instance.isNodeSelected(nodeId);
  const disabled = instance.isNodeDisabled(nodeId);

  const ownerState: TreeItemOwnerState = {
    ...props,
    expanded,
    focused,
    selected,
    disabled,
  };

  const classes = useUtilityClasses(ownerState);

  let displayIcon: React.ReactNode;
  let expansionIcon: React.ReactNode;

  if (expandable) {
    if (!expanded) {
      expansionIcon = expandIcon || contextIcons.defaultExpandIcon;
    } else {
      expansionIcon = collapseIcon || contextIcons.defaultCollapseIcon;
    }
  }

  if (expandable) {
    displayIcon = contextIcons.defaultParentIcon;
  } else {
    displayIcon = endIcon || contextIcons.defaultEndIcon;
  }

  let ariaSelected;
  if (multiSelect) {
    ariaSelected = selected;
  } else if (selected) {
    /* single-selection trees unset aria-selected on un-selected items.
     *
     * If the tree does not support multiple selection, aria-selected
     * is set to true for the selected node and it is not present on any other node in the tree.
     * Source: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
     */
    ariaSelected = true;
  }

  function handleFocus(event: React.FocusEvent<HTMLLIElement>) {
    // DOM focus stays on the tree which manages focus with aria-activedescendant
    if (event.target === event.currentTarget) {
      instance.focusRoot();
    }

    const canBeFocused = !disabled || disabledItemsFocusable;
    if (!focused && canBeFocused && event.currentTarget === event.target) {
      instance.focusNode(event, nodeId);
    }
  }

  const idAttribute = instance.getTreeItemId(nodeId, id);

  const item = (
    <TreeItemRoot
      className={clsx(classes.root, className)}
      role="treeitem"
      aria-expanded={expandable ? expanded : undefined}
      aria-selected={ariaSelected}
      aria-disabled={disabled || undefined}
      id={idAttribute}
      tabIndex={-1}
      {...other}
      ownerState={ownerState}
      onFocus={handleFocus}
      ref={ref}
    >
      <StyledTreeItemContent
        as={ContentComponent}
        classes={{
          root: classes.content,
          expanded: classes.expanded,
          selected: classes.selected,
          focused: classes.focused,
          disabled: classes.disabled,
          iconContainer: classes.iconContainer,
          label: classes.label,
        }}
        label={label}
        nodeId={nodeId}
        onClick={onClick}
        onMouseDown={onMouseDown}
        icon={icon}
        expansionIcon={expansionIcon}
        displayIcon={displayIcon}
        ownerState={ownerState}
        {...ContentProps}
      />
      {children && (
        <TreeItemGroup
          as={TransitionComponent}
          unmountOnExit
          className={classes.group}
          in={expanded}
          component="ul"
          role="group"
          {...TransitionProps}
        >
          {children}
        </TreeItemGroup>
      )}
    </TreeItemRoot>
  );

  return wrapItem(item);
});

TreeItem.propTypes = {
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
  className: PropTypes.string,
  /**
   * The icon used to collapse the node.
   */
  collapseIcon: PropTypes.node,
  /**
   * The component used for the content node.
   * @default TreeItemContent
   */
  ContentComponent: elementTypeAcceptingRef,
  /**
   * Props applied to ContentComponent.
   */
  ContentProps: PropTypes.object,
  /**
   * If `true`, the node is disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * The icon displayed next to an end node.
   */
  endIcon: PropTypes.node,
  /**
   * The icon used to expand the node.
   */
  expandIcon: PropTypes.node,
  /**
   * The icon to display next to the tree node's label.
   */
  icon: PropTypes.node,
  /**
   * The tree node label.
   */
  label: PropTypes.node,
  /**
   * The id of the node.
   */
  nodeId: PropTypes.string.isRequired,
  /**
   * This prop isn't supported.
   * Use the `onNodeFocus` callback on the tree if you need to monitor a node's focus.
   */
  onFocus: unsupportedProp,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The component used for the transition.
   * [Follow this guide](/material-ui/transitions/#transitioncomponent-prop) to learn more about the requirements for this component.
   * @default Collapse
   */
  TransitionComponent: PropTypes.elementType,
  /**
   * Props applied to the transition element.
   * By default, the element is based on this [`Transition`](http://reactcommunity.org/react-transition-group/transition/) component.
   */
  TransitionProps: PropTypes.object,
} as any;
