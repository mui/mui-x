export interface PipelineProcessor<TValue> {
  (value: TValue): TValue;
}

interface RegisteredPipelineProcessor<TValue> {
  name: string;
  processor: PipelineProcessor<TValue>;
  enabled: boolean;
}

export interface PipelineOptions<TValue> {
  getInitialValue: () => TValue;
  onRecompute: (value: TValue) => void;
  /**
   * Called when a disabled processor has cached output but its input has changed.
   * Allows handling structural changes (adds/removes) while preserving
   * the cached state for unchanged items (edits).
   * @param {Object} params - The parameters for the reconciliation.
   * @param {TValue} params.previousInput - The input of the previous run.
   * @param {TValue} params.currentInput - The input of the current run.
   * @param {TValue} params.cachedOutput - The output of the cached run.
   * @param {PipelineProcessor<TValue>} params.processor - The processor that has changed.
   * @returns {TValue} The output of the reconciliation.
   */
  reconcileDisabledProcessor?: (params: {
    previousInput: TValue;
    currentInput: TValue;
    cachedOutput: TValue;
    processor: PipelineProcessor<TValue>;
  }) => TValue;
}

export class Pipeline<TValue> {
  // Values are `null` for temporarily unregistered processors
  private readonly processors = new Map<string, RegisteredPipelineProcessor<TValue> | null>();
  private previousRun:
    | {
        processorNames: string[];
        inputsByProcessor: Map<string, TValue>;
        outputsByProcessor: Map<string, TValue>;
      }
    | undefined;

  constructor(private readonly options: PipelineOptions<TValue>) {}

  register(
    name: string,
    processor: PipelineProcessor<TValue>,
    options?: { disabled?: boolean },
  ): () => void {
    const existingProcessor = this.processors.get(name);
    const isEnabled =
      options?.disabled !== undefined ? !options.disabled : (existingProcessor?.enabled ?? true);

    this.processors.set(name, {
      name,
      processor,
      enabled: isEnabled,
    });

    if (existingProcessor === undefined) {
      if (isEnabled) {
        // Topology changed with a new enabled processor: invalidate the whole cache.
        this.previousRun = undefined;
      } else {
        // Keep cache compatibility by tracking disabled processors in the topology.
        this.previousRun?.processorNames.push(name);
      }
    } else if (
      existingProcessor === null ||
      existingProcessor.enabled !== isEnabled ||
      (isEnabled && existingProcessor.processor !== processor)
    ) {
      this.invalidateFromProcessor(name);
    }

    return () => {
      this.processors.set(name, null);
      this.previousRun = undefined;
    };
  }

  enable(name: string): void {
    const processor = this.processors.get(name);
    if (!processor || processor.enabled) {
      return;
    }

    processor.enabled = true;
    this.invalidateFromProcessor(name);
  }

  disable(name: string): void {
    const processor = this.processors.get(name);
    if (!processor || !processor.enabled) {
      return;
    }

    processor.enabled = false;
  }

  private invalidateFromProcessor(name: string): void {
    if (!this.previousRun) {
      return;
    }

    const processorIndex = this.previousRun.processorNames.indexOf(name);
    if (processorIndex === -1) {
      this.previousRun = undefined;
      return;
    }

    for (let i = processorIndex; i < this.previousRun.processorNames.length; i += 1) {
      const processorName = this.previousRun.processorNames[i];
      this.previousRun.inputsByProcessor.delete(processorName);
      this.previousRun.outputsByProcessor.delete(processorName);
    }
  }

  private getOrderedProcessors(): RegisteredPipelineProcessor<TValue>[] {
    return Array.from(this.processors.values()).filter((processor) => processor !== null);
  }

  private runFrom(
    input: TValue,
    orderedProcessors: RegisteredPipelineProcessor<TValue>[],
    startIndex: number,
    inputsByProcessor: Map<string, TValue>,
    outputsByProcessor: Map<string, TValue>,
  ): TValue {
    let currentValue = input;
    for (let i = startIndex; i < orderedProcessors.length; i += 1) {
      const { name, processor, enabled } = orderedProcessors[i];
      if (!enabled) {
        const cachedOutput = this.previousRun?.outputsByProcessor.get(name);
        if (cachedOutput !== undefined) {
          const previousInput = this.previousRun?.inputsByProcessor.get(name);
          inputsByProcessor.set(name, currentValue);
          if (
            previousInput !== undefined &&
            previousInput !== currentValue &&
            this.options.reconcileDisabledProcessor
          ) {
            // Input changed and reconciliation is available — handle structural changes
            currentValue = this.options.reconcileDisabledProcessor({
              previousInput,
              currentInput: currentValue,
              cachedOutput,
              processor,
            });
          } else {
            // Same input or no reconciliation — replay cached output as-is
            currentValue = cachedOutput;
          }
          outputsByProcessor.set(name, currentValue);
        }
        continue;
      }

      inputsByProcessor.set(name, currentValue);
      currentValue = processor(currentValue);
      outputsByProcessor.set(name, currentValue);
    }

    return currentValue;
  }

  recompute(fromProcessor?: string): TValue {
    const orderedProcessors = this.getOrderedProcessors();
    const processorNames = orderedProcessors.map((processor) => processor.name);

    const previousRun = this.previousRun;
    const hasCompatiblePreviousRun =
      previousRun !== undefined &&
      previousRun.processorNames.length === processorNames.length &&
      previousRun.processorNames.every((name, index) => name === processorNames[index]);

    let startIndex = 0;
    let input = this.options.getInitialValue();
    const inputsByProcessor = new Map<string, TValue>();
    const outputsByProcessor = new Map<string, TValue>();

    if (fromProcessor !== undefined && hasCompatiblePreviousRun) {
      const targetIndex = processorNames.indexOf(fromProcessor);
      if (targetIndex !== -1) {
        let previousCachedOutput: TValue | undefined;
        for (let i = targetIndex - 1; i >= 0; i -= 1) {
          previousCachedOutput = previousRun.outputsByProcessor.get(processorNames[i]);
          if (previousCachedOutput !== undefined) {
            break;
          }
        }

        if (previousCachedOutput !== undefined) {
          startIndex = targetIndex;
          input = previousCachedOutput;

          for (let i = 0; i < targetIndex; i += 1) {
            const processorName = processorNames[i];
            const cachedInput = previousRun.inputsByProcessor.get(processorName);
            if (cachedInput !== undefined) {
              inputsByProcessor.set(processorName, cachedInput);
            }
            const cachedOutput = previousRun.outputsByProcessor.get(processorName);
            if (cachedOutput !== undefined) {
              outputsByProcessor.set(processorName, cachedOutput);
            }
          }
        } else {
          startIndex = targetIndex;
        }
      }
    }

    const output = this.runFrom(
      input,
      orderedProcessors,
      startIndex,
      inputsByProcessor,
      outputsByProcessor,
    );
    this.previousRun = {
      processorNames,
      inputsByProcessor,
      outputsByProcessor,
    };

    this.options.onRecompute(output);
    return output;
  }
}
