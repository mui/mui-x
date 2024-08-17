import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface TreeItemClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the transition component. */
  groupTransition: string;
  /** Styles applied to the content element. */
  content: string;
  /** State class applied to the content element when expanded. */
  expanded: string;
  /** State class applied to the content element when selected. */
  selected: string;
  /** State class applied to the content element when focused. */
  focused: string;
  /** State class applied to the element when disabled. */
  disabled: string;
  /** Styles applied to the tree item icon. */
  iconContainer: string;
  /** Styles applied to the label element. */
  label: string;
  /** Styles applied to the checkbox element. */
  checkbox: string;
  /** Styles applied to the input element that is visible when editing is enabled. */
  labelInput: string;
  /** Styles applied to the content element when editing is enabled. */
  editing: string;
  /** Styles applied to the content of the items that are editable. */
  editable: string;
  /** Styles applied to the drag and drop overlay. */
  dragAndDropOverlay: string;
}

export type TreeItemClassKey = keyof TreeItemClasses;

export function getTreeItemUtilityClass(slot: string): string {
  return generateUtilityClass('MuiTreeItem', slot);
}

export const treeItemClasses: TreeItemClasses = generateUtilityClasses('MuiTreeItem', [
  'root',
  'groupTransition',
  'content',
  'expanded',
  'selected',
  'focused',
  'disabled',
  'iconContainer',
  'label',
  'checkbox',
  'labelInput',
  'editable',
  'editing',
  'dragAndDropOverlay',
]);
