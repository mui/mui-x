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
}

export class Pipeline<TValue> {
  private readonly processors = new Map<string, RegisteredPipelineProcessor<TValue>>();
  private previousRun:
    | {
        processorNames: string[];
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

    if (!existingProcessor) {
      if (isEnabled) {
        // Topology changed with a new enabled processor: invalidate the whole cache.
        this.previousRun = undefined;
      } else {
        // Keep cache compatibility by tracking disabled processors in the topology.
        this.previousRun?.processorNames.push(name);
      }
    } else if (
      existingProcessor.enabled !== isEnabled ||
      (isEnabled && existingProcessor.processor !== processor)
    ) {
      this.invalidateFromProcessor(name);
    }

    return () => {
      this.processors.delete(name);
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
      this.previousRun.outputsByProcessor.delete(this.previousRun.processorNames[i]);
    }
  }

  private getOrderedProcessors(): RegisteredPipelineProcessor<TValue>[] {
    return Array.from(this.processors.values());
  }

  private runFrom(
    input: TValue,
    orderedProcessors: RegisteredPipelineProcessor<TValue>[],
    startIndex: number,
    outputsByProcessor: Map<string, TValue>,
  ): TValue {
    let currentValue = input;
    for (let i = startIndex; i < orderedProcessors.length; i += 1) {
      const { name, processor, enabled } = orderedProcessors[i];
      if (!enabled) {
        continue;
      }

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

    const output = this.runFrom(input, orderedProcessors, startIndex, outputsByProcessor);
    this.previousRun = {
      processorNames,
      outputsByProcessor,
    };

    this.options.onRecompute(output);
    return output;
  }
}
