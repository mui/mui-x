import * as React from 'react';
import { MuiCancellableEvent, shouldSkipEventHandler } from '@mui/x-internals/cancellableEvent';
import { useTreeViewContext } from '../../TreeViewProvider';
import { TreeViewItemPlugin } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import {
  UseTreeItem2LabelInputSlotPropsFromLabelEditing,
  UseTreeViewLabelSignature,
} from './useTreeViewLabel.types';

export const useTreeViewLabelItemPlugin: TreeViewItemPlugin<any> = ({ props }) => {
  const { instance } = useTreeViewContext<[UseTreeViewItemsSignature, UseTreeViewLabelSignature]>();
  const { label, itemId } = props;

  const [labelInputValue, setLabelInputValue] = React.useState(label);

  const isItemBeingEdited = instance.isItemBeingEdited(itemId);

  React.useEffect(() => {
    if (!isItemBeingEdited) {
      setLabelInputValue(label);
    }
  }, [isItemBeingEdited, label]);

  return {
    propsEnhancers: {
      labelInput: ({
        externalEventHandlers,
        interactions,
      }): UseTreeItem2LabelInputSlotPropsFromLabelEditing => {
        const editable = instance.isItemEditable(itemId);

        if (!editable) {
          return {};
        }

        const handleKeydown = (
          event: React.KeyboardEvent<HTMLInputElement> & MuiCancellableEvent,
        ) => {
          externalEventHandlers.onKeyDown?.(event);
          if (shouldSkipEventHandler(event)) {
            return;
          }
          const target = event.target as HTMLInputElement;

          if (event.key === 'Enter' && target.value) {
            interactions.handleSaveItemLabel(event, target.value);
          } else if (event.key === 'Escape') {
            interactions.handleCancelItemLabelEditing(event);
          }
        };

        const handleBlur = (event: React.FocusEvent<HTMLInputElement> & MuiCancellableEvent) => {
          externalEventHandlers.onBlur?.(event);
          if (shouldSkipEventHandler(event)) {
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
