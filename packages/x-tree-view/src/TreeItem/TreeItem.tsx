'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import unsupportedProp from '@mui/utils/unsupportedProp';
import { alpha } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import MuiCheckbox, { CheckboxProps } from '@mui/material/Checkbox';
import useSlotProps from '@mui/utils/useSlotProps';
import { shouldForwardProp } from '@mui/system/createStyled';
import composeClasses from '@mui/utils/composeClasses';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { TreeItemProps, TreeItemOwnerState, RawTreeItemProps } from './TreeItem.types';
import {
  useTreeItem,
  UseTreeItemContentSlotOwnProps,
  UseTreeItemLabelSlotOwnProps,
  UseTreeItemStatus,
} from '../useTreeItem';
import { getTreeItemUtilityClass } from './treeItemClasses';
import { TreeItemIcon } from '../TreeItemIcon';
import { TreeItemDragAndDropOverlay } from '../TreeItemDragAndDropOverlay';
import { TreeItemProvider } from '../TreeItemProvider';
import { TreeItemLabelInput } from '../TreeItemLabelInput';
import { TreeViewItemToRenderProps } from '../internals/plugins/useTreeViewItems';

const useThemeProps = createUseThemeProps('MuiTreeItem');

export const TreeItemRoot = styled('li', {
  name: 'MuiTreeItem',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  outline: 0,
});

export const TreeItemContent = styled('div', {
  name: 'MuiTreeItem',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content,
  shouldForwardProp: (prop) =>
    shouldForwardProp(prop) && prop !== 'status' && prop !== 'indentationAtItemLevel',
})<{ status: UseTreeItemStatus; indentationAtItemLevel?: true }>(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  boxSizing: 'border-box', // prevent width + padding to overflow
  position: 'relative',
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
  variants: [
    {
      props: { indentationAtItemLevel: true },
      style: {
        paddingLeft: `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
      },
    },
    {
      props: ({ status }: UseTreeItemContentSlotOwnProps) => status.disabled,
      style: {
        opacity: (theme.vars || theme).palette.action.disabledOpacity,
        backgroundColor: 'transparent',
      },
    },
    {
      props: ({ status }: UseTreeItemContentSlotOwnProps) => status.focused,
      style: { backgroundColor: (theme.vars || theme).palette.action.focus },
    },
    {
      props: ({ status }: UseTreeItemContentSlotOwnProps) => status.selected,
      style: {
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
      },
    },
    {
      props: ({ status }: UseTreeItemContentSlotOwnProps) => status.selected && status.focused,
      style: {
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.primary.mainChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.focusOpacity}))`
          : alpha(
              theme.palette.primary.main,
              theme.palette.action.selectedOpacity + theme.palette.action.focusOpacity,
            ),
      },
    },
  ],
}));

export const TreeItemLabel = styled('div', {
  name: 'MuiTreeItem',
  slot: 'Label',
  overridesResolver: (props, styles) => styles.label,
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'editable',
})<{ editable?: boolean }>(({ theme }) => ({
  width: '100%',
  boxSizing: 'border-box', // prevent width + padding to overflow
  // fixes overflow - see https://github.com/mui/material-ui/issues/27372
  minWidth: 0,
  position: 'relative',
  overflow: 'hidden',
  ...theme.typography.body1,
  variants: [
    {
      props: ({ editable }: UseTreeItemLabelSlotOwnProps) => editable,
      style: {
        paddingLeft: '2px',
      },
    },
  ],
}));

export const TreeItemIconContainer = styled('div', {
  name: 'MuiTreeItem',
  slot: 'IconContainer',
  overridesResolver: (props, styles) => styles.iconContainer,
})({
  width: 16,
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'center',
  '& svg': {
    fontSize: 18,
  },
});

