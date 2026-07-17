import type {
  AllTrue,
  Assert,
  AssertAllSlotsAcceptDataAttributes,
} from 'test/utils/slotDataAttributes';
import type { RichTreeViewSlotProps } from '@mui/x-tree-view/RichTreeView';
import type { SimpleTreeViewSlotProps } from '@mui/x-tree-view/SimpleTreeView';
import type { TreeItemSlotProps } from '@mui/x-tree-view/TreeItem';
import type { TreeItemIconSlotProps } from '@mui/x-tree-view/TreeItemIcon';

declare module '@mui/utils/types' {
  interface DataAttributesOverrides {
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
}

// Compile-time assertion: every slot of every exported top-level component and provider
// `*SlotProps` in `x-tree-view` must accept `data-*` once `DataAttributesOverrides` is augmented,
// so a regression names the offending slot. Slots of nested components (plot elements,
// `use*` hooks) are exercised through their parent's `*SlotProps`.

type AssertRichTreeView = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<RichTreeViewSlotProps<{}, false>, 'RichTreeView'>>
>;
type AssertSimpleTreeView = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<SimpleTreeViewSlotProps, 'SimpleTreeView'>>
>;
type AssertTreeItem = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<TreeItemSlotProps, 'TreeItem'>>
>;
type AssertTreeItemIcon = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<TreeItemIconSlotProps, 'TreeItemIcon'>>
>;
