import { useSyncExternalStore } from 'use-sync-external-store/shim';

const emptySubscribe = () => () => {};
const clientSnapshot = () => false;
const serverSnapshot = () => true;

export const useIsSSR = () => useSyncExternalStore(emptySubscribe, clientSnapshot, serverSnapshot);
