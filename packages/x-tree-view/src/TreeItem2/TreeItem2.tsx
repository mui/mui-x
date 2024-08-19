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
import { TreeItem2Props, TreeItem2OwnerState } from './TreeItem2.types';
import {
  unstable_useTreeItem2 as useTreeItem2,
  UseTreeItem2ContentSlotOwnProps,
  UseTreeItem2LabelSlotOwnProps,
  UseTreeItem2Status,
} from '../useTreeItem2';
import { getTreeItemUtilityClass } from '../TreeItem';
import { TreeItem2Icon } from '../TreeItem2Icon';
import { TreeItem2DragAndDropOverlay } from '../TreeItem2DragAndDropOverlay';
import { TreeItem2Provider } from '../TreeItem2Provider';
import { TreeItem2LabelInput } from '../TreeItem2LabelInput';

const useThemeProps = createUseThemeProps('MuiTreeItem2');

export const TreeItem2Root = styled('li', {
  name: 'MuiTreeItem2',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  outline: 0,
});

export const TreeItem2Content = styled('div', {
  name: 'MuiTreeItem2',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content,
  shouldForwardProp: (prop) =>
    shouldForwardProp(prop) && prop !== 'status' && prop !== 'indentationAtItemLevel',
})<{ status: UseTreeItem2Status; indentationAtItemLevel?: true }>(({ theme }) => ({
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
      props: ({ status }: UseTreeItem2ContentSlotOwnProps) => status.disabled,
      style: {
        opacity: (theme.vars || theme).palette.action.disabledOpacity,
        backgroundColor: 'transparent',
      },
    },
    {
      props: ({ status }: UseTreeItem2ContentSlotOwnProps) => status.focused,
      style: { backgroundColor: (theme.vars || theme).palette.action.focus },
    },
    {
      props: ({ status }: UseTreeItem2ContentSlotOwnProps) => status.selected,
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
      props: ({ status }: UseTreeItem2ContentSlotOwnProps) => status.selected && status.focused,
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

export const TreeItem2Label = styled('div', {
  name: 'MuiTreeItem2',
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
      props: ({ editable }: UseTreeItem2LabelSlotOwnProps) => editable,
      style: {
        paddingLeft: '2px',
      },
    },
  ],
}));

export const TreeItem2IconContainer = styled('div', {
  name: 'MuiTreeItem2',
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

export const TreeItem2GroupTransition = styled(Collapse, {
  name: 'MuiTreeItem2',
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

export const TreeItem2Checkbox = styled(
  React.forwardRef(
    (props: CheckboxProps & { visible: boolean }, ref: React.Ref<HTMLButtonElement>) => {
      const { visible, ...other } = props;
      if (!visible) {
        return null;
      }

      return <MuiCheckbox {...other} ref={ref} />;
    },
  ),
  {
    name: 'MuiTreeItem2',
    slot: 'Checkbox',
    overridesResolver: (props, styles) => styles.checkbox,
  },
)({
  padding: 0,
});

const useUtilityClasses = (ownerState: TreeItem2OwnerState) => {
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

type TreeItem2Component = ((
  props: TreeItem2Props & React.RefAttributes<HTMLLIElement>,
) => React.JSX.Element) & { propTypes?: any };

/**
 *
 * Demos:
 *
 * - [Tree View](https://mui.com/x/react-tree-view/)
 *
 * API:
 *
 * - [TreeItem2 API](https://mui.com/x/api/tree-view/tree-item-2/)
 */
export const TreeItem2 = React.forwardRef(function TreeItem2(
  inProps: TreeItem2Props,
  forwardedRef: React.Ref<HTMLLIElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiTreeItem2' });

  const { id, itemId, label, disabled, children, slots = {}, slotProps = {}, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getLabelInputProps,
    getDragAndDropOverlayProps,
    status,
  } = useTreeItem2({
    id,
    itemId,
    children,
    label,
    disabled,
  });

  const ownerState: TreeItem2OwnerState = {
    ...props,
    ...status,
  };

  const classes = useUtilityClasses(ownerState);

  const Root: React.ElementType = slots.root ?? TreeItem2Root;
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

  const Content: React.ElementType = slots.content ?? TreeItem2Content;
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

  const IconContainer: React.ElementType = slots.iconContainer ?? TreeItem2IconContainer;
  const iconContainerProps = useSlotProps({
    elementType: IconContainer,
    getSlotProps: getIconContainerProps,
    externalSlotProps: slotProps.iconContainer,
    ownerState: {},
    className: classes.iconContainer,
  });

  const Label: React.ElementType = slots.label ?? TreeItem2Label;
  const labelProps = useSlotProps({
    elementType: Label,
    getSlotProps: getLabelProps,
    externalSlotProps: slotProps.label,
    ownerState: {},
    className: classes.label,
  });

  const Checkbox: React.ElementType = slots.checkbox ?? TreeItem2Checkbox;
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

  const LabelInput: React.ElementType = slots.labelInput ?? TreeItem2LabelInput;
  const labelInputProps = useSlotProps({
    elementType: LabelInput,
    getSlotProps: getLabelInputProps,
    externalSlotProps: slotProps.labelInput,
    ownerState: {},
    className: classes.labelInput,
  });

  const DragAndDropOverlay: React.ElementType | undefined =
    slots.dragAndDropOverlay ?? TreeItem2DragAndDropOverlay;
  const dragAndDropOverlayProps = useSlotProps({
    elementType: DragAndDropOverlay,
    getSlotProps: getDragAndDropOverlayProps,
    externalSlotProps: slotProps.dragAndDropOverlay,
    ownerState: {},
    className: classes.dragAndDropOverlay,
  });

  return (
    <TreeItem2Provider itemId={itemId}>
      <Root {...rootProps}>
        <Content {...contentProps}>
          <IconContainer {...iconContainerProps}>
            <TreeItem2Icon status={status} slots={slots} slotProps={slotProps} />
          </IconContainer>
          <Checkbox {...checkboxProps} />
          {status.editing ? <LabelInput {...labelInputProps} /> : <Label {...labelProps} />}
          <DragAndDropOverlay {...dragAndDropOverlayProps} />
        </Content>
        {children && <TreeItem2GroupTransition as={GroupTransition} {...groupTransitionProps} />}
      </Root>
    </TreeItem2Provider>
  );
}) as TreeItem2Component;

TreeItem2.propTypes = {
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
