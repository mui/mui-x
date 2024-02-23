import * as React from 'react';
import { TreeViewItemId } from '@mui/x-tree-view';
import { MuiCancellableEventHandler } from '../models/MuiCancellableEvent';

export interface UseTreeItemParameters {
  /**
   * The id attribute of the node. If not provided, it will be generated.
   */
  id?: string;
  /**
   * If `true`, the node is disabled.
   * @default false
   */
  disabled?: boolean;
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
  onFocus: MuiCancellableEventHandler<React.FocusEvent>;
  ref: React.RefCallback<HTMLLIElement>;
}

export type UseTreeItemRootSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemRootSlotOwnProps;

export interface UseTreeItemContentSlotOwnProps {
  onClick: MuiCancellableEventHandler<React.MouseEvent>;
  onMouseDown: MuiCancellableEventHandler<React.MouseEvent>;
  ref: React.RefCallback<HTMLDivElement> | null;
  status: UseTreeItemStatus;
}

export type UseTreeItemContentSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemContentSlotOwnProps;

export interface UseTreeItemIconContainerSlotOwnProps {}

export type UseTreeItemIconContainerSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemIconContainerSlotOwnProps;

export interface UseTreeItemLabelSlotOwnProps {
  children: React.ReactNode;
}

export type UseTreeItemLabelSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemLabelSlotOwnProps;

export interface UseTreeItemGroupTransitionSlotOwnProps {
  unmountOnExit: boolean;
  in: boolean;
  component: 'ul';
  role: 'GroupTransition';
  children: React.ReactNode;
}

export type UseTreeItemGroupTransitionSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemGroupTransitionSlotOwnProps;

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
   * @returns {UseTreeItemLabelSlotProps<ExternalProps>} props that should be spread on the label slot
   */
  getLabelProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItemLabelSlotProps<ExternalProps>;
  /**
   * Resolver for the iconContainer slot's props.
   * @param {ExternalProps} externalProps additional props for the iconContainer slot
   * @returns {UseTreeItemIconContainerSlotProps<ExternalProps>} props that should be spread on the iconContainer slot
   */
  getIconContainerProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItemIconContainerSlotProps<ExternalProps>;
  /**
   * Resolver for the GroupTransition slot's props.
   * @param {ExternalProps} externalProps additional props for the GroupTransition slot
   * @returns {UseTreeItemGroupTransitionSlotProps<ExternalProps>} props that should be spread on the GroupTransition slot
   */
  getGroupTransitionProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItemGroupTransitionSlotProps<ExternalProps>;
  /**
   * A ref to the component's root DOM element.
   */
  rootRef: React.RefCallback<HTMLLIElement> | null;
  /**
   * Current status of the item.
   */
  status: UseTreeItemStatus;
}
