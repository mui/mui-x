import { SlotComponentProps } from '@mui/utils/types';
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

export interface TreeViewSlots {
  /**
   * The default icon used to collapse the item.
   */
  collapseIcon?: React.ElementType;
  /**
   * The default icon used to expand the item.
   */
  expandIcon?: React.ElementType;
  /**
   * The default icon displayed next to an end item.
   * This is applied to all Tree Items and can be overridden by the TreeItem `icon` slot prop.
   */
  endIcon?: React.ElementType;
}

export interface TreeViewSlotProps {
  collapseIcon?: SlotComponentProps<'svg', {}, {}>;
  expandIcon?: SlotComponentProps<'svg', {}, {}>;
  endIcon?: SlotComponentProps<'svg', {}, {}>;
}

export interface TreeViewStyleContextValue {
  classes: Partial<TreeViewClasses>;
  slots: TreeViewSlots;
  slotProps: TreeViewSlotProps;
}

/**
 * @ignore - internal component.
 */
export const TreeViewStyleContext = React.createContext<TreeViewStyleContextValue>({
  classes: {},
  slots: {},
  slotProps: {},
});

if (process.env.NODE_ENV !== 'production') {
  TreeViewStyleContext.displayName = 'TreeViewStyleContext';
}

export const useTreeViewStyleContext = () => {
  return React.useContext(TreeViewStyleContext);
};
