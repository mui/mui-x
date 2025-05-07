'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import useSlotProps from '@mui/utils/useSlotProps';
import { TreeItemIconProps } from './TreeItemIcon.types';
import { useTreeViewStyleContext } from '../internals/TreeViewProvider/TreeViewStyleContext';
import { TreeViewCollapseIcon, TreeViewExpandIcon } from '../icons';

function TreeItemIcon(props: TreeItemIconProps) {
  const { slots: slotsFromTreeItem, slotProps: slotPropsFromTreeItem, status } = props;

  const { slots: slotsFromTreeView, slotProps: slotPropsFromTreeView } = useTreeViewStyleContext();

  const slots = {
    collapseIcon:
      slotsFromTreeItem?.collapseIcon ?? slotsFromTreeView.collapseIcon ?? TreeViewCollapseIcon,
    expandIcon: slotsFromTreeItem?.expandIcon ?? slotsFromTreeView.expandIcon ?? TreeViewExpandIcon,
    endIcon: slotsFromTreeItem?.endIcon ?? slotsFromTreeView.endIcon,
    icon: slotsFromTreeItem?.icon,
  };

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

  const Icon = slots[iconName];
  const iconProps = useSlotProps({
    elementType: Icon,
    externalSlotProps: (tempOwnerState: any) => ({
      ...resolveComponentProps(
        slotPropsFromTreeView[iconName as keyof typeof slotPropsFromTreeView],
        tempOwnerState,
      ),
      ...resolveComponentProps(slotPropsFromTreeItem?.[iconName], tempOwnerState),
    }),
    // TODO: Add proper ownerState
    ownerState: {},
  });

  if (!Icon) {
    return null;
  }

  return <Icon {...iconProps} />;
}

TreeItemIcon.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
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
  status: PropTypes.shape({
    disabled: PropTypes.bool.isRequired,
    editable: PropTypes.bool.isRequired,
    editing: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    expandable: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    focused: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired,
  }).isRequired,
} as any;

export { TreeItemIcon };
