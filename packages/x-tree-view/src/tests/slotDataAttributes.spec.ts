import type { AllTrue, Assert, AssertAllSlotsAcceptDataAttributes } from '@mui/x-internals/types';
import type { RichTreeViewSlotProps } from '@mui/x-tree-view/RichTreeView';
import type { SimpleTreeViewSlotProps } from '@mui/x-tree-view/SimpleTreeView';
import type { TreeItemSlotProps } from '@mui/x-tree-view/TreeItem';
import type { TreeItemIconSlotProps } from '@mui/x-tree-view/TreeItemIcon';

// Compile-time assertion: every slot in every exported SlotProps type of `x-tree-view`
// must accept `data-*` attributes. The test compiles if and only if the assertion holds.

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
