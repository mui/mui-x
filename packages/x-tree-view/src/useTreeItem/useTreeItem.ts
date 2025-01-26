'use client';
import * as React from 'react';
import { EventHandlers } from '@mui/utils/types';
import extractEventHandlers from '@mui/utils/extractEventHandlers';
import useForkRef from '@mui/utils/useForkRef';
import { TreeViewCancellableEvent } from '../models';
import {
  UseTreeItemParameters,
  UseTreeItemReturnValue,
  UseTreeItemRootSlotProps,
  UseTreeItemContentSlotProps,
  UseTreeItemGroupTransitionSlotProps,
  UseTreeItemLabelSlotProps,
  UseTreeItemIconContainerSlotProps,
  UseTreeItemCheckboxSlotProps,
  UseTreeItemLabelInputSlotProps,
  UseTreeItemMinimalPlugins,
  UseTreeItemOptionalPlugins,
  UseTreeItemDragAndDropOverlaySlotProps,
  UseTreeItemRootSlotPropsFromUseTreeItem,
  UseTreeItemContentSlotPropsFromUseTreeItem,
} from './useTreeItem.types';
import { useTreeViewContext } from '../internals/TreeViewProvider';
import { TreeViewItemPluginSlotPropsEnhancerParams } from '../internals/models';
import { useTreeItemUtils } from '../hooks/useTreeItemUtils';
import { TreeViewItemDepthContext } from '../internals/TreeViewItemDepthContext';
import { isTargetInDescendants } from '../internals/utils/tree';
import { useSelector } from '../internals/hooks/useSelector';
import { selectorIsItemTheDefaultFocusableItem } from '../internals/plugins/useTreeViewFocus/useTreeViewFocus.selectors';
import { generateTreeItemIdAttribute } from '../internals/corePlugins/useTreeViewId/useTreeViewId.utils';
import { selectorCanItemBeFocused } from '../internals/plugins/useTreeViewItems/useTreeViewItems.selectors';
import { selectorTreeViewId } from '../internals/corePlugins/useTreeViewId/useTreeViewId.selectors';
import { selectorItemExpansionTrigger } from '../internals/plugins/useTreeViewExpansion/useTreeViewExpansion.selectors';

export const useTreeItem = <
  TSignatures extends UseTreeItemMinimalPlugins = UseTreeItemMinimalPlugins,
  TOptionalSignatures extends UseTreeItemOptionalPlugins = UseTreeItemOptionalPlugins,
