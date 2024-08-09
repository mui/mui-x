import * as React from 'react';
import { useTreeViewContext } from '../../TreeViewProvider';
import { TreeViewItemPlugin } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import {
  UseTreeItem2LabelInputSlotPropsFromItemsReordering,
  UseTreeViewLabelSignature,
} from './useTreeViewLabel.types';

export const isAndroid = () => navigator.userAgent.toLowerCase().includes('android');

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
      }): UseTreeItem2LabelInputSlotPropsFromItemsReordering => {
        const editable = instance.isItemEditable(itemId);

        if (!editable) {
          return {};
        }

        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          externalEventHandlers.onChange?.(event);
          setLabelInputValue(event.target.value);
        };

        return {
          value: labelInputValue ?? '',
          'data-element': 'labelInput',
          onChange: handleInputChange,
          autoFocus: true,
          type: 'text',
        };
      },
    },
  };
};
