import { RichTreeViewParameters } from '../../RichTreeViewStore';

export const getExpansionTrigger = ({
  isItemEditable,
  expansionTrigger,
}: Pick<RichTreeViewParameters<any, any>, 'isItemEditable' | 'expansionTrigger'>) => {
  if (expansionTrigger) {
    return expansionTrigger;
  }

  if (isItemEditable) {
    return 'iconContainer';
  }

  return 'content';
};
