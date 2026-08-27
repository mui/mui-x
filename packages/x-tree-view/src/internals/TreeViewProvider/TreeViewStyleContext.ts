'use client';
import type { SlotComponentProps } from '@mui/utils/types';
import * as React from 'react';
import type { RichTreeViewItemLoaderOwnerState } from '../components/RichTreeViewLoading';

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
  /** Styles applied to the item loader element. */
  itemLoader: string;
  /** Styles applied to the item loader's content element. */
  itemLoaderContent: string;
}

export interface TreeViewSlots {
  /**
   * The default icon used to collapse the item.
   */
  collapseIcon?: React.ElementType | null;
  /**
   * The default icon used to expand the item.
   */
  expandIcon?: React.ElementType | null;
  /**
   * The default icon displayed next to an end item.
   * This is applied to all Tree Items and can be overridden by the TreeItem `icon` slot prop.
   */
  endIcon?: React.ElementType | null;
}

export interface TreeViewSlotProps {
  collapseIcon?: SlotComponentProps<'svg', {}, {}>;
  expandIcon?: SlotComponentProps<'svg', {}, {}>;
  endIcon?: SlotComponentProps<'svg', {}, {}>;
}

/**
 * Slots stored in the style context.
 * The item loader slots only exist on the components with a loading state,
 * so they are not part of the public `TreeViewSlots` interface.
 */
export interface TreeViewStyleContextSlots extends TreeViewSlots {
  /**
   * Component rendered for each loading row. The default renders a skeleton row.
   */
  itemLoader?: React.ElementType;
  /**
   * Component rendered inside each loading row, wrapping the placeholders.
   */
  itemLoaderContent?: React.ElementType;
}

/**
 * Slot props stored in the style context.
 * The item loader slot props only exist on the components with a loading state,
 * so they are not part of the public `TreeViewSlotProps` interface.
 */
export interface TreeViewStyleContextSlotProps extends TreeViewSlotProps {
  itemLoader?: SlotComponentProps<'li', {}, RichTreeViewItemLoaderOwnerState>;
  itemLoaderContent?: SlotComponentProps<'div', {}, RichTreeViewItemLoaderOwnerState>;
}

export interface TreeViewStyleContextValue {
  classes: Partial<TreeViewClasses>;
  slots: TreeViewStyleContextSlots;
  slotProps: TreeViewStyleContextSlotProps;
}

/**
 * @ignore - internal component.
 */
export const TreeViewStyleContext = React.createContext<TreeViewStyleContextValue>({
  classes: {},
  slots: {},
  slotProps: {},
});

export const useTreeViewStyleContext = () => {
  return React.useContext(TreeViewStyleContext);
};
