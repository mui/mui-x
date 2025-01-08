import * as React from 'react';
import { TreeViewItemId, TreeViewCancellableEventHandler } from '../models';
import { TreeViewPublicAPI } from '../internals/models';
import { UseTreeViewSelectionSignature } from '../internals/plugins/useTreeViewSelection';
import { UseTreeViewItemsSignature } from '../internals/plugins/useTreeViewItems';
import { UseTreeViewFocusSignature } from '../internals/plugins/useTreeViewFocus';
import { UseTreeViewKeyboardNavigationSignature } from '../internals/plugins/useTreeViewKeyboardNavigation';
import { UseTreeViewLabelSignature } from '../internals/plugins/useTreeViewLabel';
import { UseTreeViewExpansionSignature } from '../internals/plugins/useTreeViewExpansion';

export interface UseTreeItemParameters {
  /**
   * The id attribute of the item. If not provided, it will be generated.
   */
  id?: string;
  /**
   * If `true`, the item is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The id of the item.
   * Must be unique.
   */
  itemId: TreeViewItemId;
  /**
   * The label of the item.
   */
  label?: React.ReactNode;
  rootRef?: React.Ref<HTMLLIElement>;
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
}

export interface UseTreeItemContextProviderProps {
  itemId: string;
  id: string | undefined;
}

export interface UseTreeItemRootSlotPropsFromUseTreeItem {
  role: 'treeitem';
  tabIndex: 0 | -1;
  id: string;
  'aria-expanded': React.AriaAttributes['aria-expanded'];
  'aria-selected': React.AriaAttributes['aria-selected'];
  'aria-disabled': React.AriaAttributes['aria-disabled'];
  onFocus: TreeViewCancellableEventHandler<React.FocusEvent<HTMLElement>>;
  onBlur: TreeViewCancellableEventHandler<React.FocusEvent<HTMLElement>>;
  onKeyDown: TreeViewCancellableEventHandler<React.KeyboardEvent<HTMLElement>>;
  ref: React.RefCallback<HTMLLIElement>;
  style: React.CSSProperties;
}

export interface UseTreeItemRootSlotOwnProps extends UseTreeItemRootSlotPropsFromUseTreeItem {}

export type UseTreeItemRootSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemRootSlotOwnProps;

export interface UseTreeItemContentSlotPropsFromUseTreeItem {
  onClick: TreeViewCancellableEventHandler<React.MouseEvent>;
  onMouseDown: TreeViewCancellableEventHandler<React.MouseEvent>;
  ref: React.RefCallback<HTMLDivElement> | null;
  status: UseTreeItemStatus;
}

export interface UseTreeItemContentSlotOwnProps
  extends UseTreeItemContentSlotPropsFromUseTreeItem {}

export type UseTreeItemContentSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemContentSlotOwnProps;

export interface UseTreeItemIconContainerSlotOwnProps {
  onClick: TreeViewCancellableEventHandler<React.MouseEvent>;
}

export type UseTreeItemIconContainerSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemIconContainerSlotOwnProps;

export interface UseTreeItemLabelSlotOwnProps {
  children: React.ReactNode;
  onDoubleClick: TreeViewCancellableEventHandler<React.MouseEvent>;
  /**
   * Only defined when the `isItemEditable` experimental feature is enabled.
   */
  editable?: boolean;
}

export type UseTreeItemLabelSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemLabelSlotOwnProps;

export interface UseTreeItemLabelInputSlotOwnProps {}

export type UseTreeItemLabelInputSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemLabelInputSlotOwnProps;

export interface UseTreeItemCheckboxSlotOwnProps {
  ref: React.RefObject<HTMLButtonElement | null>;
}

export type UseTreeItemCheckboxSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemCheckboxSlotOwnProps;

export interface UseTreeItemGroupTransitionSlotOwnProps {
  unmountOnExit: boolean;
  in: boolean;
  component: 'ul';
  role: 'group';
  children: React.ReactNode;
}

export type UseTreeItemGroupTransitionSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemGroupTransitionSlotOwnProps;

export interface UseTreeItemDragAndDropOverlaySlotOwnProps {}

export type UseTreeItemDragAndDropOverlaySlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItemDragAndDropOverlaySlotOwnProps;

