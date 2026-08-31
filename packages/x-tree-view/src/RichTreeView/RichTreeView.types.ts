import type * as React from 'react';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system/styleFunctionSx';
import type { SlotComponentProps } from '@mui/utils/types';
import type { RichTreeViewClasses } from './richTreeViewClasses';
import type {
  RichTreeViewItemsSlotProps,
  RichTreeViewItemsSlots,
} from '../internals/components/RichTreeViewItems';
import type { RichTreeViewLoadingSlotOwnProps } from '../internals/components/RichTreeViewLoading';
import type { TreeItemLoaderOwnerState } from '../TreeItemLoader';
import type {
  TreeViewSlotProps,
  TreeViewSlots,
} from '../internals/TreeViewProvider/TreeViewStyleContext';
import type { RichTreeViewStore } from '../internals/RichTreeViewStore';
import type { TreeViewValidItem } from '../models/items';
import type { UseTreeViewStoreParameters } from '../internals/hooks/useTreeViewStore';
import type { TreeViewPublicAPI } from '../internals/models';

export interface RichTreeViewSlots extends TreeViewSlots, Omit<RichTreeViewItemsSlots, 'root'> {
  /**
   * Element rendered at the root.
   * @default RichTreeViewRoot
   */
  root?: React.ElementType;
  /**
   * Component rendered instead of the default loading rows.
   * It renders inside the tree root while the tree is loading, which keeps the
   * `role="tree"` and `aria-busy` attributes, and inside a lazily loading item
   * while its children load.
   * Compose it with `TreeItemLoader` to keep the rows semantically correct.
   */
  loading?: React.ElementType;
  /**
   * Component rendered for each loading row.
   * It also renders for the children of an item while they load lazily.
   * Wrap custom content in `TreeItemLoader` to keep the row semantically correct.
   * @default TreeItemLoader
   */
  itemLoader?: React.ElementType;
}

export interface RichTreeViewSlotProps<R extends {}, Multiple extends boolean | undefined>
  extends TreeViewSlotProps, RichTreeViewItemsSlotProps<RichTreeViewProps<R, Multiple>> {
  loading?: SlotComponentProps<
    'div',
    RichTreeViewLoadingSlotOwnProps,
    RichTreeViewProps<R, Multiple>
  >;
  itemLoader?: SlotComponentProps<'li', {}, TreeItemLoaderOwnerState>;
}

export type RichTreeViewApiRef<
  R extends TreeViewValidItem<R> = any,
  Multiple extends boolean | undefined = any,
> = React.RefObject<Partial<TreeViewPublicAPI<RichTreeViewStore<R, Multiple>>> | undefined>;

export interface RichTreeViewPropsBase extends React.HTMLAttributes<HTMLUListElement> {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<RichTreeViewClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * If `true`, a loading UI is displayed instead of the tree items.
   * @default false
   */
  loading?: boolean;
}

export interface RichTreeViewProps<R extends {}, Multiple extends boolean | undefined>
  extends UseTreeViewStoreParameters<RichTreeViewStore<R, Multiple>>, RichTreeViewPropsBase {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: RichTreeViewSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: RichTreeViewSlotProps<R, Multiple>;
  /**
   * The ref object that allows Tree View manipulation. Can be instantiated with `useRichTreeViewApiRef()`.
   */
  apiRef?: RichTreeViewApiRef;
}
