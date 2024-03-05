import * as React from 'react';
import { resolveComponentProps, useSlotProps } from '@mui/base/utils';
import { TreeItem2IconProps } from './TreeItem2Icon.types';
import { useTreeViewContext } from '../internals/TreeViewProvider/useTreeViewContext';
import { UseTreeViewIconsSignature } from '../internals/plugins/useTreeViewIcons';
import { TreeViewCollapseIcon, TreeViewExpandIcon } from '../icons';

export function TreeItem2Icon(props: TreeItem2IconProps) {
  const { slots, slotProps, status } = props;

  const context = useTreeViewContext<[UseTreeViewIconsSignature]>();

  const contextIcons = {
    ...context.icons.slots,
    expandIcon: context.icons.slots.expandIcon ?? TreeViewExpandIcon,
    collapseIcon: context.icons.slots.collapseIcon ?? TreeViewCollapseIcon,
  };

  const contextIconProps = context.icons.slotProps;

  let iconName: 'collapseIcon' | 'expandIcon' | 'endIcon' | 'icon';
  if (slots?.icon) {
    iconName = 'icon';
  } else if (status.expandable) {
    if (status.expanded) {
      iconName = 'collapseIcon';
    } else {
      iconName = 'expandIcon';
    }
  } else {
    iconName = 'endIcon';
  }

  const Icon = slots?.[iconName] ?? contextIcons[iconName as keyof typeof contextIcons];
  const iconProps = useSlotProps({
    elementType: Icon,
    externalSlotProps: (tempOwnerState: any) => ({
      ...resolveComponentProps(
        contextIconProps[iconName as keyof typeof contextIconProps],
        tempOwnerState,
      ),
      ...resolveComponentProps(slotProps?.[iconName], tempOwnerState),
    }),
    // TODO: Add proper ownerState
    ownerState: {},
  });

  if (!Icon) {
    return null;
  }

  return <Icon {...iconProps} />;
}
