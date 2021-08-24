import { Logger } from '../logger';

/**
 * The logger API interface that is available in the grid `apiRef`.
 */
export interface GridLoggerApi {
  getLogger: (name: string) => Logger;
}
