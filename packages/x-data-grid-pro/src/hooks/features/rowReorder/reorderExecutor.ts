import { warnOnce } from '@mui/x-internals/warning';
import type { ReorderExecutionContext, ReorderOperation } from './types';

/**
 * Base class for all reorder operations.
 * Provides abstract methods for operation detection and execution.
 */
export abstract class BaseReorderOperation {
  abstract readonly operationType: string;

  /**
   * Detects if this operation can handle the given context.
   */
  abstract detectOperation(ctx: ReorderExecutionContext): ReorderOperation | null;

  /**
   * Executes the detected operation.
   */
  abstract executeOperation(
    operation: ReorderOperation,
    ctx: ReorderExecutionContext,
  ): Promise<void> | void;
}

/**
 * Executor class for handling row reorder operations in grouped data grids.
 *
 * This class coordinates the execution of different reorder operation types,
 * trying each operation in order until one succeeds or all fail.
 */
export class RowReorderExecutor {
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
        'MUI X: The parameters provided to the API method resulted in a no-op.',
        'Consider looking at the documentation at https://mui.com/x/react-data-grid/row-ordering/',
      ],
      'warning',
    );
  }
}
