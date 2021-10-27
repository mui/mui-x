/**
 * The Clipboard API interface that is available in the grid [[apiRef]].
 */
export interface GridClipboardApi {
  /**
   * Copies the selected rows to the clipboard.
   * The fields will separated by the TAB character.
   * @param {boolean} includeHeaders Whether to include the headers or not. Default is `false`.
   * @ignore - do not document.
   */
  unsafe_copySelectedRowsToClipboard: (includeHeaders?: boolean) => void;
}
