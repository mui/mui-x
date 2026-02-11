import { describe, expect, it, vi } from 'vitest';
import { Pipeline } from './pipeline';

describe('Pipeline', () => {
  it('recompute() should run all processors in priority order', () => {
    const onRecompute = vi.fn();
    const pipeline = new Pipeline<number>({
      getInitialValue: () => 5,
      onRecompute,
    });

    const calls: string[] = [];
    pipeline.register('first', 30, (value) => {
      calls.push('first');
      return value + 1;
    });
    pipeline.register('second', 10, (value) => {
      calls.push('second');
      return value * 2;
    });
    pipeline.register('third', 20, (value) => {
      calls.push('third');
      return value - 3;
    });

    const result = pipeline.recompute();

    expect(result).toBe(8);
    expect(onRecompute).toHaveBeenCalledWith(8);
    expect(calls).toEqual(['second', 'third', 'first']);
  });

  it('recompute(fromProcessor) should skip processors before that processor', () => {
    const onRecompute = vi.fn();
    const pipeline = new Pipeline<number>({
      getInitialValue: () => 5,
      onRecompute,
    });

    let firstCalls = 0;
    let secondCalls = 0;
    let thirdCalls = 0;

    pipeline.register('first', 10, (value) => {
      firstCalls += 1;
      return value + 1;
    });
    pipeline.register('second', 20, (value) => {
      secondCalls += 1;
      return value * 2;
    });
    pipeline.register('third', 30, (value) => {
      thirdCalls += 1;
      return value - 3;
    });

    const firstResult = pipeline.recompute();
    expect(firstResult).toBe(9);
    expect(firstCalls).toBe(1);
    expect(secondCalls).toBe(1);
    expect(thirdCalls).toBe(1);

    const partialResult = pipeline.recompute('second');
    expect(partialResult).toBe(9);
    expect(firstCalls).toBe(1);
    expect(secondCalls).toBe(2);
    expect(thirdCalls).toBe(2);
    expect(onRecompute).toHaveBeenNthCalledWith(1, 9);
    expect(onRecompute).toHaveBeenNthCalledWith(2, 9);
  });

  it('re-registering a processor should preserve upstream cache', () => {
    const onRecompute = vi.fn();
    const pipeline = new Pipeline<number>({
      getInitialValue: () => 5,
      onRecompute,
    });

    let firstCalls = 0;
    let secondCalls = 0;
    let thirdCalls = 0;

    pipeline.register('first', 10, (value) => {
      firstCalls += 1;
      return value + 1;
    });
    pipeline.register('second', 20, (value) => {
      secondCalls += 1;
      return value * 2;
    });
    pipeline.register('third', 30, (value) => {
      thirdCalls += 1;
      return value - 3;
    });

    expect(pipeline.recompute()).toBe(9);
    expect(firstCalls).toBe(1);
    expect(secondCalls).toBe(1);
    expect(thirdCalls).toBe(1);

    pipeline.register('second', 20, (value) => {
      secondCalls += 1;
      return value * 3;
    });

    const recomputed = pipeline.recompute('second');
    expect(recomputed).toBe(15);
    expect(firstCalls).toBe(1);
    expect(secondCalls).toBe(2);
    expect(thirdCalls).toBe(2);
    expect(onRecompute).toHaveBeenNthCalledWith(2, 15);
  });
});