export const TreeItemGroupTransition = styled(Collapse, {
  name: 'MuiTreeItem',
  slot: 'GroupTransition',
  overridesResolver: (props, styles) => styles.groupTransition,
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'indentationAtItemLevel',
})<{ indentationAtItemLevel?: true }>({
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

export const TreeItemCheckbox = styled(
  React.forwardRef(
    (props: CheckboxProps & { visible?: boolean }, ref: React.Ref<HTMLButtonElement>) => {
      const { visible, ...other } = props;
      if (!visible) {
        return null;
      }

      return <MuiCheckbox {...other} ref={ref} />;
    },
  ),
  {
    name: 'MuiTreeItem',
    slot: 'Checkbox',
    overridesResolver: (props, styles) => styles.checkbox,
  },
)({
  padding: 0,
});

const useUtilityClasses = (ownerState: TreeItemOwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
    content: ['content'],
    expanded: ['expanded'],
    editing: ['editing'],
    editable: ['editable'],
    selected: ['selected'],
    focused: ['focused'],
    disabled: ['disabled'],
    iconContainer: ['iconContainer'],
    checkbox: ['checkbox'],
    label: ['label'],
    groupTransition: ['groupTransition'],
    labelInput: ['labelInput'],
    dragAndDropOverlay: ['dragAndDropOverlay'],
  };

  return composeClasses(slots, getTreeItemUtilityClass, classes);
};

type TreeItemComponent = ((
  props: TreeItemProps & React.RefAttributes<HTMLLIElement>,
) => React.JSX.Element) & { propTypes?: any };

export const TreeItemRaw = React.forwardRef(function TreeItem(
  inProps: RawTreeItemProps,
  forwardedRef: React.Ref<HTMLLIElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiTreeItem' });

  const { id, itemId, label, disabled, children, slots = {}, slotProps = {}, ...other } = props;

  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getLabelInputProps,
    getDragAndDropOverlayProps,
    status,
  } = useTreeItem({
    id,
    itemId,
    children,
    label,
    disabled,
  });

  const ownerState: TreeItemOwnerState = {
    ...props,
    ...status,
  };

  const classes = useUtilityClasses(ownerState);

  const Root: React.ElementType = slots.root ?? TreeItemRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    getSlotProps: getRootProps,
    externalForwardedProps: other,
    externalSlotProps: slotProps.root,
    additionalProps: {
      ref: forwardedRef,
    },
    ownerState: {},
    className: classes.root,
  });

  const Content: React.ElementType = slots.content ?? TreeItemContent;
  const contentProps = useSlotProps({
    elementType: Content,
    getSlotProps: getContentProps,
    externalSlotProps: slotProps.content,
    ownerState: {},
    className: clsx(classes.content, {
      [classes.expanded]: status.expanded,
      [classes.selected]: status.selected,
      [classes.focused]: status.focused,
      [classes.disabled]: status.disabled,
      [classes.editing]: status.editing,
      [classes.editable]: status.editable,
    }),
  });

  const IconContainer: React.ElementType = slots.iconContainer ?? TreeItemIconContainer;
  const iconContainerProps = useSlotProps({
    elementType: IconContainer,
    getSlotProps: getIconContainerProps,
    externalSlotProps: slotProps.iconContainer,
    ownerState: {},
    className: classes.iconContainer,
  });

  const Label: React.ElementType = slots.label ?? TreeItemLabel;
  const labelProps = useSlotProps({
    elementType: Label,
    getSlotProps: getLabelProps,
    externalSlotProps: slotProps.label,
    ownerState: {},
    className: classes.label,
  });

  const Checkbox: React.ElementType = slots.checkbox ?? TreeItemCheckbox;
  const checkboxProps = useSlotProps({
    elementType: Checkbox,
    getSlotProps: getCheckboxProps,
    externalSlotProps: slotProps.checkbox,
    ownerState: {},
    className: classes.checkbox,
  });

  const GroupTransition: React.ElementType | undefined = slots.groupTransition ?? undefined;
  const groupTransitionProps = useSlotProps({
    elementType: GroupTransition,
    getSlotProps: getGroupTransitionProps,
    externalSlotProps: slotProps.groupTransition,
    ownerState: {},
    className: classes.groupTransition,
  });

  const LabelInput: React.ElementType = slots.labelInput ?? TreeItemLabelInput;
  const labelInputProps = useSlotProps({
    elementType: LabelInput,
    getSlotProps: getLabelInputProps,
    externalSlotProps: slotProps.labelInput,
    ownerState: {},
    className: classes.labelInput,
  });

  const DragAndDropOverlay: React.ElementType | undefined =
    slots.dragAndDropOverlay ?? TreeItemDragAndDropOverlay;
  const dragAndDropOverlayProps = useSlotProps({
    elementType: DragAndDropOverlay,
    getSlotProps: getDragAndDropOverlayProps,
    externalSlotProps: slotProps.dragAndDropOverlay,
    ownerState: {},
    className: classes.dragAndDropOverlay,
  });

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <Root {...rootProps}>
        <Content {...contentProps}>
          <IconContainer {...iconContainerProps}>
            <TreeItemIcon status={status} slots={slots} slotProps={slotProps} />
          </IconContainer>
          <Checkbox {...checkboxProps} />
          {status.editing ? <LabelInput {...labelInputProps} /> : <Label {...labelProps} />}
          <DragAndDropOverlay {...dragAndDropOverlayProps} />
        </Content>
        {children && <TreeItemGroupTransition as={GroupTransition} {...groupTransitionProps} />}
      </Root>
    </TreeItemProvider>
  );
});

