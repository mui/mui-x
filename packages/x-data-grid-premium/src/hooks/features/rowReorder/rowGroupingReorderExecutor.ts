import { RowReorderExecutor, SameParentSwapOperation } from '@mui/x-data-grid-pro/internals';
import { CrossParentLeafOperation, CrossParentGroupOperation } from './operations';

export const rowGroupingReorderExecutor = new RowReorderExecutor([
  new SameParentSwapOperation(),
  new CrossParentLeafOperation(),
  new CrossParentGroupOperation(),
]);
