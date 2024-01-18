import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import composeClasses from '@mui/utils/composeClasses';
import { TreeItemNextProps, TreeItemNextOwnerState } from './TreeItemNext.types';
import { useTreeItem } from '../useTreeItem';
import { getTreeItemUtilityClass } from '../../TreeItem';

const TreeItemNextRoot = styled('li', {
  name: 'MuiTreeItemNext',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: TreeItemNextOwnerState }>({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  outline: 0,
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
    group: ['group'],
  };

  return composeClasses(slots, getTreeItemUtilityClass, classes);
};

export const TreeItemNext = React.forwardRef(function TreeItemNext(
  props: TreeItemNextProps,
  forwardedRef: React.Ref<HTMLLIElement>,
) {
  const { id, nodeId, children, slots = {}, slotProps = {}, ...other } = props;

  const { getRootProps, status } = useTreeItem({
    id,
    nodeId,
    children,
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
    ownerState,
    className: classes.root,
  });

  return <Root {...rootProps}>HELLO WORLD</Root>;
});