const areChildrenEqual = (childA: TreeViewItemToRenderProps, childB: TreeViewItemToRenderProps) => {
  if (childA.itemId !== childB.itemId) {
    return false;
  }
  if (childA.id !== childB.id) {
    return false;
  }
  if (childA.label !== childB.label) {
    return false;
  }
  if (childA.children.length !== childB.children.length) {
    return false;
  }
  for (let i = 0; i < childA.children.length; i += 1) {
    if (!areChildrenEqual(childA.children[i], childB.children[i])) {
      return false;
    }
  }
  return true;
};

// Logic copied from `fastObjectShallowCompare` but with a deep comparison for `props.children`
const is = Object.is;
const propsAreEqual = (a: RawTreeItemProps, b: RawTreeItemProps) => {
  if (a === b) {
    return true;
  }
  if (!(a instanceof Object) || !(b instanceof Object)) {
    return false;
  }

  let aLength = 0;
  let bLength = 0;

  /* eslint-disable guard-for-in */
  for (const key in a) {
    aLength += 1;

    if (key === 'children') {
      const childrenA = a[key];
      const childrenB = b[key];
      if (!Array.isArray(childrenA) || !Array.isArray(childrenB)) {
        if (!is(a[key], b[key])) {
          return false;
        }
      } else if (childrenA.length !== childrenB.length) {
        return false;
      } else {
        for (let i = 0; i < childrenA.length; i += 1) {
          if (React.isValidElement(childrenA[i]) || React.isValidElement(childrenB[i])) {
            if (!is(a[key], b[key])) {
              return false;
            }
          } else if (!areChildrenEqual(childrenA[i], childrenB[i])) {
            return false;
          }
        }
      }
    } else {
      if (!is(a[key], b[key])) {
        return false;
      }
      if (!(key in b)) {
        return false;
      }
    }
  }

  /* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars */
  for (const _ in b) {
    bLength += 1;
  }
  return aLength === bLength;
};

/**
 *
 * Demos:
 *
 * - [Tree View](https://mui.com/x/react-tree-view/)
 *
 * API:
 *
 * - [TreeItem API](https://mui.com/x/api/tree-view/tree-item-2/)
 */
export const TreeItem = React.memo(TreeItemRaw, propsAreEqual) as TreeItemComponent;

TreeItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
   */
  children: PropTypes.any,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * If `true`, the item is disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * The id attribute of the item. If not provided, it will be generated.
   */
  id: PropTypes.string,
  /**
   * The id of the item.
   * Must be unique.
   */
  itemId: PropTypes.string.isRequired,
  /**
   * The label of the item.
   */
  label: PropTypes.node,
  /**
   * Callback fired when the item root is blurred.
   */
  onBlur: PropTypes.func,
  /**
   * This prop isn't supported.
   * Use the `onItemFocus` callback on the tree if you need to monitor an item's focus.
   */
  onFocus: unsupportedProp,
  /**
   * Callback fired when a key is pressed on the keyboard and the tree is in focus.
   */
  onKeyDown: PropTypes.func,
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
