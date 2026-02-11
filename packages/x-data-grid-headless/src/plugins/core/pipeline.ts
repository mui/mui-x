export interface PipelineProcessor<TValue> {
  (value: TValue): TValue;
}

interface RegisteredPipelineProcessor<TValue> {
  name: string;
  priority: number;
  processor: PipelineProcessor<TValue>;
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

  register(name: string, priority: number, processor: PipelineProcessor<TValue>): () => void {
    const hadProcessor = this.processors.has(name);
    this.processors.set(name, { name, priority, processor });

    if (!hadProcessor) {
      // Topology changed (new processor added): invalidate the whole cache.
      this.previousRun = undefined;
    } else if (this.previousRun) {
      // Processor was replaced: keep upstream cache and invalidate this processor + downstream.
      const processorIndex = this.previousRun.processorNames.indexOf(name);
      if (processorIndex !== -1) {
        for (let i = processorIndex; i < this.previousRun.processorNames.length; i += 1) {
          this.previousRun.outputsByProcessor.delete(this.previousRun.processorNames[i]);
        }
      }
    }

    return () => {
      this.processors.delete(name);
      this.previousRun = undefined;
    };
  }

  private getSortedProcessors(): RegisteredPipelineProcessor<TValue>[] {
    return Array.from(this.processors.values()).sort((a, b) => a.priority - b.priority);
  }

  private runFrom(
    input: TValue,
    sortedProcessors: RegisteredPipelineProcessor<TValue>[],
    startIndex: number,
    outputsByProcessor: Map<string, TValue>,
  ): TValue {
    let currentValue = input;
    for (let i = startIndex; i < sortedProcessors.length; i += 1) {
      const { name, processor } = sortedProcessors[i];
      currentValue = processor(currentValue);
      outputsByProcessor.set(name, currentValue);
    }

    return currentValue;
  }

  recompute(fromProcessor?: string): TValue {
    const sortedProcessors = this.getSortedProcessors();
    const processorNames = sortedProcessors.map((processor) => processor.name);

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
      if (targetIndex > 0) {
        const previousProcessorName = processorNames[targetIndex - 1];
        const previousOutput = previousRun.outputsByProcessor.get(previousProcessorName);

        if (previousOutput !== undefined) {
          startIndex = targetIndex;
          input = previousOutput;

          for (let i = 0; i < targetIndex; i += 1) {
            const processorName = processorNames[i];
            const cachedOutput = previousRun.outputsByProcessor.get(processorName);
            if (cachedOutput !== undefined) {
              outputsByProcessor.set(processorName, cachedOutput);
            }
          }
        }
      }
    }

    const output = this.runFrom(input, sortedProcessors, startIndex, outputsByProcessor);
    this.previousRun = {
      processorNames,
      outputsByProcessor,
    };

    this.options.onRecompute(output);
    return output;
  }
}
