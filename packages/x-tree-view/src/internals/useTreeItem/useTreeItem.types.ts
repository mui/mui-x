import * as React from 'react';

export interface UseTreeItemParameters {
  id?: string;
  nodeId: string;
  rootRef?: React.Ref<HTMLLIElement>;
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

export interface UseTreeItemTransitionSlotOwnProps {
  unmountOnExit: boolean;
  in: boolean;
  component: 'ul';
  role: 'group';
}

export type UseTreeItemTransitionSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemTransitionSlotOwnProps;

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
   * Resolver for the transition slot's props.
   * @param {ExternalProps} externalProps additional props for the transition slot
   * @returns {UseTreeItemTransitionSlotProps<ExternalProps>} props that should be spread on the transition slot
   */
  getTransitionProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItemTransitionSlotProps<ExternalProps>;
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
}
