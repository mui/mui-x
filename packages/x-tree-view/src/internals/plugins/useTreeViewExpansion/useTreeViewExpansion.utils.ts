import { TreeViewUsedDefaultizedParams } from '../../models';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';

export const getExpansionTrigger = ({
  isItemEditable,
  expansionTrigger,
}: Pick<
  TreeViewUsedDefaultizedParams<UseTreeViewExpansionSignature>,
  'isItemEditable' | 'expansionTrigger'
>) => {
  if (expansionTrigger) {
    return expansionTrigger;
  }

  if (isItemEditable) {
    return 'iconContainer';
  }

  return 'content';
};
