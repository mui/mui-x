import * as React from 'react';
import { EventHandlers, extractEventHandlers } from '@mui/base/utils';
import useForkRef from '@mui/utils/useForkRef';
import {
  UseTreeItemParameters,
  UseTreeItemReturnValue,
  UseTreeItemRootSlotProps,
  UseTreeItemContentSlotProps,
  UseTreeItemGroupTransitionSlotProps,
  UseTreeItemLabelSlotProps,
  UseTreeItemIconContainerSlotProps,
} from './useTreeItem.types';
import { useTreeViewContext } from '../TreeViewProvider/useTreeViewContext';
import { DefaultTreeViewPlugins } from '../plugins/defaultPlugins';
import { MuiCancellableEvent } from '../models/MuiCancellableEvent';
import { useTreeItemUtils } from '../useTreeItemUtils';

export const useTreeItem = <TPlugins extends DefaultTreeViewPlugins = DefaultTreeViewPlugins>(
  parameters: UseTreeItemParameters,
): UseTreeItemReturnValue<TPlugins> => {
  const {
    runItemPlugins,
    selection: { multiSelect },
    disabledItemsFocusable,
    instance,
    publicAPI,
  } = useTreeViewContext<TPlugins>();

  const { id, nodeId, label, children, rootRef } = parameters;

  const { rootRef: pluginRootRef, contentRef } = runItemPlugins(parameters);
  const { interactions, status } = useTreeItemUtils({ nodeId, children });
  const idAttribute = instance.getTreeItemId(nodeId, id);
  const handleRootRef = useForkRef(rootRef, pluginRootRef)!;

  const createRootHandleFocus =
    (otherHandlers: EventHandlers) => (event: React.FocusEvent & MuiCancellableEvent) => {
      otherHandlers.onFocus?.(event);

      if (event.defaultMuiPrevented) {
        return;
      }

      // DOM focus stays on the tree which manages focus with aria-activedescendant
      if (event.target === event.currentTarget) {
        instance.focusRoot();
      }

      const canBeFocused = !status.disabled || disabledItemsFocusable;
      if (!status.focused && canBeFocused && event.currentTarget === event.target) {
        instance.focusNode(event, nodeId);
      }
    };

  const createContentHandleClick =
    (otherHandlers: EventHandlers) => (event: React.MouseEvent & MuiCancellableEvent) => {
      otherHandlers.onClick?.(event);

      if (event.defaultMuiPrevented) {
        return;
      }

      interactions.handleExpansion(event);
      interactions.handleSelection(event);
    };

  const createContentHandleMouseDown =
    (otherHandlers: EventHandlers) => (event: React.MouseEvent & MuiCancellableEvent) => {
      otherHandlers.onMouseDown?.(event);

      if (event.defaultMuiPrevented) {
        return;
      }

      // Prevent text selection
      if (event.shiftKey || event.ctrlKey || event.metaKey || status.disabled) {
        event.preventDefault();
      }
    };

  const getRootProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemRootSlotProps<ExternalProps> => {
    const externalEventHandlers = {
      ...extractEventHandlers(parameters),
      ...extractEventHandlers(externalProps),
    };

    let ariaSelected: boolean | undefined;
    if (multiSelect) {
      ariaSelected = status.selected;
    } else if (status.selected) {
      /* single-selection trees unset aria-selected on un-selected items.
       *
       * If the tree does not support multiple selection, aria-selected
       * is set to true for the selected node and it is not present on any other node in the tree.
       * Source: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
       */
      ariaSelected = true;
    }

    return {
      ...externalEventHandlers,
      ref: handleRootRef,
      role: 'treeitem',
      tabIndex: -1,
      id: idAttribute,
      'aria-expanded': status.expandable ? status.expanded : undefined,
      'aria-selected': ariaSelected,
      'aria-disabled': status.disabled || undefined,
      ...externalProps,
      onFocus: createRootHandleFocus(externalEventHandlers),
    };
  };

  const getContentProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemContentSlotProps<ExternalProps> => {
    const externalEventHandlers = {
      ...extractEventHandlers(parameters),
      ...extractEventHandlers(externalProps),
    };

    return {
      ...externalEventHandlers,
      ...externalProps,
      ref: contentRef,
      onClick: createContentHandleClick(externalEventHandlers),
      onMouseDown: createContentHandleMouseDown(externalEventHandlers),
      status,
    };
  };

  const getLabelProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemLabelSlotProps<ExternalProps> => {
    const externalEventHandlers = {
      ...extractEventHandlers(parameters),
      ...extractEventHandlers(externalProps),
    };

    return {
      ...externalEventHandlers,
      children: label,
      ...externalProps,
    };
  };

  const getIconContainerProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemIconContainerSlotProps<ExternalProps> => {
    const externalEventHandlers = {
      ...extractEventHandlers(parameters),
      ...extractEventHandlers(externalProps),
    };

    return {
      ...externalEventHandlers,
      ...externalProps,
    };
  };

  const getGroupTransitionProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemGroupTransitionSlotProps<ExternalProps> => {
    const externalEventHandlers = {
      ...extractEventHandlers(parameters),
      ...extractEventHandlers(externalProps),
    };

    return {
      ...externalEventHandlers,
      unmountOnExit: true,
      component: 'ul',
      role: 'GroupTransition',
      in: status.expanded,
      children,
      ...externalProps,
    };
  };

  return {
    getRootProps,
    getContentProps,
    getGroupTransitionProps,
    getIconContainerProps,
    getLabelProps,
    rootRef: handleRootRef,
    status,
    publicAPI,
  };
};
