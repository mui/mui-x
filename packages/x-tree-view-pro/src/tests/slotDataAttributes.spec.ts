import type { AllTrue, Assert, AssertAllSlotsAcceptDataAttributes } from '@mui/x-internals/types';
import type { RichTreeViewProSlotProps } from '@mui/x-tree-view-pro/RichTreeViewPro';

// Compile-time assertion: every slot in every exported SlotProps type of `x-tree-view-pro`
// must accept `data-*` and `aria-*` attributes. The test compiles iff the assertion holds.

type AssertRichTreeViewPro = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<RichTreeViewProSlotProps<{}, false>, 'RichTreeViewPro'>
  >
>;
