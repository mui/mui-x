import { expect } from 'vitest';
import { ToBeClonable, toBeClonable } from './matchers/toBeClonable';
import { ToUpdateOptions, toUpdateOptions } from './matchers/toUpdateOptions';
import { ToUpdateState, toUpdateState } from './matchers/toUpdateState';

declare module 'vitest' {
  // Type parameters must stay identical to Vitest's own `Matchers` declaration,
  // including the unused return type `R`, otherwise TypeScript reports TS2428.
  interface Matchers<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    R extends void | Promise<void> = void | Promise<void>,
    T = unknown,
  > extends GestureMatchers<T> {}
}

export type GestureMatchers<R = any> = ToUpdateOptions<R> & ToBeClonable<R> & ToUpdateState<R>;

expect.extend({
  toUpdateOptions,
  toBeClonable,
  toUpdateState,
});
