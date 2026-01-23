'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { EventHandlers } from '@mui/utils/types';
import extractEventHandlers from '@mui/utils/extractEventHandlers';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { TreeViewCancellableEvent, TreeViewItemId } from '../models';
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
  UseTreeItemDragAndDropOverlaySlotProps,
  UseTreeItemRootSlotPropsFromUseTreeItem,
  UseTreeItemContentSlotPropsFromUseTreeItem,
  UseTreeItemErrorContainerSlotProps,
  UseTreeItemLoadingContainerSlotProps,
} from './useTreeItem.types';
import { useTreeViewContext } from '../internals/TreeViewProvider';
import {
  TreeViewItemPluginSlotPropsEnhancerParams,
  TreeViewAnyStore,
  TreeViewPublicAPI,
} from '../internals/models';
import { useTreeItemUtils } from '../hooks/useTreeItemUtils';
import { TreeViewItemDepthContext } from '../internals/TreeViewItemDepthContext';
import { isTargetInDescendants } from '../internals/utils/tree';
import { focusSelectors } from '../internals/plugins/focus';
import { itemsSelectors } from '../internals/plugins/items';
import { idSelectors } from '../internals/plugins/id';
import { expansionSelectors } from '../internals/plugins/expansion';
import { selectionSelectors } from '../internals/plugins/selection';
import { RichTreeViewStore } from '../internals/RichTreeViewStore';
import { MinimalTreeViewState } from '../internals/MinimalTreeViewStore';

// TODO v8: Remove the lazy loading plugin from the typing on the community useTreeItem and ask users to pass the TStore generic.
interface DefaultStore extends RichTreeViewStore<any, any> {
  buildPublicAPI: () => TreeViewPublicAPI<RichTreeViewStore<any, any>> & {
    /**
     * Method used for updating an item's children.
     * Only relevant for lazy-loaded tree views.
     *
     * @param {TreeViewItemId} itemId The The id of the item to update the children of.
     * @returns {Promise<void>} The promise resolved when the items are fetched.
     */
    updateItemChildren: (itemId: TreeViewItemId) => Promise<void>;
  };
}

const depthSelector = (
  state: MinimalTreeViewState<any, any>,
  itemId: string,
  depthContext: number | ((state: MinimalTreeViewState<any, any>, itemId: string) => number),
) => {
  if (typeof depthContext === 'function') {
    return depthContext(state, itemId);
  }
  return depthContext;
};

export const useTreeItem = <TStore extends TreeViewAnyStore = DefaultStore>(
  parameters: UseTreeItemParameters,
): UseTreeItemReturnValue<TStore> => {
  const { runItemPlugins, publicAPI, store } = useTreeViewContext<TStore>();
  const depthContext = React.useContext(TreeViewItemDepthContext);

  const depth = useStore(store, depthSelector, parameters.itemId, depthContext);

  const { id, itemId, label, children, rootRef } = parameters;

  const { rootRef: pluginRootRef, contentRef, propsEnhancers } = runItemPlugins(parameters);
  const { interactions, status } = useTreeItemUtils({ itemId, children });
  const rootRefObject = React.useRef<HTMLLIElement>(null);
  const contentRefObject = React.useRef<HTMLDivElement>(null);
  const handleRootRef = useMergedRefs(rootRef, pluginRootRef, rootRefObject)!;
  const handleContentRef = useMergedRefs(contentRef, contentRefObject)!;
  const checkboxRef = React.useRef<HTMLButtonElement>(null);

  const isCheckboxSelectionEnabled = useStore(store, selectionSelectors.isCheckboxSelectionEnabled);
  const idAttribute = useStore(store, idSelectors.treeItemIdAttribute, itemId, id);
  const shouldBeAccessibleWithTab = useStore(
    store,
    focusSelectors.isItemTheDefaultFocusableItem,
    itemId,
  );
  const itemHeight = useStore(store, itemsSelectors.itemHeight);

  const sharedPropsEnhancerParams: Omit<
    TreeViewItemPluginSlotPropsEnhancerParams,
    'externalEventHandlers'
  > = { rootRefObject, contentRefObject, interactions };

  const createRootHandleFocus =
    (otherHandlers: EventHandlers) =>
    (event: React.FocusEvent<HTMLElement> & TreeViewCancellableEvent) => {
      otherHandlers.onFocus?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }

      if (
        !status.focused &&
        itemsSelectors.canItemBeFocused(store.state, itemId) &&
        event.currentTarget === event.target
      ) {
        store.focus.focusItem(event, itemId);
      }
    };

  const createRootHandleBlur =
    (otherHandlers: EventHandlers) =>
    (event: React.FocusEvent<HTMLElement> & TreeViewCancellableEvent) => {
      otherHandlers.onBlur?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }

      const rootElement = store.items.getItemDOMElement(itemId);

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

      store.focus.removeFocusedItem();
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

      store.keyboardNavigation.handleItemKeyDown(event, itemId);
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
      store.items.handleItemClick(event, itemId);

      if (event.defaultMuiPrevented || checkboxRef.current?.contains(event.target as HTMLElement)) {
        return;
      }
      if (expansionSelectors.triggerSlot(store.state) === 'content') {
        interactions.handleExpansion(event);
      }

      if (!isCheckboxSelectionEnabled) {
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
      if (expansionSelectors.triggerSlot(store.state) === 'iconContainer') {
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

    const props: UseTreeItemRootSlotPropsFromUseTreeItem = {
      ...externalEventHandlers,
      ref: handleRootRef,
      role: 'treeitem',
      tabIndex: shouldBeAccessibleWithTab ? 0 : -1,
      id: idAttribute,
      'aria-expanded': status.expandable ? status.expanded : undefined,
      'aria-disabled': status.disabled || undefined,
      ...externalProps,
      style: {
        ...(externalProps.style ?? {}),
        '--TreeView-itemDepth': depth,
        ...(itemHeight == null ? {} : { '--TreeView-itemHeight': `${itemHeight}px` }),
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

    (['expanded', 'selected', 'focused', 'disabled', 'editing', 'editable'] as const).forEach(
      (key) => {
        if (status[key]) {
          props[`data-${key}`] = '';
        }
      },
    );

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
      'aria-hidden': true,
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

    const enhancedLabelProps =
      propsEnhancers.label?.({
        ...sharedPropsEnhancerParams,
        externalEventHandlers,
      }) ?? {};

    return {
      ...enhancedLabelProps,
      ...props,
    };
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

  const getErrorContainerProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemErrorContainerSlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    return {
      ...externalEventHandlers,
      ...externalProps,
    };
  };
  const getLoadingContainerProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemLoadingContainerSlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    return {
      size: '12px',
      thickness: 6,
      ...externalEventHandlers,
      ...externalProps,
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
    getErrorContainerProps,
    getLoadingContainerProps,
    rootRef: handleRootRef,
    status,
    publicAPI,
  };
};
