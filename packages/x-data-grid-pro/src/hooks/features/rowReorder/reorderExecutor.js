import { warnOnce } from '@mui/x-internals/warning';
/**
 * Base class for all reorder operations.
 * Provides abstract methods for operation detection and execution.
 */
export class BaseReorderOperation {
}
/**
 * Executor class for handling row reorder operations in grouped data grids.
 *
 * This class coordinates the execution of different reorder operation types,
 * trying each operation in order until one succeeds or all fail.
 */
export class RowReorderExecutor {
    operations;
    constructor(operations) {
        this.operations = operations;
    }
    async execute(ctx) {
        for (const operation of this.operations) {
            const detectedOperation = operation.detectOperation(ctx);
            if (detectedOperation) {
                // eslint-disable-next-line no-await-in-loop
                await operation.executeOperation(detectedOperation, ctx);
                return;
            }
        }
        warnOnce([
            'MUI X: The parameters provided to the API method resulted in a no-op.',
            'Consider looking at the documentation at https://mui.com/x/react-data-grid/row-ordering/',
        ], 'warning');
    }
}
