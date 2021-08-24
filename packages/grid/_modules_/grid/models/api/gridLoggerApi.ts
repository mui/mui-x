import { Logger } from '../logger';

/**
 * The logger API interface that is available in the grid `apiRef`.
 */
export interface GridLoggerApi {
  /**
   * @internal
   */
  getLogger: (name: string) => Logger;
}
