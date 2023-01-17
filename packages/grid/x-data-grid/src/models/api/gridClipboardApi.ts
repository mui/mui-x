/**
 * The Clipboard API interface that is available in the grid [[apiRef]].
 */
export interface GridClipboardApi {
  /**
   * Copies the selected rows to the clipboard.
   * The fields will be separated by the TAB character.
   * @ignore - do not document.
   */
  unstable_copySelectedRowsToClipboard: () => void;
}