export interface UseTreeItemStatus {
  expandable: boolean;
  expanded: boolean;
  focused: boolean;
  selected: boolean;
  disabled: boolean;
  editing: boolean;
  editable: boolean;
}

export interface UseTreeItemReturnValue<
  TSignatures extends UseTreeItemMinimalPlugins,
  TOptionalSignatures extends UseTreeItemOptionalPlugins,
> {
  /**
   * Resolver for the context provider's props.
   * @returns {UseTreeItemContextProviderProps} Props that should be spread on the context provider slot.
   */
  getContextProviderProps: () => UseTreeItemContextProviderProps;
  /**
   * Resolver for the root slot's props.
   * @param {ExternalProps} externalProps Additional props for the root slot.
   * @returns {UseTreeItemRootSlotProps<ExternalProps>} Props that should be spread on the root slot.
   */
  getRootProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItemRootSlotProps<ExternalProps>;
  /**
   * Resolver for the content slot's props.
   * @param {ExternalProps} externalProps Additional props for the content slot.
   * @returns {UseTreeItemContentSlotProps<ExternalProps>} Props that should be spread on the content slot.
   */
  getContentProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItemContentSlotProps<ExternalProps>;
  /**
   * Resolver for the label slot's props.
   * @param {ExternalProps} externalProps Additional props for the label slot.
   * @returns {UseTreeItemLabelSlotProps<ExternalProps>} Props that should be spread on the label slot.
   */
  getLabelProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItemLabelSlotProps<ExternalProps>;
  /**
   * Resolver for the labelInput slot's props.
   * @param {ExternalProps} externalProps Additional props for the labelInput slot.
   * @returns {UseTreeItemLabelInputSlotProps<ExternalProps>} Props that should be spread on the labelInput slot.
   */
  getLabelInputProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItemLabelInputSlotProps<ExternalProps>;
  /**
   * Resolver for the checkbox slot's props.
   * @param {ExternalProps} externalProps Additional props for the checkbox slot.
   * @returns {UseTreeItemCheckboxSlotProps<ExternalProps>} Props that should be spread on the checkbox slot.
   */
  getCheckboxProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItemCheckboxSlotProps<ExternalProps>;
  /**
   * Resolver for the iconContainer slot's props.
   * @param {ExternalProps} externalProps Additional props for the iconContainer slot.
   * @returns {UseTreeItemIconContainerSlotProps<ExternalProps>} Props that should be spread on the iconContainer slot.
   */
  getIconContainerProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItemIconContainerSlotProps<ExternalProps>;
  /**
   * Resolver for the GroupTransition slot's props.
   * @param {ExternalProps} externalProps Additional props for the GroupTransition slot.
   * @returns {UseTreeItemGroupTransitionSlotProps<ExternalProps>} Props that should be spread on the GroupTransition slot.
   */
  getGroupTransitionProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItemGroupTransitionSlotProps<ExternalProps>;
  /**
   * Resolver for the DragAndDropOverlay slot's props.
   * Warning: This slot is only useful when using the `<RichTreeViewPro />` component.
   * @param {ExternalProps} externalProps Additional props for the DragAndDropOverlay slot.
   * @returns {UseTreeItemDragAndDropOverlaySlotProps<ExternalProps>} Props that should be spread on the DragAndDropOverlay slot.
   */
  getDragAndDropOverlayProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItemDragAndDropOverlaySlotProps<ExternalProps>;
  /**
   * A ref to the component's root DOM element.
   */
  rootRef: React.RefCallback<HTMLLIElement> | null;
  /**
   * Current status of the item.
   */
  status: UseTreeItemStatus;
  /**
   * The object the allows Tree View manipulation.
   */
  publicAPI: TreeViewPublicAPI<TSignatures, TOptionalSignatures>;
}

/**
 * Plugins that need to be present in the Tree View in order for `UseTreeItem` to work correctly.
 */
export type UseTreeItemMinimalPlugins = readonly [
  UseTreeViewSelectionSignature,
  UseTreeViewExpansionSignature,
  UseTreeViewItemsSignature,
  UseTreeViewFocusSignature,
  UseTreeViewKeyboardNavigationSignature,
  UseTreeViewLabelSignature,
];

/**
 * Plugins that `UseTreeItem` can use if they are present, but are not required.
 */
export type UseTreeItemOptionalPlugins = readonly [];
