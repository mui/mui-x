export interface GridInfiniteLoaderApi {
  /**
   * Handles the last visible row ref.
   * @param {HTMLElement} node The HTML element that the ref is attatched to.
   * @ignore - do not document. Remove before releasing v5 stable version.
   */
  unstable_lastVisibleRowRef: (node: HTMLElement) => void;
}
