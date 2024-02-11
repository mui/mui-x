export type ControllablePromise<T = unknown> = Promise<T> & {
  resolve: T extends unknown ? (value?: T) => void : (value: T) => void;
  reject: (reason?: any) => void;
};

export function createControllablePromise() {
  let resolve: ControllablePromise['resolve'];
  let reject: ControllablePromise['reject'];
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  }) as ControllablePromise;
  promise.resolve = resolve!;
  promise.reject = reject!;
  return promise;
}
