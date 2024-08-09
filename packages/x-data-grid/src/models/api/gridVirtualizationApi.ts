export interface GridVirtualizationApi {
  /**
   * Enable/disable virtualization.
   * @param {boolean} enabled The enabled value for virtualization
   */
  unstable_setVirtualization: (enabled: boolean) => void;
  /**
   * Enable/disable column virtualization.
   * @param {boolean} enabled The enabled value for column virtualization
   */
  unstable_setColumnVirtualization: (enabled: boolean) => void;
}

export interface GridVirtualizationPrivateApi {
  /**
   * Update grid rendering context.
   * @returns {GridRenderContext} The `GridRenderContext`.
   */
  updateRenderContext?: () => void;
  /**
   * Lock/unlock the virtual scroller events.
   * @param {boolean} locked The value for the lock
   */
  setVirtualScrollerLock: (locked: boolean) => void;
}
