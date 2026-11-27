export interface GridLiveRegionPrivateApi {
  /**
   * The live region element, rendered once in the root.
   */
  liveRegionRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Announces a message to screen readers through the live region.
   * @param {string} message The message to announce.
   */
  announce: (message: string) => void;
}
