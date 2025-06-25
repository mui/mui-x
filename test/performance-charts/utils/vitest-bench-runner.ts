import { NodeBenchmarkRunner, VitestRunner } from 'vitest/runners';
import { Benchmark, BenchmarkResult, BenchTask, RunnerTestSuite, Suite } from 'vitest';
import { getBenchFn, getBenchOptions } from 'vitest/suite';
import { updateTask as updateRunnerTask, type TaskUpdateEvent, type Task } from '@vitest/runner';

// Adapted from https://github.com/vitest-dev/vitest/blob/c1f78d2adc78ef08ef8b61b0dd6a925fb08f20b6/packages/vitest/src/runtime/runners/benchmark.ts
export default class VitestBenchRunner extends NodeBenchmarkRunner implements VitestRunner {
  async runSuite(suite: RunnerTestSuite): Promise<void> {
    await runBenchmarkSuite(suite, this);
  }
}

type DeferPromise<T> = Promise<T> & {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
};

function createDefer<T>(): DeferPromise<T> {
  let resolve: ((value: T | PromiseLike<T>) => void) | null = null;
  let reject: ((reason?: any) => void) | null = null;

  const p = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  }) as DeferPromise<T>;

  p.resolve = resolve!;
  p.reject = reject!;
  return p;
}

function createBenchmarkResult(name: string): BenchmarkResult {
  return {
    name,
    rank: 0,
    rme: 0,
    samples: [] as number[],
  } as BenchmarkResult;
}

const benchmarkTasks = new WeakMap<Benchmark, import('tinybench').Task>();

async function runBenchmarkSuite(suite: Suite, runner: NodeBenchmarkRunner) {
  const { Task, Bench } = await runner.importTinybench();

  const start = performance.now();

  const benchmarkGroup: Benchmark[] = [];
  const benchmarkSuiteGroup = [];
  for (const task of suite.tasks) {
    if (task.mode !== 'run' && task.mode !== 'queued') {
      continue;
    }

    if (task.meta?.benchmark) {
      benchmarkGroup.push(task as Benchmark);
    } else if (task.type === 'suite') {
      benchmarkSuiteGroup.push(task);
    }
  }

  // run sub suites sequentially
  for (const subSuite of benchmarkSuiteGroup) {
    // eslint-disable-next-line no-await-in-loop
    await runBenchmarkSuite(subSuite, runner);
  }

  if (benchmarkGroup.length) {
    const defer = createDefer();
    suite.result = {
      state: 'run',
      startTime: start,
      benchmark: createBenchmarkResult(suite.name),
    };
    updateTask('suite-prepare', suite);

    const addBenchTaskListener = (task: InstanceType<typeof Task>, benchmark: Benchmark) => {
      task.addEventListener(
        'complete',
        (e) => {
          const task = e.task;
          const taskRes = task.result!;
          const result = benchmark.result!.benchmark!;
          benchmark.result!.state = 'pass';
          Object.assign(result, taskRes);
          // compute extra stats and free raw samples as early as possible
          const samples = result.samples;
          result.sampleCount = samples.length;
          result.median =
            samples.length % 2
              ? samples[Math.floor(samples.length / 2)]
              : (samples[samples.length / 2] + samples[samples.length / 2 - 1]) / 2;
          if (!runner.config.benchmark?.includeSamples) {
            result.samples.length = 0;
          }
          updateTask('test-finished', benchmark);
        },
        {
          once: true,
        },
      );
      task.addEventListener(
        'error',
        (e) => {
          const task = e.task;
          defer.reject(benchmark ? task.result!.error : e);
        },
        {
          once: true,
        },
      );
    };

    benchmarkGroup.forEach((benchmark) => {
      const options = getBenchOptions(benchmark);
      const benchmarkInstance = new Bench(options);

      const benchmarkFn = getBenchFn(benchmark);

      benchmark.result = {
        state: 'run',
        startTime: start,
        benchmark: createBenchmarkResult(benchmark.name),
      };

      const task = new Task(benchmarkInstance, benchmark.name, benchmarkFn, {
        beforeEach() {
          return options.beforeEach?.(this);
        },
        afterEach() {
          return options.afterEach?.(this);
        },
      });
      benchmarkTasks.set(benchmark, task);
      addBenchTaskListener(task, benchmark);
    });

    const tasks: [BenchTask, Benchmark][] = [];

    for (const benchmark of benchmarkGroup) {
      const task = benchmarkTasks.get(benchmark)!;
      updateTask('test-prepare', benchmark);
      // eslint-disable-next-line no-await-in-loop
      await task.warmup();
      tasks.push([
        // eslint-disable-next-line no-await-in-loop
        await new Promise<BenchTask>((resolve) =>
          setTimeout(async () => {
            resolve(await task.run());
          }),
        ),
        benchmark,
      ]);
    }

    suite.result!.duration = performance.now() - start;
    suite.result!.state = 'pass';

    updateTask('suite-finished', suite);
    defer.resolve(null);

    await defer;
  }

  function updateTask(event: TaskUpdateEvent, task: Task) {
    updateRunnerTask(event, task, runner);
  }
}
