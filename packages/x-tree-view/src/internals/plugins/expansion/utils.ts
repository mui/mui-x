import { RichTreeViewStoreParameters } from '../../RichTreeViewStore';

export const getExpansionTrigger = ({
  isItemEditable,
  expansionTrigger,
}: Pick<RichTreeViewStoreParameters<any, any>, 'isItemEditable' | 'expansionTrigger'>) => {
  if (expansionTrigger) {
    return expansionTrigger;
  }

  if (isItemEditable) {
    return 'iconContainer';
  }

  return 'content';
};
