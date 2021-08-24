import { Logger } from '../logger';

/**
 * The logger API interface that is available in the grid `apiRef`.
 */
export interface GridLoggerApi {
  /**
   * @ignore - do not document.
   */
  getLogger: (name: string) => Logger;
}
