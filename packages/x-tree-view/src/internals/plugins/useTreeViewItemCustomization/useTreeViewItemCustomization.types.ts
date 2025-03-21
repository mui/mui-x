import * as React from 'react';
import { SlotComponentProps } from '@mui/utils/types';
import { TreeViewPluginSignature } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { UseTreeViewSelectionSignature } from '../useTreeViewSelection';

export interface UseTreeViewItemCustomizationParameters {}

export type UseTreeViewItemCustomizationDefaultizedParameters =
  UseTreeViewItemCustomizationParameters;

interface UseTreeViewItemCustomizationSlots {
  /**
   * The default icon used to collapse the item.
   */
  collapseIcon?: React.ElementType;
  /**
   * The default icon used to expand the item.
   */
  expandIcon?: React.ElementType;
  /**
   * The default icon displayed next to an end item.
   * This is applied to all Tree Items and can be overridden by the TreeItem `icon` slot prop.
   */
  endIcon?: React.ElementType;
}

interface UseTreeViewItemCustomizationSlotProps {
  collapseIcon?: SlotComponentProps<'svg', {}, {}>;
  expandIcon?: SlotComponentProps<'svg', {}, {}>;
  endIcon?: SlotComponentProps<'svg', {}, {}>;
}

interface UseTreeViewItemCustomizationContextValue {
  icons: {
    slots: UseTreeViewItemCustomizationSlots;
    slotProps: UseTreeViewItemCustomizationSlotProps;
  };
}

export type UseTreeViewItemCustomizationSignature = TreeViewPluginSignature<{
  params: UseTreeViewItemCustomizationParameters;
  defaultizedParams: UseTreeViewItemCustomizationDefaultizedParameters;
  contextValue: UseTreeViewItemCustomizationContextValue;
  slots: UseTreeViewItemCustomizationSlots;
  slotProps: UseTreeViewItemCustomizationSlotProps;
  dependencies: [UseTreeViewItemsSignature, UseTreeViewSelectionSignature];
}>;
