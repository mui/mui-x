import type {
  AllTrue,
  Assert,
  AssertAllSlotsAcceptDataAttributes,
} from 'test/utils/slotDataAttributes';
import type { RichTreeViewProSlotProps } from '@mui/x-tree-view-pro/RichTreeViewPro';

declare module '@mui/utils/types' {
  interface DataAttributesOverrides {
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
}

// Compile-time assertion: every slot in every exported SlotProps type of `x-tree-view-pro`
// must accept `data-*` attributes. The test compiles if and only if the assertion holds.

type AssertRichTreeViewPro = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<RichTreeViewProSlotProps<{}, false>, 'RichTreeViewPro'>
  >
>;
