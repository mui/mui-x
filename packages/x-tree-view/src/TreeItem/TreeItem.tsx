import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Collapse from '@mui/material/Collapse';
import { resolveComponentProps, useSlotProps } from '@mui/base/utils';
import useForkRef from '@mui/utils/useForkRef';
import { shouldForwardProp } from '@mui/system/createStyled';
import { alpha, styled, useThemeProps } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import unsupportedProp from '@mui/utils/unsupportedProp';
import elementTypeAcceptingRef from '@mui/utils/elementTypeAcceptingRef';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import { TreeItemContent } from './TreeItemContent';
import { treeItemClasses, getTreeItemUtilityClass } from './treeItemClasses';
import { TreeItemOwnerState, TreeItemProps } from './TreeItem.types';
import { useTreeViewContext } from '../internals/TreeViewProvider/useTreeViewContext';
import { DefaultTreeViewPlugins } from '../internals/plugins';
import { TreeViewCollapseIcon, TreeViewExpandIcon } from '../icons';
import { TreeItem2Provider } from '../TreeItem2Provider';
import { TreeViewItemDepthContext } from '../internals/TreeViewItemDepthContext';

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
    checkbox: ['checkbox'],
    label: ['label'],
    groupTransition: ['groupTransition'],
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
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'indentationAtItemLevel',
})<{ ownerState: TreeItemOwnerState }>(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  boxSizing: 'border-box', // prevent width + padding to overflow
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
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
    width: 16,
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
    '& svg': {
      fontSize: 18,
    },
  },
  [`& .${treeItemClasses.label}`]: {
    width: '100%',
    boxSizing: 'border-box', // prevent width + padding to overflow
    // fixes overflow - see https://github.com/mui/material-ui/issues/27372
    minWidth: 0,
    position: 'relative',
    ...theme.typography.body1,
  },
  [`& .${treeItemClasses.checkbox}`]: {
    padding: 0,
  },
  variants: [
    {
      props: { indentationAtItemLevel: true },
      style: {
        paddingLeft: `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
      },
    },
  ],
}));

const TreeItemGroup = styled(Collapse, {
  name: 'MuiTreeItem',
  slot: 'GroupTransition',
  overridesResolver: (props, styles) => styles.groupTransition,
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'indentationAtItemLevel',
})({
  margin: 0,
  padding: 0,
  paddingLeft: 'var(--TreeView-itemChildrenIndentation)',
  variants: [
    {
      props: { indentationAtItemLevel: true },
      style: { paddingLeft: 0 },
    },
  ],
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
    indentationAtItemLevel,
    instance,
  } = useTreeViewContext<DefaultTreeViewPlugins>();
  const depthContext = React.useContext(TreeViewItemDepthContext);

  const props = useThemeProps({ props: inProps, name: 'MuiTreeItem' });

  const {
    children,
    className,
    slots: inSlots,
    slotProps: inSlotProps,
    ContentComponent = TreeItemContent,
    ContentProps,
    itemId,
    id,
    label,
    onClick,
    onMouseDown,
    onFocus,
    onBlur,
    onKeyDown,
    ...other
  } = props;

  const { contentRef, rootRef } = runItemPlugins<TreeItemProps>(props);
  const handleRootRef = useForkRef(inRef, rootRef);
  const handleContentRef = useForkRef(ContentProps?.ref, contentRef);

  const slots = {
    expandIcon: inSlots?.expandIcon ?? contextIcons.slots.expandIcon ?? TreeViewExpandIcon,
    collapseIcon: inSlots?.collapseIcon ?? contextIcons.slots.collapseIcon ?? TreeViewCollapseIcon,
    endIcon: inSlots?.endIcon ?? contextIcons.slots.endIcon,
    icon: inSlots?.icon,
    groupTransition: inSlots?.groupTransition,
  };

  const isExpandable = (reactChildren: React.ReactNode) => {
    if (Array.isArray(reactChildren)) {
      return reactChildren.length > 0 && reactChildren.some(isExpandable);
    }
    return Boolean(reactChildren);
  };
  const expandable = isExpandable(children);
  const expanded = instance.isItemExpanded(itemId);
  const focused = instance.isItemFocused(itemId);
  const selected = instance.isItemSelected(itemId);
  const disabled = instance.isItemDisabled(itemId);

  const ownerState: TreeItemOwnerState = {
    ...props,
    expanded,
    focused,
    selected,
    disabled,
    indentationAtItemLevel,
  };

  const classes = useUtilityClasses(ownerState);

  const GroupTransition: React.ElementType | undefined = slots.groupTransition ?? undefined;
  const groupTransitionProps: TransitionProps = useSlotProps({
    elementType: GroupTransition,
    ownerState: {},
    externalSlotProps: inSlotProps?.groupTransition,
    additionalProps: {
      unmountOnExit: true,
      in: expanded,
      component: 'ul',
      role: 'group',
      ...(indentationAtItemLevel ? { indentationAtItemLevel: true } : {}),
    },
    className: classes.groupTransition,
  });

  const ExpansionIcon = expanded ? slots.collapseIcon : slots.expandIcon;
  const { ownerState: expansionIconOwnerState, ...expansionIconProps } = useSlotProps({
    elementType: ExpansionIcon,
    ownerState: {},
    externalSlotProps: (tempOwnerState: any) => {
      if (expanded) {
        return {
          ...resolveComponentProps(contextIcons.slotProps.collapseIcon, tempOwnerState),
          ...resolveComponentProps(inSlotProps?.collapseIcon, tempOwnerState),
        };
      }

      return {
        ...resolveComponentProps(contextIcons.slotProps.expandIcon, tempOwnerState),
        ...resolveComponentProps(inSlotProps?.expandIcon, tempOwnerState),
      };
    },
  });
  const expansionIcon =
    expandable && !!ExpansionIcon ? <ExpansionIcon {...expansionIconProps} /> : null;

  const DisplayIcon = expandable ? undefined : slots.endIcon;
  const { ownerState: displayIconOwnerState, ...displayIconProps } = useSlotProps({
    elementType: DisplayIcon,
    ownerState: {},
    externalSlotProps: (tempOwnerState: any) => {
      if (expandable) {
        return {};
      }

      return {
        ...resolveComponentProps(contextIcons.slotProps.endIcon, tempOwnerState),
        ...resolveComponentProps(inSlotProps?.endIcon, tempOwnerState),
      };
    },
  });
  const displayIcon = DisplayIcon ? <DisplayIcon {...displayIconProps} /> : null;

  const Icon = slots.icon;
  const { ownerState: iconOwnerState, ...iconProps } = useSlotProps({
    elementType: Icon,
    ownerState: {},
    externalSlotProps: inSlotProps?.icon,
  });
  const icon = Icon ? <Icon {...iconProps} /> : null;

  let ariaSelected;
  if (multiSelect) {
    ariaSelected = selected;
  } else if (selected) {
    /* single-selection trees unset aria-selected on un-selected items.
     *
     * If the tree does not support multiple selection, aria-selected
     * is set to true for the selected item and it is not present on any other item in the tree.
     * Source: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
     */
    ariaSelected = true;
  }

  function handleFocus(event: React.FocusEvent<HTMLLIElement>) {
    const canBeFocused = !disabled || disabledItemsFocusable;
    if (!focused && canBeFocused && event.currentTarget === event.target) {
      instance.focusItem(event, itemId);
    }
  }

  function handleBlur(event: React.FocusEvent<HTMLLIElement>) {
    onBlur?.(event);
    instance.removeFocusedItem();
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    onKeyDown?.(event);
    instance.handleItemKeyDown(event, itemId);
  };

  const idAttribute = instance.getTreeItemIdAttribute(itemId, id);
  const tabIndex = instance.canItemBeTabbed(itemId) ? 0 : -1;

  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItemRoot
        className={clsx(classes.root, className)}
        role="treeitem"
        aria-expanded={expandable ? expanded : undefined}
        aria-selected={ariaSelected}
        aria-disabled={disabled || undefined}
        id={idAttribute}
        tabIndex={tabIndex}
        {...other}
        ownerState={ownerState}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        ref={handleRootRef}
        style={
          indentationAtItemLevel
            ? ({
                ...other.style,
                '--TreeView-itemDepth':
                  typeof depthContext === 'function' ? depthContext(itemId) : depthContext,
              } as React.CSSProperties)
            : other.style
        }
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
            checkbox: classes.checkbox,
          }}
          label={label}
          itemId={itemId}
          onClick={onClick}
          onMouseDown={onMouseDown}
          icon={icon}
          expansionIcon={expansionIcon}
          displayIcon={displayIcon}
          ownerState={ownerState}
          {...ContentProps}
          ref={handleContentRef}
        />
        {children && (
          <TreeItemGroup as={GroupTransition} {...groupTransitionProps}>
            {children}
          </TreeItemGroup>
        )}
      </TreeItemRoot>
    </TreeItem2Provider>
  );
});

TreeItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
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
   * The component used to render the content of the item.
   * @default TreeItemContent
   */
  ContentComponent: elementTypeAcceptingRef,
  /**
   * Props applied to ContentComponent.
   */
  ContentProps: PropTypes.object,
  /**
   * If `true`, the item is disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * The id of the item.
   */
  itemId: PropTypes.string.isRequired,
  /**
   * The tree item label.
   */
  label: PropTypes.node,
  /**
   * This prop isn't supported.
   * Use the `onItemFocus` callback on the tree if you need to monitor a item's focus.
   */
  onFocus: unsupportedProp,
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
