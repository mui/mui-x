import * as React from 'react';
import { TreeViewItemId } from '@mui/x-tree-view';
import { SlotComponentProps } from '@mui/base/utils/types';

export interface UseTreeItemParameters {
  /**
   * The id attribute of the node. If not provided, it will be generated.
   */
  id?: string;
  /**
   * The id of the node.
   * Must be unique.
   */
  nodeId: TreeViewItemId;
  /**
   * The label of the node.
   */
  label?: React.ReactNode;
  rootRef?: React.Ref<HTMLLIElement>;
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
}

export interface UseTreeItemRootSlotOwnProps {
  role: 'treeitem';
  tabIndex: -1;
  id: string;
  'aria-expanded': React.AriaAttributes['aria-expanded'];
  'aria-selected': React.AriaAttributes['aria-selected'];
  'aria-disabled': React.AriaAttributes['aria-disabled'];
}

export type UseTreeItemRootSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemRootSlotOwnProps;

export interface UseTreeItemContentSlotOwnProps {}

export type UseTreeItemContentSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemContentSlotOwnProps;

export interface UseTreeItemLabelSlotOwnProps {}

export type UseTreeItemLabelSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemLabelSlotOwnProps;

export interface UseTreeItemGroupSlotOwnProps {
  unmountOnExit: boolean;
  in: boolean;
  component: 'ul';
  role: 'group';
  children: React.ReactNode;
}

export type UseTreeItemGroupSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemGroupSlotOwnProps;

export interface UseTreeItemStatus {
  expandable: boolean;
  expanded: boolean;
  focused: boolean;
  selected: boolean;
  disabled: boolean;
}

export interface UseTreeItemReturnValue {
  /**
   * Resolver for the root slot's props.
   * @param {ExternalProps} externalProps additional props for the root slot
   * @returns {UseTreeItemRootSlotProps<ExternalProps>} props that should be spread on the root slot
   */
  getRootProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItemRootSlotProps<ExternalProps>;
  /**
   * Resolver for the content slot's props.
   * @param {ExternalProps} externalProps additional props for the content slot
   * @returns {UseTreeItemContentSlotProps<ExternalProps>} props that should be spread on the content slot
   */
  getContentProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItemContentSlotProps<ExternalProps>;
  /**
   * Resolver for the label slot's props.
   * @param {ExternalProps} externalProps additional props for the label slot
   * @returns {UseTreeItemContentSlotProps<ExternalProps>} props that should be spread on the label slot
   */
  getLabelProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItemLabelSlotProps<ExternalProps>;
  /**
   * Resolver for the group slot's props.
   * @param {ExternalProps} externalProps additional props for the group slot
   * @returns {UseTreeItemGroupSlotProps<ExternalProps>} props that should be spread on the group slot
   */
  getGroupProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItemGroupSlotProps<ExternalProps>;
  /**
   * A ref to the component's root DOM element.
   */
  rootRef: React.RefCallback<HTMLLIElement> | null;
  /**
   * Render function used to add React wrappers around the TreeItem.
   * @param {React.ReactNode} children The TreeItem node before this plugin execution.
   * @returns {React.ReactNode} The wrapped TreeItem.
   */
  wrapItem?: (children: React.ReactNode) => React.ReactNode;
  /**
   * Current status of the item.
   */
  status: UseTreeItemStatus;
  /**
   * The icon to render if no icon has been provided directly to the item.
   * This icon is passed by the Tree View component and based on the current status of the item.
   */
  fallbackIcon: React.ElementType | undefined;
  /**
   * The props to add to the rendered icon if no icon has been provided directly to the item.
   * The props are passed by the Tree View component and based on the current status of the item.
   */
  fallbackIconProps: SlotComponentProps<'svg', {}, {}> | undefined;
}
