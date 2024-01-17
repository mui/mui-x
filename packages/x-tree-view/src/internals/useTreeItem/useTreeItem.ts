import * as React from 'react';
import { EventHandlers, extractEventHandlers } from '@mui/base/utils';
import {
  UseTreeItemParameters,
  UseTreeItemReturnValue,
  UseTreeItemRootSlotOwnProps,
  UseTreeItemRootSlotProps,
  UseTreeItemContentSlotOwnProps,
  UseTreeItemContentSlotProps,
  UseTreeItemTransitionSlotOwnProps,
  UseTreeItemTransitionSlotProps,
} from './useTreeItem.types';
import { useTreeViewContext } from '../TreeViewProvider/useTreeViewContext';
import { DefaultTreeViewPlugins } from '../plugins/defaultPlugins';
import { MuiCancellableEvent } from '../models/MuiCancellableEvent';

export const useTreeItem = (inParameters: UseTreeItemParameters): UseTreeItemReturnValue => {
  const {
    icons: contextIcons,
    runItemPlugins,
    selection: { multiSelect },
    disabledItemsFocusable,
    instance,
  } = useTreeViewContext<DefaultTreeViewPlugins>();

  const {
    props: parameters,
    ref,
    wrapItem,
  } = runItemPlugins({ props: inParameters, ref: inParameters.rootRef });

  const { id, nodeId } = parameters;

  const idAttribute = instance.getTreeItemId(nodeId, id);

  const expandable = Boolean(Array.isArray(children) ? children.length : children);
  const expanded = instance.isNodeExpanded(nodeId);
  const focused = instance.isNodeFocused(nodeId);
  const selected = instance.isNodeSelected(nodeId);
  const disabled = instance.isNodeDisabled(nodeId);

  let ariaSelected;
  if (multiSelect) {
    ariaSelected = selected;
  } else if (selected) {
    /* single-selection trees unset aria-selected on un-selected items.
     *
     * If the tree does not support multiple selection, aria-selected
     * is set to true for the selected node and it is not present on any other node in the tree.
     * Source: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
     */
    ariaSelected = true;
  }

  const createRootHandleFocus =
    (otherHandlers: EventHandlers) =>
    (event: React.FocusEvent<HTMLLIElement> & MuiCancellableEvent) => {
      otherHandlers.onFocus?.(event);

      if (event.defaultMuiPrevented) {
        return;
      }

      // DOM focus stays on the tree which manages focus with aria-activedescendant
      if (event.target === event.currentTarget) {
        instance.focusRoot();
      }

      const canBeFocused = !disabled || disabledItemsFocusable;
      if (!focused && canBeFocused && event.currentTarget === event.target) {
        instance.focusNode(event, nodeId);
      }
    };

  const getRootProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemRootSlotProps<ExternalProps> => {
    const externalEventHandlers = {
      ...extractEventHandlers(parameters),
      ...extractEventHandlers(externalProps),
    };

    const rootOwnProps: UseTreeItemRootSlotOwnProps = {
      role: 'treeitem',
      tabIndex: -1,
      id: idAttribute,
      'aria-expanded': expandable ? expanded : undefined,
      'aria-selected': ariaSelected,
      'aria-disabled': disabled || undefined,
    };

    return {
      ...externalEventHandlers,
      ...rootOwnProps,
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

    const contentOwnProps: UseTreeItemContentSlotOwnProps = {};

    return {
      ...externalEventHandlers,
      ...contentOwnProps,
      ...externalProps,
    };
  };

  const getTransitionProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemTransitionSlotProps<ExternalProps> => {
    const externalEventHandlers = {
      ...extractEventHandlers(parameters),
      ...extractEventHandlers(externalProps),
    };

    const transitionOwnProps: UseTreeItemTransitionSlotOwnProps = {
      unmountOnExit: true,
      component: 'ul',
      role: 'group',
      in: expanded,
    };

    return {
      ...externalEventHandlers,
      ...transitionOwnProps,
      ...externalProps,
    };
  };

  return {
    getRootProps,
    getContentProps,
    getTransitionProps,
    rootRef: ref,
    wrapItem,
  };
};
