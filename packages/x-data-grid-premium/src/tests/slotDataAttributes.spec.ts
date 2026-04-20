import type { AllTrue, Assert, AssertAllSlotsAcceptDataAttributes } from '@mui/x-internals/types';
import type { GridPremiumSlotProps } from '../models/gridPremiumSlotProps';

// Compile-time assertion: every slot in the user-facing `slotProps` map of `x-data-grid-premium`
// must accept `data-*` and `aria-*` attributes. The test compiles iff the assertion holds.

type AssertDataGridPremium = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<GridPremiumSlotProps, 'DataGridPremium'>>
>;