>(
  parameters: UseTreeItemParameters,
): UseTreeItemReturnValue<TSignatures, TOptionalSignatures> => {
  const {
    runItemPlugins,
    items: { onItemClick },
    selection: { disableSelection, checkboxSelection },
    label: labelContext,
    instance,
    publicAPI,
    store,
  } = useTreeViewContext<TSignatures, TOptionalSignatures>();
  const depthContext = React.useContext(TreeViewItemDepthContext);

  const depth = useSelector(
    store,
    (...params) => {
      if (typeof depthContext === 'function') {
        return depthContext(...params);
      }

      return depthContext;
    },
    parameters.itemId,
  );

  const { id, itemId, label, children, rootRef } = parameters;

  const { rootRef: pluginRootRef, contentRef, propsEnhancers } = runItemPlugins(parameters);
  const { interactions, status } = useTreeItemUtils({ itemId, children });
  const rootRefObject = React.useRef<HTMLLIElement>(null);
  const contentRefObject = React.useRef<HTMLDivElement>(null);
  const handleRootRef = useForkRef(rootRef, pluginRootRef, rootRefObject)!;
  const handleContentRef = useForkRef(contentRef, contentRefObject)!;
  const checkboxRef = React.useRef<HTMLButtonElement>(null);

  const treeId = useSelector(store, selectorTreeViewId);
  const idAttribute = generateTreeItemIdAttribute({ itemId, treeId, id });
  const shouldBeAccessibleWithTab = useSelector(
    store,
    selectorIsItemTheDefaultFocusableItem,
    itemId,
  );

  const sharedPropsEnhancerParams: Omit<
    TreeViewItemPluginSlotPropsEnhancerParams,
    'externalEventHandlers'
  > = { rootRefObject, contentRefObject, interactions, status };

  const createRootHandleFocus =
    (otherHandlers: EventHandlers) =>
    (event: React.FocusEvent<HTMLElement> & TreeViewCancellableEvent) => {
      otherHandlers.onFocus?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }

      if (
        !status.focused &&
        selectorCanItemBeFocused(store.value, itemId) &&
        event.currentTarget === event.target
      ) {
        instance.focusItem(event, itemId);
      }
    };

  const createRootHandleBlur =
    (otherHandlers: EventHandlers) =>
    (event: React.FocusEvent<HTMLElement> & TreeViewCancellableEvent) => {
      otherHandlers.onBlur?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }

      const rootElement = instance.getItemDOMElement(itemId);

      // Don't blur the root when switching to editing mode
      // the input that triggers the root blur can be either the relatedTarget (when entering editing state) or the target (when exiting editing state)
      // when we enter the editing state, we focus the input -> we don't want to remove the focused item from the state
      if (
        status.editing ||
        // we can exit the editing state by clicking outside the input (within the Tree Item) or by pressing Enter or Escape -> we don't want to remove the focused item from the state in these cases
        // we can also exit the editing state by clicking on the root itself -> want to remove the focused item from the state in this case
        (event.relatedTarget &&
          isTargetInDescendants(event.relatedTarget as HTMLElement, rootElement) &&
          ((event.target &&
            (event.target as HTMLElement)?.dataset?.element === 'labelInput' &&
            isTargetInDescendants(event.target as HTMLElement, rootElement)) ||
            (event.relatedTarget as HTMLElement)?.dataset?.element === 'labelInput'))
      ) {
        return;
      }

      instance.removeFocusedItem();
    };

  const createRootHandleKeyDown =
    (otherHandlers: EventHandlers) =>
    (event: React.KeyboardEvent<HTMLElement> & TreeViewCancellableEvent) => {
      otherHandlers.onKeyDown?.(event);
      if (
        event.defaultMuiPrevented ||
        (event.target as HTMLElement)?.dataset?.element === 'labelInput'
      ) {
        return;
      }

      instance.handleItemKeyDown(event, itemId);
    };

  const createLabelHandleDoubleClick =
    (otherHandlers: EventHandlers) => (event: React.MouseEvent & TreeViewCancellableEvent) => {
      otherHandlers.onDoubleClick?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }
      interactions.toggleItemEditing();
    };

  const createContentHandleClick =
    (otherHandlers: EventHandlers) => (event: React.MouseEvent & TreeViewCancellableEvent) => {
      otherHandlers.onClick?.(event);
      onItemClick(event, itemId);

      if (event.defaultMuiPrevented || checkboxRef.current?.contains(event.target as HTMLElement)) {
        return;
      }
      if (selectorItemExpansionTrigger(store.value) === 'content') {
        interactions.handleExpansion(event);
      }

      if (!checkboxSelection) {
        interactions.handleSelection(event);
      }
    };

  const createContentHandleMouseDown =
    (otherHandlers: EventHandlers) => (event: React.MouseEvent & TreeViewCancellableEvent) => {
      otherHandlers.onMouseDown?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }

      // Prevent text selection
      if (event.shiftKey || event.ctrlKey || event.metaKey || status.disabled) {
        event.preventDefault();
      }
    };

  const createIconContainerHandleClick =
    (otherHandlers: EventHandlers) => (event: React.MouseEvent & TreeViewCancellableEvent) => {
      otherHandlers.onClick?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }
      if (selectorItemExpansionTrigger(store.value) === 'iconContainer') {
        interactions.handleExpansion(event);
      }
    };

  const getContextProviderProps = () => ({ itemId, id });

  const getRootProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemRootSlotProps<ExternalProps> => {
    const externalEventHandlers = {
      ...extractEventHandlers(parameters),
      ...extractEventHandlers(externalProps),
    };

    // https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
    let ariaSelected: boolean | undefined;
    if (status.selected) {
      // - each selected node has aria-selected set to true.
      ariaSelected = true;
    } else if (disableSelection || status.disabled) {
      // - if the tree contains nodes that are not selectable, aria-selected is not present on those nodes.
      ariaSelected = undefined;
    } else {
      // - all nodes that are selectable but not selected have aria-selected set to false.
      ariaSelected = false;
    }

    const props: UseTreeItemRootSlotPropsFromUseTreeItem = {
      ...externalEventHandlers,
      ref: handleRootRef,
      role: 'treeitem',
      tabIndex: shouldBeAccessibleWithTab ? 0 : -1,
      id: idAttribute,
      'aria-expanded': status.expandable ? status.expanded : undefined,
      'aria-selected': ariaSelected,
      'aria-disabled': status.disabled || undefined,
      ...externalProps,
      style: {
        ...(externalProps.style ?? {}),
        '--TreeView-itemDepth': depth,
      } as React.CSSProperties,
      onFocus: createRootHandleFocus(externalEventHandlers),
      onBlur: createRootHandleBlur(externalEventHandlers),
      onKeyDown: createRootHandleKeyDown(externalEventHandlers),
    };

    const enhancedRootProps =
      propsEnhancers.root?.({ ...sharedPropsEnhancerParams, externalEventHandlers }) ?? {};

    return {
      ...props,
      ...enhancedRootProps,
    } as UseTreeItemRootSlotProps<ExternalProps>;
  };

  const getContentProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemContentSlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    const props: UseTreeItemContentSlotPropsFromUseTreeItem = {
      ...externalEventHandlers,
      ...externalProps,
      ref: handleContentRef,
      onClick: createContentHandleClick(externalEventHandlers),
      onMouseDown: createContentHandleMouseDown(externalEventHandlers),
      status,
    };

    const enhancedContentProps =
      propsEnhancers.content?.({ ...sharedPropsEnhancerParams, externalEventHandlers }) ?? {};

    return {
      ...props,
      ...enhancedContentProps,
    } as UseTreeItemContentSlotProps<ExternalProps>;
  };

  const getCheckboxProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemCheckboxSlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    const props = {
      ...externalEventHandlers,
      ref: checkboxRef,
      ...externalProps,
    };

    const enhancedCheckboxProps =
      propsEnhancers.checkbox?.({
        ...sharedPropsEnhancerParams,
        externalEventHandlers,
      }) ?? {};

    return {
      ...props,
      ...enhancedCheckboxProps,
    };
  };

  const getLabelProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemLabelSlotProps<ExternalProps> => {
    const externalEventHandlers = {
      ...extractEventHandlers(externalProps),
    };

    const props: UseTreeItemLabelSlotProps<ExternalProps> = {
      ...externalEventHandlers,
      children: label,
      ...externalProps,
      onDoubleClick: createLabelHandleDoubleClick(externalEventHandlers),
    };

    if (labelContext?.isItemEditable) {
      props.editable = status.editable;
    }

    return props;
  };

  const getLabelInputProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemLabelInputSlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    const enhancedLabelInputProps =
      propsEnhancers.labelInput?.({
        ...sharedPropsEnhancerParams,
        externalEventHandlers,
      }) ?? {};

    return {
      ...externalProps,
      ...enhancedLabelInputProps,
    } as UseTreeItemLabelInputSlotProps<ExternalProps>;
  };

  const getIconContainerProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemIconContainerSlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    return {
      ...externalEventHandlers,
      ...externalProps,
      onClick: createIconContainerHandleClick(externalEventHandlers),
    };
  };

  const getGroupTransitionProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemGroupTransitionSlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    const response: UseTreeItemGroupTransitionSlotProps<ExternalProps> = {
      ...externalEventHandlers,
      unmountOnExit: true,
      component: 'ul',
      role: 'group',
      in: status.expanded,
      children,
      ...externalProps,
    };

    return response;
  };

  const getDragAndDropOverlayProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemDragAndDropOverlaySlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    const enhancedDragAndDropOverlayProps =
      propsEnhancers.dragAndDropOverlay?.({
        ...sharedPropsEnhancerParams,
        externalEventHandlers,
      }) ?? {};

    return {
      ...externalProps,
      ...enhancedDragAndDropOverlayProps,
    } as UseTreeItemDragAndDropOverlaySlotProps<ExternalProps>;
  };

  return {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getGroupTransitionProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getLabelInputProps,
    getDragAndDropOverlayProps,
    rootRef: handleRootRef,
    status,
    publicAPI,
  };
};
