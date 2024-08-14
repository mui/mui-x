import * as React from 'react';
import PropTypes from 'prop-types';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import useSlotProps from '@mui/utils/useSlotProps';
import { TreeItem2IconProps } from './TreeItem2Icon.types';
import { useTreeViewContext } from '../internals/TreeViewProvider';
import { UseTreeViewIconsSignature } from '../internals/plugins/useTreeViewIcons';
import { TreeViewCollapseIcon, TreeViewExpandIcon } from '../icons';

function TreeItem2Icon(props: TreeItem2IconProps) {
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

TreeItem2Icon.propTypes = {
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
    expandable: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    focused: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired,
  }).isRequired,
} as any;

export { TreeItem2Icon };
