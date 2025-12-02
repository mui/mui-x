import { expect } from 'vitest';
import { ToBeClonable, toBeClonable } from './matchers/toBeClonable';
import { ToUpdateOptions, toUpdateOptions } from './matchers/toUpdateOptions';
import { ToUpdateState, toUpdateState } from './matchers/toUpdateState';

declare module 'vitest' {
  interface Matchers<T = any> extends GestureMatchers<T> {}
}

export type GestureMatchers<R = any> = ToUpdateOptions<R> & ToBeClonable<R> & ToUpdateState<R>;

expect.extend({
  toUpdateOptions,
  toBeClonable,
  toUpdateState,
});
