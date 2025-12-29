'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { useTreeViewContext } from '../../TreeViewProvider';
import { TreeViewCancellableEvent } from '../../../models';
import { TreeViewItemPlugin } from '../../models';
import { labelSelectors } from './selectors';
import { ExtendableRichTreeViewStore } from '../../RichTreeViewStore';
import { TreeItemLabelInputProps } from '../../../TreeItemLabelInput';

export const useLabelEditingItemPlugin: TreeViewItemPlugin = ({ props }) => {
  const { store } = useTreeViewContext<ExtendableRichTreeViewStore<any, any, any, any>>();
  const { label, itemId } = props;

  const [labelInputValue, setLabelInputValue] = React.useState(label as string);

  const isItemEditable = useStore(store, labelSelectors.isItemEditable, itemId);
  const isItemBeingEdited = useStore(store, labelSelectors.isItemBeingEdited, itemId);

  React.useEffect(() => {
    if (!isItemBeingEdited) {
      setLabelInputValue(label as string);
    }
  }, [isItemBeingEdited, label]);

  return {
    propsEnhancers: {
      label: () => ({ editable: isItemEditable }),
      labelInput: ({
        externalEventHandlers,
        interactions,
      }): UseTreeItemLabelInputSlotPropsFromLabelEditing => {
        if (!isItemEditable) {
          return {};
        }

        const handleKeydown = (
          event: React.KeyboardEvent<HTMLInputElement> & TreeViewCancellableEvent,
        ) => {
          externalEventHandlers.onKeyDown?.(event);
          if (event.defaultMuiPrevented) {
            return;
          }
          const target = event.target as HTMLInputElement;

          if (event.key === 'Enter' && target.value) {
            interactions.handleSaveItemLabel(event, target.value);
          } else if (event.key === 'Escape') {
            interactions.handleCancelItemLabelEditing(event);
          }
        };

        const handleBlur = (
          event: React.FocusEvent<HTMLInputElement> & TreeViewCancellableEvent,
        ) => {
          externalEventHandlers.onBlur?.(event);
          if (event.defaultMuiPrevented) {
            return;
          }

          if (event.target.value) {
            interactions.handleSaveItemLabel(event, event.target.value);
          }
        };

        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          externalEventHandlers.onChange?.(event);
          setLabelInputValue(event.target.value);
        };

        return {
          value: labelInputValue ?? '',
          'data-element': 'labelInput',
          onChange: handleInputChange,
          onKeyDown: handleKeydown,
          onBlur: handleBlur,
          autoFocus: true,
          type: 'text',
        };
      },
    },
  };
};

interface UseTreeItemLabelInputSlotPropsFromLabelEditing extends TreeItemLabelInputProps {}

interface UseTreeItemLabelSlotPropsFromLabelEditing {
  editable?: boolean;
}

declare module '@mui/x-tree-view/useTreeItem' {
  interface UseTreeItemLabelInputSlotOwnProps extends UseTreeItemLabelInputSlotPropsFromLabelEditing {}

  interface UseTreeItemLabelSlotOwnProps extends UseTreeItemLabelSlotPropsFromLabelEditing {}
}
