import * as React from 'react';
import { EventHandlers } from '@mui/utils';
import extractEventHandlers from '@mui/utils/extractEventHandlers';
import useForkRef from '@mui/utils/useForkRef';
import { TreeViewCancellableEvent } from '../models';
import {
  UseTreeItem2Parameters,
  UseTreeItem2ReturnValue,
  UseTreeItem2RootSlotProps,
  UseTreeItem2ContentSlotProps,
  UseTreeItem2GroupTransitionSlotProps,
  UseTreeItem2LabelSlotProps,
  UseTreeItemIconContainerSlotProps,
  UseTreeItem2CheckboxSlotProps,
  UseTreeItem2LabelInputSlotProps,
  UseTreeItem2MinimalPlugins,
  UseTreeItem2OptionalPlugins,
  UseTreeItem2DragAndDropOverlaySlotProps,
  UseTreeItem2RootSlotPropsFromUseTreeItem,
  UseTreeItem2ContentSlotPropsFromUseTreeItem,
} from './useTreeItem2.types';
import { useTreeViewContext } from '../internals/TreeViewProvider';
import { TreeViewItemPluginSlotPropsEnhancerParams } from '../internals/models';
import { useTreeItem2Utils } from '../hooks/useTreeItem2Utils';
import { TreeViewItemDepthContext } from '../internals/TreeViewItemDepthContext';
import { isTargetInDescendants } from '../internals/utils/tree';
import { generateTreeItemIdAttribute } from '../internals/corePlugins/useTreeViewId/useTreeViewId.utils';

export const useTreeItem2 = <
  TSignatures extends UseTreeItem2MinimalPlugins = UseTreeItem2MinimalPlugins,
  TOptionalSignatures extends UseTreeItem2OptionalPlugins = UseTreeItem2OptionalPlugins,
