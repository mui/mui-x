'use client';
/* eslint-disable react-compiler/react-compiler */
import * as React from 'react';
import type { Store } from '@mui/x-internals/store';
import useLazyRef from '@mui/utils/useLazyRef';
import { type ChartAnyPluginSignature, type ChartState } from '../models';

const noop = () => {};

export function useLazySelectorEffect<
  TSignatures extends readonly ChartAnyPluginSignature[],
  Value,
>(
  store: Store<ChartState<TSignatures>>,
  selector: (state: ChartState<TSignatures>) => Value,
  effect: (previous: Value, next: Value) => void,
  /**
   * If true, the selector will be ignored.
   */
  skip?: boolean,
): void {
  const instance = useLazyRef(initialize, {
    store,
    selector,
    skip,
  }).current;

  instance.effect = effect;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(instance.onMount(skip), [skip]);
}

// `useLazyRef` typings are incorrect, `params` should not be optional
function initialize<TSignatures extends readonly ChartAnyPluginSignature[], Value>(params?: {
  store: Store<ChartState<TSignatures>>;
  selector: (state: ChartState<TSignatures>) => Value;
  skip?: boolean;
}) {
  const { store, selector, skip: initialSkip } = params!;

  let isRunning = false;
  let previousState: Value;

  // We want a single subscription done right away and cleared on unmount only,
  // but React triggers `useOnMount` multiple times in dev, so we need to manage
  // the subscription anyway.
  const subscribe = () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    instance.dispose ??= store.subscribe((state) => {
      const nextState = selector(state);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      instance.effect(previousState, nextState);
      previousState = nextState;
    });
  };

  const instance = {
    effect: noop as (previous: Value, next: Value) => void,
    dispose: null as Function | null,
    onMount: (skip?: boolean) => () => {
      if (skip) {
        return undefined;
      }

      if (!isRunning) {
        // Initialize values
        isRunning = true;
        previousState = selector(store.state);
      }

      subscribe();
      return () => {
        instance.dispose?.();
        instance.dispose = null;
      };
    },
  };

  if (!initialSkip) {
    // Initialize values
    isRunning = true;
    previousState = selector(store.state);
    subscribe();
  }

  return instance;
}
