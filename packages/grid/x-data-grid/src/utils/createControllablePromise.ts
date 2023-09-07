export type ControllablePromise<T = unknown> = Promise<T> & {
  resolve: T extends unknown ? (value?: T) => void : (value: T) => void;
  reject: (reason?: any) => void;
};

export class AbortError extends Error {}

export function createControllablePromise<T = unknown>() {
  let resolve: ControllablePromise<T>['resolve'];
  let reject: ControllablePromise<T>['reject'];

  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve as any;
    reject = _reject;
  }) as ControllablePromise<T>;

  promise.resolve = resolve!;
  promise.reject = reject!;

  return promise;
}