>(
  parameters: UseTreeItem2Parameters,
): UseTreeItem2ReturnValue<TSignatures, TOptionalSignatures> => {
  const {
    runItemPlugins,
    items: { onItemClick, disabledItemsFocusable, indentationAtItemLevel },
    selection: { disableSelection, checkboxSelection },
    expansion: { expansionTrigger },
    treeId,
    instance,
    publicAPI,
  } = useTreeViewContext<TSignatures, TOptionalSignatures>();
  const depthContext = React.useContext(TreeViewItemDepthContext);

  const { id, itemId, label, children, rootRef } = parameters;

  const { rootRef: pluginRootRef, contentRef, propsEnhancers } = runItemPlugins(parameters);
  const { interactions, status } = useTreeItem2Utils({ itemId, children });
  const rootRefObject = React.useRef<HTMLLIElement>(null);
  const contentRefObject = React.useRef<HTMLDivElement>(null);
  const handleRootRef = useForkRef(rootRef, pluginRootRef, rootRefObject)!;
  const handleContentRef = useForkRef(contentRef, contentRefObject)!;
  const checkboxRef = React.useRef<HTMLButtonElement>(null);

  const idAttribute = generateTreeItemIdAttribute({ itemId, treeId, id });
  const rootTabIndex = instance.canItemBeTabbed(itemId) ? 0 : -1;

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

      const canBeFocused = !status.disabled || disabledItemsFocusable;
      if (!status.focused && canBeFocused && event.currentTarget === event.target) {
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
      onItemClick?.(event, itemId);

      if (event.defaultMuiPrevented || checkboxRef.current?.contains(event.target as HTMLElement)) {
        return;
      }
      if (expansionTrigger === 'content') {
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

  const createCheckboxHandleChange =
    (otherHandlers: EventHandlers) =>
    (event: React.ChangeEvent<HTMLInputElement> & TreeViewCancellableEvent) => {
      otherHandlers.onChange?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }

      if (disableSelection || status.disabled) {
        return;
      }

      interactions.handleCheckboxSelection(event);
    };

  const createIconContainerHandleClick =
    (otherHandlers: EventHandlers) => (event: React.MouseEvent & TreeViewCancellableEvent) => {
      otherHandlers.onClick?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }
      if (expansionTrigger === 'iconContainer') {
        interactions.handleExpansion(event);
      }
    };

  const getRootProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItem2RootSlotProps<ExternalProps> => {
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

    const props: UseTreeItem2RootSlotPropsFromUseTreeItem = {
      ...externalEventHandlers,
      ref: handleRootRef,
      role: 'treeitem',
      tabIndex: rootTabIndex,
      id: idAttribute,
      'aria-expanded': status.expandable ? status.expanded : undefined,
      'aria-selected': ariaSelected,
      'aria-disabled': status.disabled || undefined,
      ...externalProps,
      onFocus: createRootHandleFocus(externalEventHandlers),
      onBlur: createRootHandleBlur(externalEventHandlers),
      onKeyDown: createRootHandleKeyDown(externalEventHandlers),
    };

    if (indentationAtItemLevel) {
      props.style = {
        '--TreeView-itemDepth':
          typeof depthContext === 'function' ? depthContext(itemId) : depthContext,
      } as React.CSSProperties;
    }

    const enhancedRootProps =
      propsEnhancers.root?.({ ...sharedPropsEnhancerParams, externalEventHandlers }) ?? {};

    return {
      ...props,
      ...enhancedRootProps,
    } as UseTreeItem2RootSlotProps<ExternalProps>;
  };

  const getContentProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItem2ContentSlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    const props: UseTreeItem2ContentSlotPropsFromUseTreeItem = {
      ...externalEventHandlers,
      ...externalProps,
      ref: handleContentRef,
      onClick: createContentHandleClick(externalEventHandlers),
      onMouseDown: createContentHandleMouseDown(externalEventHandlers),
      status,
    };

    if (indentationAtItemLevel) {
      props.indentationAtItemLevel = true;
    }

    const enhancedContentProps =
      propsEnhancers.content?.({ ...sharedPropsEnhancerParams, externalEventHandlers }) ?? {};

    return {
      ...props,
      ...enhancedContentProps,
    } as UseTreeItem2ContentSlotProps<ExternalProps>;
  };

  const getCheckboxProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItem2CheckboxSlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    return {
      ...externalEventHandlers,
      visible: checkboxSelection,
      ref: checkboxRef,
      checked: status.selected,
      disabled: disableSelection || status.disabled,
      tabIndex: -1,
      ...externalProps,
      onChange: createCheckboxHandleChange(externalEventHandlers),
    };
  };

  const getLabelProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItem2LabelSlotProps<ExternalProps> => {
    const externalEventHandlers = {
      ...extractEventHandlers(externalProps),
    };

    const props: UseTreeItem2LabelSlotProps<ExternalProps> = {
      ...externalEventHandlers,
      children: label,
      ...externalProps,
      onDoubleClick: createLabelHandleDoubleClick(externalEventHandlers),
    };

    if (instance.isTreeViewEditable) {
      props.editable = status.editable;
    }

    return props;
  };

  const getLabelInputProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItem2LabelInputSlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    const enhancedLabelInputProps =
      propsEnhancers.labelInput?.({
        rootRefObject,
        contentRefObject,
        externalEventHandlers,
        interactions,
      }) ?? {};

    return {
      ...externalProps,
      ...enhancedLabelInputProps,
    } as UseTreeItem2LabelInputSlotProps<ExternalProps>;
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
  ): UseTreeItem2GroupTransitionSlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    const response: UseTreeItem2GroupTransitionSlotProps<ExternalProps> = {
      ...externalEventHandlers,
      unmountOnExit: true,
      component: 'ul',
      role: 'group',
      in: status.expanded,
      children,
      ...externalProps,
    };

    if (indentationAtItemLevel) {
      response.indentationAtItemLevel = true;
    }

    return response;
  };

  const getDragAndDropOverlayProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItem2DragAndDropOverlaySlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    const enhancedDragAndDropOverlayProps =
      propsEnhancers.dragAndDropOverlay?.({
        ...sharedPropsEnhancerParams,
        externalEventHandlers,
      }) ?? {};

    return {
      ...externalProps,
      ...enhancedDragAndDropOverlayProps,
    } as UseTreeItem2DragAndDropOverlaySlotProps<ExternalProps>;
  };

  return {
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
