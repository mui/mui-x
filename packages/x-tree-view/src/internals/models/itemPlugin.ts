import * as React from 'react';
import { EventHandlers } from '@mui/utils';
import type {
  UseTreeItem2ContentSlotOwnProps,
  UseTreeItem2DragAndDropOverlaySlotOwnProps,
  UseTreeItem2LabelInputSlotOwnProps,
  UseTreeItem2RootSlotOwnProps,
} from '../../useTreeItem2';

export interface TreeViewItemPluginSlotPropsEnhancerParams {
  rootRefObject: React.MutableRefObject<HTMLLIElement | null>;
  contentRefObject: React.MutableRefObject<HTMLDivElement | null>;
  externalEventHandlers: EventHandlers;
}

type TreeViewItemPluginSlotPropsEnhancer<TSlotProps> = (
  params: TreeViewItemPluginSlotPropsEnhancerParams,
) => Partial<TSlotProps>;

export interface TreeViewItemPluginSlotPropsEnhancers {
  root?: TreeViewItemPluginSlotPropsEnhancer<UseTreeItem2RootSlotOwnProps>;
  content?: TreeViewItemPluginSlotPropsEnhancer<UseTreeItem2ContentSlotOwnProps>;
  dragAndDropOverlay?: TreeViewItemPluginSlotPropsEnhancer<UseTreeItem2DragAndDropOverlaySlotOwnProps>;
  labelInput?: TreeViewItemPluginSlotPropsEnhancer<UseTreeItem2LabelInputSlotOwnProps>;
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

export type TreeViewItemPlugin<TProps extends {}> = (
  options: TreeViewItemPluginOptions<TProps>,
) => void | TreeViewItemPluginResponse;
