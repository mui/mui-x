export interface GridInfiniteLoaderApi {
  /**
   * Stores the ref of the element at the bottom of the virtual scroller content that triggers the infinite loading.
   * @ignore - do not document.
   */
  unstable_infiniteLoadingTriggerRef: (node: HTMLElement | null) => void;
}
