import * as React from 'react';
import clsx from 'clsx';
import { alpha, styled, useThemeProps } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import { useSlotProps } from '@mui/base/utils';
import { shouldForwardProp } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import { TreeItemNextProps, TreeItemNextOwnerState } from './TreeItemNext.types';
import { useTreeItem, UseTreeItemContentSlotOwnProps } from '../useTreeItem';
import { getTreeItemUtilityClass, treeItemClasses } from '../../TreeItem';
import { TreeItemNextIcon } from '../TreeItemNextIcon';
import { TreeItemNextProvider } from '../TreeItemNextProvider';

export const TreeItemNextRoot = styled('li', {
  name: 'MuiTreeItemNext',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  outline: 0,
});

export const TreeItemNextContent = styled('div', {
  name: 'MuiTreeItemNext',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content,
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'status',
})(({ theme }) => ({
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
  [`& .${treeItemClasses.groupTransition}`]: {
    margin: 0,
    padding: 0,
    paddingLeft: 12,
  },
  variants: [
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

export const TreeItemNextLabel = styled('div', {
  name: 'MuiTreeItemNext',
  slot: 'Label',
  overridesResolver: (props, styles) => styles.label,
})(({ theme }) => ({
  width: '100%',
  boxSizing: 'border-box', // prevent width + padding to overflow
  // fixes overflow - see https://github.com/mui/material-ui/issues/27372
  minWidth: 0,
  position: 'relative',
  ...theme.typography.body1,
}));

export const TreeItemNextIconContainer = styled('div', {
  name: 'MuiTreeItemNext',
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

export const TreeItemNextTransitionGroup = styled(Collapse, {
  name: 'MuiTreeItemNextTransitionGroup',
  slot: 'TransitionGroup',
  overridesResolver: (props, styles) => styles.transitionGroup,
})({
  margin: 0,
  padding: 0,
  paddingLeft: 12,
});

const useUtilityClasses = (ownerState: TreeItemNextOwnerState) => {
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
    groupTransition: ['groupTransition'],
  };

  return composeClasses(slots, getTreeItemUtilityClass, classes);
};

export const TreeItemNext = React.forwardRef(function TreeItemNext(
  inProps: TreeItemNextProps,
  forwardedRef: React.Ref<HTMLLIElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiTreeItemNext' });

  const { id, nodeId, label, children, slots = {}, slotProps = {}, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
  } = useTreeItem({
    id,
    nodeId,
    children,
    label,
  });

  const ownerState: TreeItemNextOwnerState = {
    ...props,
    ...status,
  };

  const classes = useUtilityClasses(ownerState);

  const Root: React.ElementType = slots.root ?? TreeItemNextRoot;
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

  const Content: React.ElementType = slots.content ?? TreeItemNextContent;
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
    }),
  });

  const IconContainer: React.ElementType = slots.iconContainer ?? TreeItemNextIconContainer;
  const iconContainerProps = useSlotProps({
    elementType: IconContainer,
    getSlotProps: getIconContainerProps,
    externalSlotProps: slotProps.iconContainer,
    ownerState: {},
    className: classes.iconContainer,
  });

  const Label: React.ElementType = slots.label ?? TreeItemNextLabel;
  const labelProps = useSlotProps({
    elementType: Label,
    getSlotProps: getLabelProps,
    externalSlotProps: slotProps.label,
    ownerState: {},
    className: classes.label,
  });

  const GroupTransition: React.ElementType | undefined = slots.groupTransition ?? undefined;
  const groupTransitionProps = useSlotProps({
    elementType: GroupTransition,
    getSlotProps: getGroupTransitionProps,
    externalSlotProps: slotProps.groupTransition,
    ownerState: {},
    className: classes.groupTransition,
  });

  return (
    <TreeItemNextProvider nodeId={nodeId}>
      <Root {...rootProps}>
        <Content {...contentProps}>
          <IconContainer {...iconContainerProps}>
            <TreeItemNextIcon status={status} slots={slots} slotProps={slotProps} />
          </IconContainer>
          <Label {...labelProps} />
        </Content>
        {children && <TreeItemNextTransitionGroup as={GroupTransition} {...groupTransitionProps} />}
      </Root>
    </TreeItemNextProvider>
  );
});
