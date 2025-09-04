import { warnOnce } from '@mui/x-internals/warning';
import {
  BaseReorderOperation,
  SameParentSwapOperation,
  CrossParentLeafOperation,
  CrossParentGroupOperation,
} from './operations';
import type { ReorderExecutionContext } from './types';

/**
 * Executor class for handling row reorder operations in grouped data grids.
 *
 * This class coordinates the execution of different reorder operation types,
 * trying each operation in order until one succeeds or all fail.
 */
class RowReorderExecutor {
  private operations: BaseReorderOperation[];

  constructor(operations: BaseReorderOperation[]) {
    this.operations = operations;
  }

  async execute(ctx: ReorderExecutionContext): Promise<void> {
    for (const operation of this.operations) {
      const detectedOperation = operation.detectOperation(ctx);

      if (detectedOperation) {
        // eslint-disable-next-line no-await-in-loop
        await operation.executeOperation(detectedOperation, ctx);
        return;
      }
    }

    warnOnce(
      [
        'MUI X: The parameters provided to the `setRowIndex()` resulted in a no-op.',
        'Consider looking at the documentation at https://mui.com/x/react-data-grid/row-grouping/',
      ],
      'warning',
    );
  }
}

export const rowGroupingReorderExecutor = new RowReorderExecutor([
  new SameParentSwapOperation(),
  new CrossParentLeafOperation(),
  new CrossParentGroupOperation(),
]);
