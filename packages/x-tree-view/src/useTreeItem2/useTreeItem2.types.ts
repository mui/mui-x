import * as React from 'react';
import { TreeViewItemId } from '../models';
import { TreeViewPublicAPI, MuiCancellableEventHandler } from '../internals/models';
import { UseTreeViewSelectionSignature } from '../internals/plugins/useTreeViewSelection';
import { UseTreeViewItemsSignature } from '../internals/plugins/useTreeViewItems';
import { UseTreeViewFocusSignature } from '../internals/plugins/useTreeViewFocus';
import { UseTreeViewKeyboardNavigationSignature } from '../internals/plugins/useTreeViewKeyboardNavigation';
import { UseTreeViewLabelSignature } from '../internals/plugins/useTreeViewLabel';
import { UseTreeViewExpansionSignature } from '../internals/plugins/useTreeViewExpansion';

export interface UseTreeItem2Parameters {
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

export interface UseTreeItem2RootSlotPropsFromUseTreeItem {
  role: 'treeitem';
  tabIndex: 0 | -1;
  id: string;
  'aria-expanded': React.AriaAttributes['aria-expanded'];
  'aria-selected': React.AriaAttributes['aria-selected'];
  'aria-disabled': React.AriaAttributes['aria-disabled'];
  onFocus: MuiCancellableEventHandler<React.FocusEvent<HTMLElement>>;
  onBlur: MuiCancellableEventHandler<React.FocusEvent<HTMLElement>>;
  onKeyDown: MuiCancellableEventHandler<React.KeyboardEvent<HTMLElement>>;
  ref: React.RefCallback<HTMLLIElement>;
  /**
   * Only defined when the `indentationAtItemLevel` experimental feature is enabled.
   */
  style?: React.CSSProperties;
}

export interface UseTreeItem2RootSlotOwnProps extends UseTreeItem2RootSlotPropsFromUseTreeItem {}

export type UseTreeItem2RootSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItem2RootSlotOwnProps;

export interface UseTreeItem2ContentSlotPropsFromUseTreeItem {
  onClick: MuiCancellableEventHandler<React.MouseEvent>;
  onMouseDown: MuiCancellableEventHandler<React.MouseEvent>;
  ref: React.RefCallback<HTMLDivElement> | null;
  status: UseTreeItem2Status;
  /**
   * Only defined when the `indentationAtItemLevel` experimental feature is enabled.
   */
  indentationAtItemLevel?: true;
}

export interface UseTreeItem2ContentSlotOwnProps
  extends UseTreeItem2ContentSlotPropsFromUseTreeItem {}

export type UseTreeItem2ContentSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItem2ContentSlotOwnProps;

export interface UseTreeItem2IconContainerSlotOwnProps {
  onClick: MuiCancellableEventHandler<React.MouseEvent>;
}

export type UseTreeItemIconContainerSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItem2IconContainerSlotOwnProps;

export interface UseTreeItem2LabelSlotOwnProps {
  children: React.ReactNode;
  onDoubleClick: MuiCancellableEventHandler<React.MouseEvent>;
  /**
   * Only defined when the `isItemEditable` experimental feature is enabled.
   */
  editable?: boolean;
}

export type UseTreeItem2LabelSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItem2LabelSlotOwnProps;

export type UseTreeItem2LabelInputSlotOwnProps = {
  onBlur: MuiCancellableEventHandler<React.FocusEvent<HTMLInputElement>>;
  onKeyDown: MuiCancellableEventHandler<React.KeyboardEvent<HTMLInputElement>>;
};

export type UseTreeItem2LabelInputSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItem2LabelInputSlotOwnProps;

export interface UseTreeItem2CheckboxSlotOwnProps {
  visible: boolean;
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  disabled: boolean;
  ref: React.RefObject<HTMLButtonElement>;
  tabIndex: -1;
}

export type UseTreeItem2CheckboxSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItem2CheckboxSlotOwnProps;

export interface UseTreeItem2GroupTransitionSlotOwnProps {
  unmountOnExit: boolean;
  in: boolean;
  component: 'ul';
  role: 'group';
  children: React.ReactNode;
  /**
   * Only defined when the `indentationAtItemLevel` experimental feature is enabled.
   */
  indentationAtItemLevel?: true;
}

export type UseTreeItem2GroupTransitionSlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItem2GroupTransitionSlotOwnProps;

export interface UseTreeItem2DragAndDropOverlaySlotOwnProps {}

export type UseTreeItem2DragAndDropOverlaySlotProps<ExternalProps = {}> = ExternalProps &
  UseTreeItem2DragAndDropOverlaySlotOwnProps;

export interface UseTreeItem2Status {
  expandable: boolean;
  expanded: boolean;
  focused: boolean;
  selected: boolean;
  disabled: boolean;
  editing: boolean;
  editable: boolean;
}

export interface UseTreeItem2ReturnValue<
  TSignatures extends UseTreeItem2MinimalPlugins,
  TOptionalSignatures extends UseTreeItem2OptionalPlugins,
> {
  /**
   * Resolver for the root slot's props.
   * @param {ExternalProps} externalProps Additional props for the root slot.
   * @returns {UseTreeItem2RootSlotProps<ExternalProps>} Props that should be spread on the root slot.
   */
  getRootProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItem2RootSlotProps<ExternalProps>;
  /**
   * Resolver for the content slot's props.
   * @param {ExternalProps} externalProps Additional props for the content slot.
   * @returns {UseTreeItem2ContentSlotProps<ExternalProps>} Props that should be spread on the content slot.
   */
  getContentProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItem2ContentSlotProps<ExternalProps>;
  /**
   * Resolver for the label slot's props.
   * @param {ExternalProps} externalProps Additional props for the label slot.
   * @returns {UseTreeItem2LabelSlotProps<ExternalProps>} Props that should be spread on the label slot.
   */
  getLabelProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItem2LabelSlotProps<ExternalProps>;
  /**
   * Resolver for the labelInput slot's props.
   * @param {ExternalProps} externalProps Additional props for the labelInput slot.
   * @returns {UseTreeItem2LabelInputSlotProps<ExternalProps>} Props that should be spread on the labelInput slot.
   */
  getLabelInputProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItem2LabelInputSlotProps<ExternalProps>;
  /**
   * Resolver for the checkbox slot's props.
   * @param {ExternalProps} externalProps Additional props for the checkbox slot.
   * @returns {UseTreeItem2CheckboxSlotProps<ExternalProps>} Props that should be spread on the checkbox slot.
   */
  getCheckboxProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItem2CheckboxSlotProps<ExternalProps>;
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
   * @returns {UseTreeItem2GroupTransitionSlotProps<ExternalProps>} Props that should be spread on the GroupTransition slot.
   */
  getGroupTransitionProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItem2GroupTransitionSlotProps<ExternalProps>;
  /**
   * Resolver for the DragAndDropOverlay slot's props.
   * Warning: This slot is only useful when using the `RichTreeViewPro` component.
   * @param {ExternalProps} externalProps Additional props for the DragAndDropOverlay slot.
   * @returns {UseTreeItem2DragAndDropOverlaySlotProps<ExternalProps>} Props that should be spread on the DragAndDropOverlay slot.
   */
  getDragAndDropOverlayProps: <ExternalProps extends Record<string, any> = {}>(
    externalProps?: ExternalProps,
  ) => UseTreeItem2DragAndDropOverlaySlotProps<ExternalProps>;
  /**
   * A ref to the component's root DOM element.
   */
  rootRef: React.RefCallback<HTMLLIElement> | null;
  /**
   * Current status of the item.
   */
  status: UseTreeItem2Status;
  /**
   * The object the allows Tree View manipulation.
   */
  publicAPI: TreeViewPublicAPI<TSignatures, TOptionalSignatures>;
}

/**
 * Plugins that need to be present in the Tree View in order for `useTreeItem2` to work correctly.
 */
export type UseTreeItem2MinimalPlugins = readonly [
  UseTreeViewSelectionSignature,
  UseTreeViewExpansionSignature,
  UseTreeViewItemsSignature,
  UseTreeViewFocusSignature,
  UseTreeViewKeyboardNavigationSignature,
  UseTreeViewLabelSignature,
];

/**
 * Plugins that `useTreeItem2` can use if they are present, but are not required.
 */
export type UseTreeItem2OptionalPlugins = readonly [];
