import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface TreeItemClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the content element. */
  content: string;
  /** Styles applied to the transition element. */
  groupTransition: string;
  /** Styles applied to the icon container element. */
  iconContainer: string;
  /** Styles applied to the label element. */
  label: string;
  /** Styles applied to the label input element (visible only when editing is enabled). */
  labelInput: string;
  /** Styles applied to the checkbox element. */
  checkbox: string;
  /** Styles applied to the drag and drop overlay element. */
  dragAndDropOverlay: string;
  /** Styles applied to the error icon element */
  errorIcon: string;
  /** Styles applied to the loading icon element */
  loadingIcon: string;
}

export type TreeItemClassKey = keyof TreeItemClasses;

export function getTreeItemUtilityClass(slot: string): string {
  return generateUtilityClass('MuiTreeItem', slot);
}

export const treeItemClasses: TreeItemClasses = generateUtilityClasses('MuiTreeItem', [
  'root',
  'content',
  'groupTransition',
  'iconContainer',
  'label',
  'checkbox',
  'labelInput',
  'dragAndDropOverlay',
  'errorIcon',
  'loadingIcon',
]);
