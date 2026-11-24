import type { GridGetRowsParams, GridUpdateRowParams } from '../../../models/gridDataSource';

export class GridGetRowsError<T extends GridGetRowsParams = GridGetRowsParams> extends Error {
  /**
   * The parameters used in the failed request
   */
  declare readonly params: T;

  /**
   * The original error that caused this error
   */
  declare readonly cause?: Error;

  constructor(options: { message: string; params: T; cause?: Error }) {
    super(options.message);
    this.name = 'GridGetRowsError';
    this.params = options.params;
    this.cause = options.cause;
  }
}

export class GridUpdateRowError extends Error {
  /**
   * The parameters used in the failed request
   */
  declare readonly params: GridUpdateRowParams;

  /**
   * The original error that caused this error
   */
  declare readonly cause?: Error;

  constructor(options: { message: string; params: GridUpdateRowParams; cause?: Error }) {
    super(options.message);
    this.name = 'GridUpdateRowError';
    this.params = options.params;
    this.cause = options.cause;
  }
}
