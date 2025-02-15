// commonjs-only module
// eslint-disable-next-line import/extensions
import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js';

const emptySubscribe = () => () => {};
const clientSnapshot = () => false;
const serverSnapshot = () => true;

export const useIsSSR = () => useSyncExternalStore(emptySubscribe, clientSnapshot, serverSnapshot);
