import type { AllTrue, Assert, AssertAllSlotsAcceptDataAttributes } from '@mui/x-internals/types';
import type { GridSlotsComponentsProps } from '@mui/x-data-grid';

// Compile-time assertion: every slot in the user-facing `slotProps` map of `x-data-grid`
// must accept `data-*` attributes. The test compiles if and only if the assertion holds.

type AssertDataGrid = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<GridSlotsComponentsProps, 'DataGrid'>>
>;
