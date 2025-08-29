import { expect } from 'vitest';

export type MatcherState = ReturnType<typeof expect.getState>;

export interface SyncExpectationResult {
  pass: boolean;
  message: () => string;
  actual?: unknown;
  expected?: unknown;
}

export type AsyncExpectationResult = Promise<SyncExpectationResult>;

export interface SyncMatcherFn<T extends MatcherState = MatcherState> {
  (this: T, received: any, ...expected: Array<any>): SyncExpectationResult;
}

export interface AsyncMatcherFn<T extends MatcherState = MatcherState> {
  (this: T, received: any, ...expected: Array<any>): AsyncExpectationResult;
}
