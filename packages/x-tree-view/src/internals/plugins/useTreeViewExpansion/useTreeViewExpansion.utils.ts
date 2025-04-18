import { TreeViewUsedParamsWithDefaults } from '../../models';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';

export const getExpansionTrigger = ({
  isItemEditable,
  expansionTrigger,
}: Pick<
  TreeViewUsedParamsWithDefaults<UseTreeViewExpansionSignature>,
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
