export type PreProcessorCallback = (value: any, params?: any) => any;

export enum GridPreProcessingGroup {
  hydrateColumns = 'hydrateColumns',
}

export interface GridPreProcessingApi {
  /**
   * Register a pre-processor and emit an event to notify the agents to re-apply the pre-processors.
   * @param {GridPreProcessingGroup} name The name of the group to bind this pre-processor to.
   * @param {PreProcessorCallback} callback The pre-processor to register.
   * @ignore - do not document.
   */
  unstable_registerPreProcessor: (
    name: GridPreProcessingGroup,
    callback: PreProcessorCallback,
  ) => () => void;
  /**
   * Apply on the value the pre-processors registered on the given name.
   * @param {GridPreProcessingGroup} name The name of the processing group.
   * @param {any} value The value to pass to the first pre-processor.
   * @param {any} params Additional paramas to pass to the pre-processors.
   * @returns {any} The value after passing through all pre-processors.
   * @ignore - do not document.
   */
  unstable_applyPreProcessors: (name: GridPreProcessingGroup, value: any, params?: any) => any;
}
