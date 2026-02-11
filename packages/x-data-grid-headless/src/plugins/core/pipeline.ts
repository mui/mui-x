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

  constructor(private readonly options: PipelineOptions<TValue>) {}

  register(name: string, priority: number, processor: PipelineProcessor<TValue>): () => void {
    this.processors.set(name, { name, priority, processor });

    return () => {
      this.processors.delete(name);
    };
  }

  private run(input: TValue): TValue {
    const sortedProcessors = Array.from(this.processors.values()).sort(
      (a, b) => a.priority - b.priority,
    );

    let currentValue = input;
    for (const { processor } of sortedProcessors) {
      currentValue = processor(currentValue);
    }

    return currentValue;
  }

  recompute(): TValue {
    const output = this.run(this.options.getInitialValue());
    this.options.onRecompute(output);
    return output;
  }
}
