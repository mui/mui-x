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
  /**
   * State class applied to the content element when the item is expanded.
   * @deprecated Use the `data-expanded` attribute instead.
   */
  expanded: string;
  /**
   * State class applied to the content element when the item is selected.
   * @deprecated Use the `data-selected` attribute instead.
   */
  selected: string;
  /**
   * State class applied to the content element when the item is focused.
   * @deprecated Use the `data-focused` attribute instead.
   */
  focused: string;
  /**
   * State class applied to the content element when the item is disabled.
   * @deprecated Use the `data-disabled` attribute instead.
   */
  disabled: string;
  /**
   * State class applied to the content element when the item is editable.
   * @deprecated Use the `data-editable` attribute instead.
   */
  editable: string;
  /**
   * State class applied to the content element when the item is being edited.
   * @deprecated Use the `data-editing` attribute instead.
   */
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
