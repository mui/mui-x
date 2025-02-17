import { GridGetRowsParams, GridUpdateRowParams } from '../../../models/gridDataSource';

/**
 * Type of data source operation that caused the error
 */
export type GridDataSourceOperationType = 'fetchRows' | 'updateRow';

/**
 * Custom error class for data source operations
 */
export class GridDataSourceError<
  T extends GridGetRowsParams = GridGetRowsParams,
  Q extends GridUpdateRowParams = GridUpdateRowParams,
> extends Error {
  /**
   * The type of operation that failed
   */
  readonly operationType: GridDataSourceOperationType;

  /**
   * The parameters used in the failed request
   */
  readonly params: T | Q;

  /**
   * The original error that caused this error
   */
  readonly cause?: Error;

  constructor(options: {
    message: string;
    operationType: GridDataSourceOperationType;
    params: T | Q;
    cause?: Error;
  }) {
    super(options.message);
    this.name = 'GridDataSourceError';
    this.operationType = options.operationType;
    this.params = options.params;
    this.cause = options.cause;
  }

  /**
   * Returns true if this error was caused by a fetch operation
   */
  isFetch(): this is GridDataSourceError & { params: T } {
    return this.operationType === 'fetchRows';
  }

  /**
   * Returns true if this error was caused by an update operation
   */
  isUpdate(): this is GridDataSourceError & { params: Q } {
    return this.operationType === 'updateRow';
  }
}
