import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import { UseTreeItem2Parameters, UseTreeItem2Status } from '../useTreeItem2';
import { TreeItemClasses } from '../TreeItem';
import { TreeItem2IconSlotProps, TreeItem2IconSlots } from '../TreeItem2Icon';
import { MuiCancellableEventHandler } from '../internals/models/MuiCancellableEvent';

export interface TreeItem2Slots extends TreeItem2IconSlots {
  /**
   * The component that renders the root.
   * @default TreeItem2Root
   */
  root?: React.ElementType;
  /**
   * The component that renders the content of the item.
   * (e.g.: everything related to this item, not to its children).
   * @default TreeItem2Content
   */
  content?: React.ElementType;
  /**
   * The component that renders the children of the item.
   * @default TreeItem2GroupTransition
   */
  groupTransition?: React.ElementType;
  /**
   * The component that renders the icon.
   * @default TreeItem2IconContainer
   */
  iconContainer?: React.ElementType;
  /**
   * The component that renders the item checkbox for selection.
   * @default TreeItem2Checkbox
   */
  checkbox?: React.ElementType;
  /**
   * The component that renders the item label.
   * @default TreeItem2Label
   */
  label?: React.ElementType;
  /**
   * The component that renders the input to edit the label when the item is editable and is currently being edited.
   * @default TreeItem2LabelInput
   */
  labelInput?: React.ElementType;
  /**
   * The component that renders the overlay when an item reordering is ongoing.
   * Warning: This slot is only useful when using the `RichTreeViewPro` component.
   * @default TreeItem2DragAndDropOverlay
   */
  dragAndDropOverlay?: React.ElementType;
}

export interface TreeItem2SlotProps extends TreeItem2IconSlotProps {
  root?: SlotComponentProps<'li', {}, {}>;
  content?: SlotComponentProps<'div', {}, {}>;
  groupTransition?: SlotComponentProps<'div', {}, {}>;
  iconContainer?: SlotComponentProps<'div', {}, {}>;
  checkbox?: SlotComponentProps<'button', {}, {}>;
  label?: SlotComponentProps<'div', {}, {}>;
  labelInput?: SlotComponentProps<'input', {}, {}>;
  dragAndDropOverlay?: SlotComponentProps<'div', {}, {}>;
}

export interface TreeItem2Props
  extends Omit<UseTreeItem2Parameters, 'rootRef'>,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TreeItemClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: TreeItem2Slots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TreeItem2SlotProps;
  /**
   * This prop isn't supported.
   * Use the `onItemFocus` callback on the tree if you need to monitor an item's focus.
   */
  onFocus?: null;
  /**
   * Callback fired when the item root is blurred.
   */
  onBlur?: MuiCancellableEventHandler<React.FocusEvent<HTMLLIElement>>;
  /**
   * Callback fired when a key is pressed on the keyboard and the tree is in focus.
   */
  onKeyDown?: MuiCancellableEventHandler<React.KeyboardEvent<HTMLLIElement>>;
}

export interface TreeItem2OwnerState extends Omit<TreeItem2Props, 'disabled'>, UseTreeItem2Status {}
