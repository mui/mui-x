// use-sync-external-store has no exports field defined
// See https://github.com/facebook/react/issues/30698
// eslint-disable-next-line import/extensions
import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js';

const emptySubscribe = () => () => {};
const clientSnapshot = () => false;
const serverSnapshot = () => true;

export const useIsSSR = () => useSyncExternalStore(emptySubscribe, clientSnapshot, serverSnapshot);
