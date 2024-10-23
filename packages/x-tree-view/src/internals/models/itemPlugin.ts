import * as React from 'react';
import { EventHandlers } from '@mui/utils';
import type { TreeItemProps } from '../../TreeItem';
import type {
  UseTreeItemContentSlotOwnProps,
  UseTreeItemDragAndDropOverlaySlotOwnProps,
  UseTreeItemLabelInputSlotOwnProps,
  UseTreeItemRootSlotOwnProps,
  UseTreeItemCheckboxSlotOwnProps,
  UseTreeItemStatus,
} from '../../useTreeItem';
import type { UseTreeItemInteractions } from '../../hooks/useTreeItemUtils/useTreeItemUtils';

export interface TreeViewItemPluginSlotPropsEnhancerParams {
  rootRefObject: React.MutableRefObject<HTMLLIElement | null>;
  contentRefObject: React.MutableRefObject<HTMLDivElement | null>;
  externalEventHandlers: EventHandlers;
  interactions: UseTreeItemInteractions;
  status: UseTreeItemStatus;
}

type TreeViewItemPluginSlotPropsEnhancer<TSlotProps> = (
  params: TreeViewItemPluginSlotPropsEnhancerParams,
) => Partial<TSlotProps>;

export interface TreeViewItemPluginSlotPropsEnhancers {
  root?: TreeViewItemPluginSlotPropsEnhancer<UseTreeItemRootSlotOwnProps>;
  content?: TreeViewItemPluginSlotPropsEnhancer<UseTreeItemContentSlotOwnProps>;
  dragAndDropOverlay?: TreeViewItemPluginSlotPropsEnhancer<UseTreeItemDragAndDropOverlaySlotOwnProps>;
  labelInput?: TreeViewItemPluginSlotPropsEnhancer<UseTreeItemLabelInputSlotOwnProps>;
  checkbox?: TreeViewItemPluginSlotPropsEnhancer<UseTreeItemCheckboxSlotOwnProps>;
}

export interface TreeViewItemPluginResponse {
  /**
   * Root of the `content` slot enriched by the plugin.
   */
  contentRef?: React.RefCallback<HTMLElement> | null;
  /**
   * Ref of the `root` slot enriched by the plugin
   */
  rootRef?: React.RefCallback<HTMLLIElement> | null;
  /**
   * Callback to enhance the slot props of the Tree Item.
   *
   * Not all slots are enabled by default,
   * if a new plugin needs to pass to an unconfigured slot,
   * it just needs to be added to `TreeViewItemPluginSlotPropsEnhancers`
   */
  propsEnhancers?: TreeViewItemPluginSlotPropsEnhancers;
}

export interface TreeViewItemPluginOptions<TProps extends {}>
  extends Omit<TreeViewItemPluginResponse, 'propsEnhancers'> {
  props: TProps;
}

export type TreeViewItemPlugin = (
  options: TreeViewItemPluginOptions<TreeItemProps>,
) => void | TreeViewItemPluginResponse;
