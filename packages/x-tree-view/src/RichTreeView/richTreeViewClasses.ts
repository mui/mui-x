import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface RichTreeViewClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type RichTreeViewClassKey = keyof RichTreeViewClasses;

export function getRichTreeViewUtilityClass(slot: string): string {
  return generateUtilityClass('MuiRichTreeView', slot);
}

export const richTreeViewClasses: RichTreeViewClasses = generateUtilityClasses('MuiRichTreeView', [
  'root',
]);
