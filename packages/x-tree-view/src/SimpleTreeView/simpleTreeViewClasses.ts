import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface SimpleTreeViewClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type SimpleTreeViewClassKey = keyof SimpleTreeViewClasses;

export function getSimpleTreeViewUtilityClass(slot: string): string {
  return generateUtilityClass('MuiSimpleTreeView', slot);
}

export const simpleTreeViewClasses: SimpleTreeViewClasses = generateUtilityClasses(
  'MuiSimpleTreeView',
  ['root'],
);
