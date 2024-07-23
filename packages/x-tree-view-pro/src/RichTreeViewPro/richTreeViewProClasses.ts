import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface RichTreeViewProClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type RichTreeViewProClassKey = keyof RichTreeViewProClasses;

export function getRichTreeViewProUtilityClass(slot: string): string {
  return generateUtilityClass('MuiRichTreeViewPro', slot);
}

export const richTreeViewProClasses: RichTreeViewProClasses = generateUtilityClasses(
  'MuiRichTreeViewPro',
  ['root'],
);
