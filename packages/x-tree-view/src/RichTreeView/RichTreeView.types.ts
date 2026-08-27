import type * as React from 'react';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system/styleFunctionSx';
import type { SlotComponentProps } from '@mui/utils/types';
import type { RichTreeViewClasses } from './richTreeViewClasses';
import type {
  RichTreeViewItemsSlotProps,
  RichTreeViewItemsSlots,
} from '../internals/components/RichTreeViewItems';
import type {
  RichTreeViewItemLoaderOwnerState,
  RichTreeViewLoadingSlotOwnProps,
} from '../internals/components/RichTreeViewLoading';
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
   * Component rendered instead of the default loading rows while the tree is loading.
   * It renders inside the tree root, which keeps its `role="tree"` and `aria-busy` attributes.
   */
  loading?: React.ElementType;
  /**
   * Component rendered for each loading row. The default renders a skeleton row.
   * It also renders for the children of an item while they load lazily.
   * @default RichTreeViewItemLoader
   */
  itemLoader?: React.ElementType;
  /**
   * Component rendered inside each loading row, wrapping the placeholders.
   * @default RichTreeViewItemLoaderContent
   */
  itemLoaderContent?: React.ElementType;
}

export interface RichTreeViewSlotProps<R extends {}, Multiple extends boolean | undefined>
  extends TreeViewSlotProps, RichTreeViewItemsSlotProps<RichTreeViewProps<R, Multiple>> {
  loading?: SlotComponentProps<
    'div',
    RichTreeViewLoadingSlotOwnProps,
    RichTreeViewProps<R, Multiple>
  >;
  itemLoader?: SlotComponentProps<'li', {}, RichTreeViewItemLoaderOwnerState>;
  itemLoaderContent?: SlotComponentProps<'div', {}, RichTreeViewItemLoaderOwnerState>;
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
  /**
   * The number of item loaders to display when `loading` is `true`.
   * @default 5
   * @deprecated Use the `itemsCount` value in `slotProps.loading` instead.
   */
  // TODO v10: Remove the deprecated `loadingItemsCount` prop.
  loadingItemsCount?: number;
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
