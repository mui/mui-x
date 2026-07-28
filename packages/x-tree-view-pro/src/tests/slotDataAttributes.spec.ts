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

// Compile-time assertion: every slot of every exported top-level component and provider
// `*SlotProps` in `x-tree-view-pro` must accept `data-*` once `DataAttributesOverrides` is augmented,
// so a regression names the offending slot. Slots of nested components (plot elements,
// `use*` hooks) are exercised through their parent's `*SlotProps`.

type AssertRichTreeViewPro = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<RichTreeViewProSlotProps<{}, false>, 'RichTreeViewPro'>
  >
>;
