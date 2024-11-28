import { useSyncExternalStore } from 'use-sync-external-store/shim';

const emptySubscribe = () => () => {};

export const useIsSSR = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => false,
    () => true,
  );
