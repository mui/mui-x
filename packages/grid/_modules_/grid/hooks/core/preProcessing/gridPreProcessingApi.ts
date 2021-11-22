export type PreProcessorCallback = (value: any, params?: any) => any;

export enum GridPreProcessingGroup {
  hydrateColumns = 'hydrateColumns',
}

export interface GridPreProcessingApi {
  /**
   * Register a pre-processor and emit an event to notify the agents to re-apply the pre-processors.
   * @param {GridPreProcessingGroup} group The name of the group to bind this pre-processor to.
   * @param {number} id An unique and static identifier of the pre-processor.
   * @param {PreProcessorCallback} callback The pre-processor to register.
   * @returns {() => void} A function to unregister the pre-processor.
   * @ignore - do not document.
   */
  unstable_registerPreProcessor: (
    group: GridPreProcessingGroup,
    id: string,
    callback: PreProcessorCallback,
  ) => () => void;
  /**
   * Apply on the value the pre-processors registered on the given group.
   * @param {GridPreProcessingGroup} group The name of the processing group.
   * @param {any} value The value to pass to the first pre-processor.
   * @param {any} params Additional params to pass to the pre-processors.
   * @returns {any} The value after passing through all pre-processors.
   * @ignore - do not document.
   */
  unstable_applyPreProcessors: (group: GridPreProcessingGroup, value: any, params?: any) => any;
}
