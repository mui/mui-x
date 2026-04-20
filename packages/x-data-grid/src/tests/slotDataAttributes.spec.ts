import type { AllTrue, Assert, AssertAllSlotsAcceptDataAttributes } from '@mui/x-internals/types';
import type { GridSlotsComponentsProps } from '@mui/x-data-grid';

// Compile-time assertion: every slot in the user-facing `slotProps` map of `x-data-grid`
// must accept `data-*` and `aria-*` attributes. The test compiles iff the assertion holds.

type AssertDataGrid = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<GridSlotsComponentsProps, 'DataGrid'>>
>;
