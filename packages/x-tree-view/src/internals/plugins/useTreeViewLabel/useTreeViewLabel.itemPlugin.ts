import * as React from 'react';
import { useTreeViewContext } from '../../TreeViewProvider';
import { TreeViewCancellableEvent } from '../../../models';
import { TreeViewItemPlugin } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import {
  UseTreeItemLabelInputSlotPropsFromLabelEditing,
  UseTreeViewLabelSignature,
} from './useTreeViewLabel.types';
import { useSelector } from '../../hooks/useSelector';
import { selectorIsItemBeingEdited, selectorIsItemEditable } from './useTreeViewLabel.selectors';

export const useTreeViewLabelItemPlugin: TreeViewItemPlugin = ({ props }) => {
  const {
    store,
    label: { isItemEditable },
  } = useTreeViewContext<[UseTreeViewItemsSignature, UseTreeViewLabelSignature]>();
  const { label, itemId } = props;

  const [labelInputValue, setLabelInputValue] = React.useState(label as string);

  const editable = useSelector(store, selectorIsItemEditable, { itemId, isItemEditable });
  const editing = useSelector(store, selectorIsItemBeingEdited, itemId);

  React.useEffect(() => {
    if (!editing) {
      setLabelInputValue(label as string);
    }
  }, [editing, label]);

  return {
    propsEnhancers: {
      labelInput: ({
        externalEventHandlers,
        interactions,
      }): UseTreeItemLabelInputSlotPropsFromLabelEditing => {
        if (!editable) {
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
