import * as React from 'react';

export interface TreeViewClasses {
  /** Styles applied to the root element. */
  root: string;
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
  /** Styles applied to the item's loading icon element */
  itemLoadingIcon: string;
}

export interface TreeViewStyleContextValue {
  classes: Partial<TreeViewClasses>;
}

/**
 * @ignore - internal component.
 */
export const TreeViewStyleContext = React.createContext<TreeViewStyleContextValue>({ classes: {} });

if (process.env.NODE_ENV !== 'production') {
  TreeViewStyleContext.displayName = 'TreeViewStyleContext';
}

export const useTreeViewStyleContext = () => {
  return React.useContext(TreeViewStyleContext);
};
