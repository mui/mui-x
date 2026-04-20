import type { AllTrue, Assert, AssertAllSlotsAcceptDataAttributes } from '@mui/x-internals/types';
import type { GridProSlotProps } from '@mui/x-data-grid-pro/internals';

// Compile-time assertion: every slot in the user-facing `slotProps` map of `x-data-grid-pro`
// must accept `data-*` and `aria-*` attributes. The test compiles iff the assertion holds.

type AssertDataGridPro = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<GridProSlotProps, 'DataGridPro'>>
>;
