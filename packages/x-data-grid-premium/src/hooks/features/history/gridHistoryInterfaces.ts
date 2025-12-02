import type { GridRowId, GridEvents, GridValidRowModel } from '@mui/x-data-grid-pro';

/**
 * Handler for a specific grid event
 */
export interface GridHistoryEventHandler<T = any> {
  /**
   * Store the data to be used for undo/redo operations.
   * @param {any} params The parameters from the original event.
   * @returns {T} The data to store in the history queue.
   */
  store: (...params: any[]) => T;
  /**
   * Undo the changes made by this event.
   * @param {T} data The stored data.
   * @returns {boolean | Promise<boolean>} True if the operation was successful, false otherwise.
   */
  undo: (data: T) => void | Promise<void>;
  /**
   * Redo the changes made by this event.
   * @param {T} data The stored data.
   * @returns {boolean | Promise<boolean>} True if the operation was successful, false otherwise.
   */
  redo: (data: T) => void | Promise<void>;
  /**
   * Validate if the undo/redo operation can be performed.
   * @param {T} data The stored data.
   * @param {'undo' | 'redo'} operation - The operation to validate.
   * @returns {boolean} True if the operation is valid, false otherwise.
   */
  validate: (data: T, operation: 'undo' | 'redo') => boolean;
}

export interface GridHistoryItem<T = any> {
  eventName: GridEvents;
  data: T;
}

export interface GridHistoryState {
  queue: GridHistoryItem[];
  /**
   * The current position in the queue.
   * Points to the last executed action.
   * -1 means no actions have been executed.
   */
  currentPosition: number;
}

export interface GridHistoryApi {
  /**
   * The history API.
   */
  history: {
    /**
     * Undo the last action.
     * @returns {Promise<boolean>} True if the operation was successful, false otherwise.
     */
    undo: () => Promise<boolean>;
    /**
     * Redo the last undone action.
     * @returns {Promise<boolean>} True if the operation was successful, false otherwise.
     */
    redo: () => Promise<boolean>;
    /**
     * Clear the entire history.
     */
    clear: () => void;
    /**
     * @returns {boolean} True if there are undo steps available, false otherwise.
     */
    canUndo: () => boolean;
    /**
     * @returns {boolean} True if there are redo steps available, false otherwise.
     */
    canRedo: () => boolean;
  };
}

// Default history event handlers interfaces

export interface GridCellEditHistoryData {
  id: GridRowId;
  field: string;
  oldValue: any;
  newValue: any;
}

export interface GridRowEditHistoryData {
  id: GridRowId;
  oldRow: GridValidRowModel;
  newRow: GridValidRowModel;
}
