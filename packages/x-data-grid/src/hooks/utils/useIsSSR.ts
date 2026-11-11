import * as React from 'react';

const emptySubscribe = () => () => {};
const clientSnapshot = () => false;
const serverSnapshot = () => true;

export const useIsSSR = () =>
  React.useSyncExternalStore(emptySubscribe, clientSnapshot, serverSnapshot);
