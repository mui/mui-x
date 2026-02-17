import { describe, expect, it, vi } from 'vitest';
import { Pipeline } from './pipeline';

describe('Pipeline', () => {
  it('recompute() should run all processors in registration order', () => {
    const onRecompute = vi.fn();
    const pipeline = new Pipeline<number>({
      getInitialValue: () => 5,
      onRecompute,
    });

    const calls: string[] = [];
    pipeline.register('first', (value) => {
      calls.push('first');
      return value + 1;
    });
    pipeline.register('second', (value) => {
      calls.push('second');
      return value * 2;
    });
    pipeline.register('third', (value) => {
      calls.push('third');
      return value - 3;
    });

    const result = pipeline.recompute();

    expect(result).toBe(9);
    expect(onRecompute).toHaveBeenCalledWith(9);
    expect(calls).toEqual(['first', 'second', 'third']);
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

    pipeline.register('first', (value) => {
      firstCalls += 1;
      return value + 1;
    });
    pipeline.register('second', (value) => {
      secondCalls += 1;
      return value * 2;
    });
    pipeline.register('third', (value) => {
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

    pipeline.register('first', (value) => {
      firstCalls += 1;
      return value + 1;
    });
    pipeline.register('second', (value) => {
      secondCalls += 1;
      return value * 2;
    });
    pipeline.register('third', (value) => {
      thirdCalls += 1;
      return value - 3;
    });

    expect(pipeline.recompute()).toBe(9);
    expect(firstCalls).toBe(1);
    expect(secondCalls).toBe(1);
    expect(thirdCalls).toBe(1);

    pipeline.register('second', (value) => {
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

  it('disable() should replay cached output instead of passthrough', () => {
    const pipeline = new Pipeline<number>({
      getInitialValue: () => 5,
      onRecompute: () => {},
    });

    let firstCalls = 0;
    let secondCalls = 0;
    let thirdCalls = 0;

    pipeline.register('first', (value) => {
      firstCalls += 1;
      return value + 1;
    });
    pipeline.register('second', (value) => {
      secondCalls += 1;
      return value * 2;
    });
    pipeline.register('third', (value) => {
      thirdCalls += 1;
      return value - 3;
    });

    // first: 5+1=6, second: 6*2=12, third: 12-3=9
    expect(pipeline.recompute()).toBe(9);

    pipeline.disable('second');

    // second is disabled but replays its cached output (12), so third: 12-3=9
    const recomputed = pipeline.recompute('second');
    expect(recomputed).toBe(9);
    expect(firstCalls).toBe(1);
    expect(secondCalls).toBe(1);
    expect(thirdCalls).toBe(2);
  });

  it('enable() should invalidate cache from that processor and run it again', () => {
    const pipeline = new Pipeline<number>({
      getInitialValue: () => 5,
      onRecompute: () => {},
    });

    let firstCalls = 0;
    let secondCalls = 0;
    let thirdCalls = 0;

    pipeline.register('first', (value) => {
      firstCalls += 1;
      return value + 1;
    });
    pipeline.register('second', (value) => {
      secondCalls += 1;
      return value * 2;
    });
    pipeline.register('third', (value) => {
      thirdCalls += 1;
      return value - 3;
    });

    expect(pipeline.recompute()).toBe(9);

    pipeline.disable('second');
    // Disabled replays cached output, so result is still 9
    expect(pipeline.recompute('second')).toBe(9);

    pipeline.enable('second');
    const recomputed = pipeline.recompute('second');

    expect(recomputed).toBe(9);
    expect(firstCalls).toBe(1);
    expect(secondCalls).toBe(2);
    expect(thirdCalls).toBe(3);
  });

  it('disable() should passthrough when there is no cached output to replay', () => {
    const pipeline = new Pipeline<number>({
      getInitialValue: () => 5,
      onRecompute: () => {},
    });

    let secondCalls = 0;

    pipeline.register('first', (value) => value + 1);
    pipeline.register(
      'second',
      (value) => {
        secondCalls += 1;
        return value * 2;
      },
      { disabled: true },
    );
    pipeline.register('third', (value) => value - 3);

    // second is disabled with no prior cached output → passthrough
    // first: 5+1=6, second: skipped (no cache), third: 6-3=3
    expect(pipeline.recompute()).toBe(3);
    expect(secondCalls).toBe(0);
  });

  it('registering a disabled processor should preserve upstream cache', () => {
    const pipeline = new Pipeline<number>({
      getInitialValue: () => 5,
      onRecompute: () => {},
    });

    let firstCalls = 0;
    let secondCalls = 0;
    let thirdCalls = 0;

    pipeline.register('first', (value) => {
      firstCalls += 1;
      return value + 1;
    });
    pipeline.register('second', (value) => {
      secondCalls += 1;
      return value * 2;
    });

    expect(pipeline.recompute()).toBe(12);
    expect(firstCalls).toBe(1);
    expect(secondCalls).toBe(1);

    pipeline.register(
      'third',
      (value) => {
        thirdCalls += 1;
        return value - 3;
      },
      { disabled: true },
    );

    expect(pipeline.recompute('second')).toBe(12);
    expect(firstCalls).toBe(1);
    expect(secondCalls).toBe(2);
    expect(thirdCalls).toBe(0);
  });

  it('enabling a processor registered as disabled should apply it without recomputing upstream', () => {
    const pipeline = new Pipeline<number>({
      getInitialValue: () => 5,
      onRecompute: () => {},
    });

    let firstCalls = 0;
    let secondCalls = 0;
    let thirdCalls = 0;

    pipeline.register('first', (value) => {
      firstCalls += 1;
      return value + 1;
    });
    pipeline.register('second', (value) => {
      secondCalls += 1;
      return value * 2;
    });
    pipeline.register(
      'third',
      (value) => {
        thirdCalls += 1;
        return value - 3;
      },
      { disabled: true },
    );

    expect(pipeline.recompute()).toBe(12);
    expect(firstCalls).toBe(1);
    expect(secondCalls).toBe(1);
    expect(thirdCalls).toBe(0);

    pipeline.enable('third');

    expect(pipeline.recompute('third')).toBe(9);
    expect(firstCalls).toBe(1);
    expect(secondCalls).toBe(1);
    expect(thirdCalls).toBe(1);
  });

  it('manual mode pattern: downstream processor should use upstream cached output after enable→recompute→disable', () => {
    const pipeline = new Pipeline<number>({
      getInitialValue: () => 5,
      onRecompute: () => {},
    });

    let firstCalls = 0;
    let secondCalls = 0;

    pipeline.register(
      'first',
      (value) => {
        firstCalls += 1;
        return value + 1;
      },
      { disabled: true },
    );
    pipeline.register(
      'second',
      (value) => {
        secondCalls += 1;
        return value * 2;
      },
      { disabled: true },
    );

    // Initial full recompute — both disabled, nothing runs
    expect(pipeline.recompute()).toBe(5);
    expect(firstCalls).toBe(0);
    expect(secondCalls).toBe(0);

    // Manual apply for "first": enable → recompute → disable
    pipeline.enable('first');
    expect(pipeline.recompute('first')).toBe(6);
    pipeline.disable('first');

    // first ran, second was still disabled
    expect(firstCalls).toBe(1);
    expect(secondCalls).toBe(0);

    // Manual apply for "second": enable → recompute → disable
    pipeline.enable('second');
    const result = pipeline.recompute('second');
    pipeline.disable('second');

    // second should have received first's cached output (6), not the initial value (5)
    expect(result).toBe(12); // (5 + 1) * 2 = 12
    expect(firstCalls).toBe(1); // first was NOT re-run
    expect(secondCalls).toBe(1);
  });
});
