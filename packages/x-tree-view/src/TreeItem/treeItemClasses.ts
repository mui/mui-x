import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface TreeItemForwardedClasses {
  /** Styles applied to the item's root element. */
  item: string;
  /** Styles applied to the item's content element. */
  itemContent: string;
  /** Styles applied to the item's transition element. */
  itemGroupTransition: string;
  /** Styles applied to the item's icon container element icon. */
  itemIconContainer: string;
  /** Styles applied to the item's label element. */
  itemLabel: string;
  /** Styles applied to the item's label input element (visible only when editing is enabled). */
  itemLabelInput: string;
  /** Styles applied to the item's checkbox element. */
  itemCheckbox: string;
  /** Styles applied to the item's drag and drop overlay element. */
  itemDragAndDropOverlay: string;
  /** Styles applied to the item's error icon element */
  itemErrorIcon: string;
}

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
  /** State class applied to the content element when expanded. */
  expanded: string;
  /** State class applied to the content element when selected. */
  selected: string;
  /** State class applied to the content element when focused. */
  focused: string;
  /** State class applied to the element when disabled. */
  disabled: string;
  /** Styles applied to the content of the items that are editable. */
  editable: string;
  /** Styles applied to the content element when editing is enabled. */
  editing: string;
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
  // State classes, will be replaced by data-attrs in the next major
  'expanded',
  'selected',
  'focused',
  'disabled',
  'editable',
  'editing',
]);
